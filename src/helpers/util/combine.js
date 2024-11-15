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

// Path to the .env and .env-example files
const envFilePath = path.join(process.cwd(), '.env'); // Path to the .env file
const envExamplePath = path.join(process.cwd(), '.env-example'); // Path to the .env-example file

// Handle .env file to create .env-example without sensitive data
if (fs.existsSync(envFilePath)) {
    const envContent = fs.readFileSync(envFilePath, 'utf-8');

    // Remove sensitive data after "=" signs
    const sanitizedEnvContent = envContent.split('\n').map(line => {
        const [key] = line.split('='); // Get the key part before "="
        return key ? `${key}=` : ''; // Keep the key with an empty value
    }).join('\n');

    // Save the sanitized content as .env-example
    fs.writeFileSync(envExamplePath, sanitizedEnvContent);

    console.log('.env-example file has been created with sanitized content.');
} else {
    console.log('.env file does not exist.');
}

// Initialize an object to hold the combined content
const combined = {};

// Use globSync to find all the JS files matching the patterns
const files = glob.sync(jsFilePatterns);

// Process and combine files
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
