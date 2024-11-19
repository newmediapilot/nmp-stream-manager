/**
 * File: src\modules\util\combine.js
 * Description: This file contains logic for managing src\modules\util\combine operations.
 * Usage: Import relevant methods/functions as required.
 */
require('dotenv').config(); // Load environment variables from .env
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const jsFilePatterns = [
    "src/**/*.{js,css,njk,html,md,!gif}",
    ".env-example",
    ".gitignore",
    "package.json",
    "README.md",
]

const envFilePath = path.join(process.cwd(), '.env'); // Path to the .env file
const envExamplePath = path.join(process.cwd(), '.env-example'); // Path to the .env-example file

if (fs.existsSync(envFilePath)) {
    const envContent = fs.readFileSync(envFilePath, 'utf-8');

    const sanitizedEnvContent = envContent.split('\n').map(line => {
        const [key] = line.split('='); // Get the key part before "="
        if (key) {
            return `${key}="1234567890_${key}"`;
        }
        return ''; // If no key, return empty line
    }).join('\n');

    fs.writeFileSync(envExamplePath, sanitizedEnvContent);

    console.log('.env-example file has been created with sanitized content.');
} else {
    console.log('.env file does not exist.');
}

const combined = {};

const files = glob.sync(jsFilePatterns);

files.forEach(file => {
    const relativePath = path.relative(process.cwd(), file);

    console.log(`Processing file: ${relativePath}`); // Log the relative path

    const fileContent = fs.readFileSync(file, 'utf-8');
    combined[relativePath] = fileContent;
});

fs.writeFileSync(path.join(process.cwd(), '.combined.json'), JSON.stringify(combined, null, 2));

console.log('All JS files have been combined into .combined.json');