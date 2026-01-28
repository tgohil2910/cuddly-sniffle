/**
 * MongoDB Comprehensive Assignment Autograder
 * Verifies 4 Scenarios: Cities, E-commerce, Phones, University
 */

const { MongoClient } = require("mongodb");
const fs = require("fs");

const MONGO_URL = "mongodb://localhost:27017";
const SCENARIOS = [
    { 
        file: "scenario1.mongodb", 
        db: "geoDB", 
        coll: "cities", 
        count: 20, 
        checks: ["$match", "$group", "$sort", "$project"],
        name: "Scenario 1 (Cities)"
    },
    { 
        file: "scenario2.mongodb", 
        db: "shopDB", 
        coll: "orders", 
        count: 10, 
        checks: ["$match", "$group", "$sort", "$project"], 
        name: "Scenario 2 (E-commerce)"
    },
    { 
        file: "scenario3.mongodb", 
        db: "techDB", 
        coll: "phones", 
        count: 8, 
        checks: ["$unwind", "$group", "$avg"], 
        name: "Scenario 3 (Product Catalog)"
    },
    { 
        file: "scenario4.mongodb", 
        db: "uniDB", 
        coll: "students", 
        count: 8, 
        checks: ["$limit", "$group", "$max", "$min"], 
        name: "Scenario 4 (University)"
    }
];

async function verify() {
    let totalScore = 0;
    const maxScore = 100;
    const pointsPerScenario = 25; 
    
    console.log("========== MongoDB Comprehensive Assessment ==========\n");

    const client = new MongoClient(MONGO_URL);

    try {
        await client.connect();

        for (const scenario of SCENARIOS) {
            let scenarioScore = 0;
            console.log(`Checking ${scenario.name}...`);

            // 1. FILE EXISTENCE (5 points)
            if (fs.existsSync(scenario.file)) {
                scenarioScore += 5;
                console.log(`  [✓] File '${scenario.file}' found.`);
            } else {
                console.log(`  [✗] CRITICAL: File '${scenario.file}' missing!`);
                continue; 
            }

            // 2. STATIC CODE ANALYSIS (10 points)
            const content = fs.readFileSync(scenario.file, "utf8");
            const missingKeywords = scenario.checks.filter(keyword => !content.includes(keyword));
            
            if (missingKeywords.length === 0) {
                scenarioScore += 10;
                console.log(`  [✓] Code Logic: Required operators (${scenario.checks.join(', ')}) detected.`);
            } else {
                console.log(`  [✗] Code Logic: Missing required operators: ${missingKeywords.join(', ')}`);
                if (missingKeywords.length < scenario.checks.length) scenarioScore += 5;
            }

            // 3. DATA VERIFICATION (10 points)
            const db = client.db(scenario.db);
            const collection = db.collection(scenario.coll);
            const count = await collection.countDocuments();

            if (count === scenario.count) {
                scenarioScore += 10;
                console.log(`  [✓] Data Verification: Found ${count} documents in ${scenario.db}.${scenario.coll}.`);
            } else {
                console.log(`  [✗] Data Verification: Expected ${scenario.count} docs, found ${count}.`);
            }

            console.log(`  >> Score for this section: ${scenarioScore} / ${pointsPerScenario}\n`);
            totalScore += scenarioScore;
        }

    } catch (err) {
        console.error("  [!] Database Connection Error:", err.message);
    } finally {
        await client.close();
    }

    console.log("======================================================");
    console.log(`FINAL SCORE: ${totalScore} / ${maxScore}`);
    console.log("======================================================");

    process.exit(totalScore >= 70 ? 0 : 1);
}

verify();
