const fs = require("fs");
const path = require("path");
const {sync:globSync} = require("glob");
const scannerFilePatterns = [
  "src/**/*.{js,css,njk,html}",
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
  fs.writeFileSync(envExamplePath, sanitizedEnvContent, {encoding: "utf-8"});
  console.log(
    process.cwd(),
    ".env-example file has been created with sanitized content.",
  );
} else {
  console.log(process.cwd(), ".env file does not exist.");
}
const combined = {};
const files = scannerFilePatterns.flatMap(pattern => globSync(pattern));
files.forEach((file) => {
  const relativePath = path.relative(process.cwd(), file);
  console.log(process.cwd(), `Processing file: ${relativePath}`);
  const fileContent = fs.readFileSync(file, {encoding: "utf-8"});
  combined[relativePath] = fileContent;
});
fs.writeFileSync(
  path.join(process.cwd(), ".combined.json"),
  JSON.stringify(combined, null, 2), {encoding: "utf-8"});
console.log(
  process.cwd(),
  "All JS files have been combined into .combined.json",
);
