const fs = require('fs');
const path = require('path');

// Path to the combined JSON file
const combinedJsonPath = path.join(process.cwd(), '.combined.json');

// Function to write content back to the files
function uncombine() {
    try {
        // Read the combined JSON file
        const combinedData = JSON.parse(fs.readFileSync(combinedJsonPath, 'utf-8'));

        // Iterate through each file in the combined data
        for (const filePath in combinedData) {
            const content = combinedData[filePath];
            const absoluteFilePath = path.join(process.cwd(), filePath);

            // Check if the file exists
            if (fs.existsSync(absoluteFilePath)) {
                console.log(`Warning: File already exists at ${absoluteFilePath}. It will be overwritten.`);
            }

            // Create directories if they don't exist
            const dirPath = path.dirname(absoluteFilePath);
            if (!fs.existsSync(dirPath)) {
                fs.mkdirSync(dirPath, { recursive: true });
                console.log(`Created directory: ${dirPath}`);
            }

            // Write the content to the respective file
            fs.writeFileSync(absoluteFilePath, content, 'utf-8');
            console.log(`File written: ${absoluteFilePath}`);
        }

        console.log('Uncombining completed successfully.');
    } catch (error) {
        console.error('Error during uncombine process:', error);
    }
}

// Run the uncombine function
uncombine();
