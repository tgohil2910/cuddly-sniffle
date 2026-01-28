const fs = require('fs');

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log("Usage: node grader.js <filename> <part_id>");
    process.exit(1);
}

const filename = args[0];
const partId = args[1];

// Configuration for all scenarios and parts
const config = {
    'scenario1.mongodb': {
        '1':   { search: 'Part 1',       required: ['$match', 'South America', '$sort', 'name'] },
        '2.1': { search: '1. Average',   required: ['$group', '$continent', '$avg'] },
        '2.2': { search: '2. Counting',  required: ['$group', '$country', '$sum', '$match', '$gte'] },
        '3':   { search: 'Part 3',       required: ['$match', 'Asia', '$project'] },
        '4':   { search: 'Part 4',       required: ['$match', '15', '$group', '$sort', '$project'] }
    },
    'scenario2.mongodb': {
        '1': { search: 'Part 1', required: ['$match', 'completed', '$project'] },
        '2': { search: 'Part 2', required: ['$match', 'completed', '$group', '$avg'] },
        '3': { search: 'Part 3', required: ['$match', 'completed', '$group', '$sum', '$sort'] },
        '4': { search: 'Part 4', required: ['$match', '$group', '$gt', '1000', '$sort', '$project'] }
    },
    'scenario3.mongodb': {
        '1': { search: 'Part 1', required: ['$group', '$avg', '$project'] },
        '2': { search: 'Part 2', required: ['$unwind', '$group', '$sum', '$sort'] },
        '3': { search: 'Part 3', required: ['$match', '700', '$sort', '$project'] },
        '4': { search: 'Part 4', required: ['$match', '5G', '$group', '$avg', '$sort', '$project'] }
    },
    'scenario4.mongodb': {
        '1': { search: 'Part 1', required: ['$group', '$min', '$max', '$avg', '$project'] },
        '2': { search: 'Part 2', required: ['$match', '4', '3.5', '$sort', '$project'] },
        '3': { search: 'Part 3', required: ['$group', '$sum', '$sort', '$project'] },
        '4': { search: 'Part 4', required: ['$match', '3.5', '$group', '$sum', '$sort', '$limit', '$project'] }
    }
};

try {
    if (!fs.existsSync(filename)) {
        console.log(`FAIL: File ${filename} not found.`);
        process.exit(1);
    }

    const content = fs.readFileSync(filename, 'utf8');
    const taskConfig = config[filename][partId];

    if (!taskConfig) {
        console.log(`FAIL: Configuration not found for ${filename} Part ${partId}`);
        process.exit(1);
    }

    // Find the code block for this part using the search term
    // parsing roughly from the search header to the next 'db.' call or end of part
    
    // Simple heuristic: split the file by "db.collection.aggregate" calls 
    // and find the one that follows our search comment.
    
    // But since syntax is strict "db.collection.aggregate", let's normalize
    // We look for the comment, then capture the content inside the next [ ... ] brackets of an aggregate call.
    
    // Regex explanation:
    // 1. Find the search term (comment)
    // 2. Look ahead for 'aggregate(['
    // 3. Capture everything inside the brackets []
    
    // Escaping special regex chars in search term just in case (though ours are simple)
    const escapedSearch = taskConfig.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Matches: // SearchTerm ... (any chars) ... .aggregate([ (CAPTURE) ])
    const regex = new RegExp(`//\\s*${escapedSearch}[\\s\\S]*?\\.aggregate\\(\\[([\\s\\S]*?)\\]\\)`);
    const match = content.match(regex);

    if (!match) {
        console.log(`FAIL: Could not find code block for Part ${partId} (searched for "${taskConfig.search}")`);
        process.exit(1);
    }

    const codeSnippet = match[1];
    
    // Check required keywords
    const missing = [];
    for (const req of taskConfig.required) {
        if (!codeSnippet.includes(req)) {
            missing.push(req);
        }
    }

    if (missing.length === 0) {
        console.log(`PASS: Part ${partId} contains all required specific commands.`);
    } else {
        console.log(`FAIL: Part ${partId} missing required commands: ${missing.join(', ')}`);
        process.exit(1);
    }

} catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exit(1);
}
