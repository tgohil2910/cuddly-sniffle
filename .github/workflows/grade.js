const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(MONGODB_URI);

async function runTests() {
  let totalPoints = 0;
  const maxPoints = 85; // 17 tasks * 5 points

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const scenarios = [
      { name: 'scenario1', db: 'geoDB', collection: 'cities', tasks: ['part1', 'part2_task1', 'part2_task2', 'part3', 'part4'] },
      { name: 'scenario2', db: 'shopDB', collection: 'orders', tasks: ['part1', 'part2', 'part3', 'part4'] },
      { name: 'scenario3', db: 'techDB', collection: 'phones', tasks: ['part1', 'part2', 'part3', 'part4'] },
      { name: 'scenario4', db: 'uniDB', collection: 'students', tasks: ['part1', 'part2', 'part3', 'part4'] }
    ];

    for (const scenario of scenarios) {
      const { name, db: dbName, collection: collName, tasks } = scenario;

      // Load data and expected
      const dataPath = path.join(__dirname, '..', '..', 'tests', `${name}_data.json`);
      const expectedPath = path.join(__dirname, '..', '..', 'tests', `${name}_expected.json`);
      const studentPath = path.join(__dirname, '..', '..', `${name}.mongodb`);

      if (!fs.existsSync(studentPath)) {
        console.log(`Student file ${name}.mongodb not found`);
        continue;
      }

      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      const expected = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
      const studentPipelines = require(studentPath);

      const db = client.db(dbName);
      const collection = db.collection(collName);

      // Clear and insert data
      await collection.deleteMany({});
      await collection.insertMany(data);

      for (const task of tasks) {
        const pipeline = studentPipelines[task];
        if (!pipeline) {
          console.log(`Pipeline for ${name}:${task} not found`);
          continue;
        }

        try {
          const result = await collection.aggregate(pipeline).toArray();
          const exp = expected[task];

          if (arraysEqual(result, exp)) {
            totalPoints += 5;
            console.log(`${name}:${task} - PASS`);
          } else {
            console.log(`${name}:${task} - FAIL`);
            console.log('Expected:', JSON.stringify(exp, null, 2));
            console.log('Got:', JSON.stringify(result, null, 2));
          }
        } catch (error) {
          console.log(`${name}:${task} - ERROR: ${error.message}`);
        }
      }
    }

  } catch (error) {
    console.error('Test error:', error);
  } finally {
    await client.close();
  }

  console.log(`Total points: ${totalPoints}/${maxPoints}`);
  // Output only the points for GitHub Actions
  process.stdout.write(totalPoints.toString());
}

function arraysEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!objectsEqual(a[i], b[i])) return false;
  }
  return true;
}

function objectsEqual(a, b) {
  const keysA = Object.keys(a).sort();
  const keysB = Object.keys(b).sort();
  if (keysA.length !== keysB.length) return false;
  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    const valA = a[key];
    const valB = b[key];
    if (typeof valA === 'number' && typeof valB === 'number') {
      if (Math.abs(valA - valB) > 0.01) return false; // tolerance for floats
    } else if (valA !== valB) {
      return false;
    }
  }
  return true;
}

runTests();