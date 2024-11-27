/**
 * File: src\modules\util\uncombine.js
 * Description: This file contains logic for managing src\modules\util\uncombine operations.
 * Usage: Import relevant methods/functions as required.
 */
const fs = require("fs");
const path = require("path");

const combinedJsonPath = path.join(process.cwd(), ".combined.json");

function uncombine() {
  try {
    const combinedData = JSON.parse(fs.readFileSync(combinedJsonPath, "utf-8"));

    for (const filePath in combinedData) {
      const content = combinedData[filePath];
      const absoluteFilePath = path.join(process.cwd(), filePath);

      if (fs.existsSync(absoluteFilePath)) {
        console.log2(
          process.cwd(),
          `Warning: File already exists at ${absoluteFilePath}. It will be overwritten.`,
        );
      }

      const dirPath = path.dirname(absoluteFilePath);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log2(process.cwd(), `Created directory: ${dirPath}`);
      }

      fs.writeFileSync(absoluteFilePath, content, "utf-8");
      console.log2(process.cwd(), `File written: ${absoluteFilePath}`);
    }

    console.log2(process.cwd(), "Uncombining completed successfully.");
  } catch (error) {
    console.log2(process.cwd(), "Error during uncombine process:", error);
  }
}

uncombine();
