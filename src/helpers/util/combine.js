require('dotenv').config(); // Load environment variables from .env
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Specify the glob pattern for your JS files (including subdirectories)
const jsFilePatterns = [
    "src/**/*.js", // This will match all JS files in 'src' and subdirectories
    ".env-example",
    ".gitignore",
    "package.json",
];

// Initialize an object to hold the combined content
const combined = {};

// Use globSync to find all the JS files matching the patterns
const files = glob.sync(jsFilePatterns);

files.forEach(file => {
    // Get the relative path based on the current working directory
    const relativePath = path.relative(process.cwd(), file);

    // Log the absolute and relative paths of each file
    console.log(`Processing file: ${relativePath}`); // Log the relative path

    const fileContent = fs.readFileSync(file, 'utf-8');
    combined[relativePath] = fileContent;
});

// Write the combined object to .combined.json
fs.writeFileSync(path.join(process.cwd(), '.combined.json'), JSON.stringify(combined, null, 2));

console.log('All JS files have been combined into .combined.json');
