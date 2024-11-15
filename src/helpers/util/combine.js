require('dotenv').config(); // Load environment variables from .env
const fs = require('fs');
const path = require('path');

// Path to the .env and .env-example files
const envFilePath = path.join(process.cwd(), '.env'); // Path to the .env file
const envExamplePath = path.join(process.cwd(), '.env-example'); // Path to the .env-example file

// Handle .env file to create .env-example with mock values
if (fs.existsSync(envFilePath)) {
    const envContent = fs.readFileSync(envFilePath, 'utf-8');

    // Remove everything after '=' on each line and add mock values
    const sanitizedEnvContent = envContent.split('\n').map(line => {
        const index = line.indexOf('='); // Find the '=' symbol
        if (index !== -1) {
            const key = line.substring(0, index); // Extract the key
            return `${key}="1234567890_${key}"`; // Add the mock value with the key
        }
        return line; // If no '=', return the line as is
    }).join('\n'); // Rejoin the lines with preserved line breaks

    // Save the sanitized content as .env-example
    fs.writeFileSync(envExamplePath, sanitizedEnvContent);

    console.log('.env-example file has been created with mock values.');
} else {
    console.log('.env file does not exist.');
}
