/**
 * File: src\modules\util\combine.js
 * Description: Logic and operations for src\modules\util\combine.js.
 */

/**
 * File: src\modules\util\combine.js
 * Description: This file contains logic for managing src\modules\util\combine operations.
 * Usage: Import relevant methods/functions as required.
 */

const fs = require("fs");
const path = require("path");
const glob = require("glob");

const jsFilePatterns = [
  "src/**/*.{js,css,njk,html,md,!gif}",
  ".env-example",
  ".gitignore",
  "package.json",
  "README.md",
];

const envFilePath = path.join(process.cwd(), ".env");
const envExamplePath = path.join(process.cwd(), ".env-example");

if (fs.existsSync(envFilePath)) {
  const envContent = fs.readFileSync(envFilePath, "utf-8");

  const sanitizedEnvContent = envContent
    .split("\n")
    .map((line) => {
      const [key] = line.split("=");
      if (key) {
        return `${key}="1234567890_${key}"`;
      }
      return "";
    })
    .join("\n");

  fs.writeFileSync(envExamplePath, sanitizedEnvContent);

  console.log(
    process.cwd(),
    ".env-example file has been created with sanitized content.",
  );
} else {
  console.log(process.cwd(), ".env file does not exist.");
}

const combined = {};

const files = glob.sync(jsFilePatterns);

files.forEach((file) => {
  const relativePath = path.relative(process.cwd(), file);

  console.log(process.cwd(), `Processing file: ${relativePath}`);

  const fileContent = fs.readFileSync(file, "utf-8");
  combined[relativePath] = fileContent;
});

fs.writeFileSync(
  path.join(process.cwd(), ".combined.json"),
  JSON.stringify(combined, null, 2),
);

console.log(
  process.cwd(),
  "All JS files have been combined into .combined.json",
);
