const glob = require("glob");
function generateAssetLinks() {
  const pattern = "src/client/**/*.*";
  let files = glob.sync(pattern);
  files = files.map((filePath) => filePath.split("\\").join("/"));
  files = files.map((filePath) => filePath.split("src/client").join(""));
  files = files.map((filePath) => {
    return {
      href: filePath,
      type: filePath.split("/")[1],
    };
  });
  console.log2(process.cwd(),"files", files);
  return files;
}
module.exports = { generateAssetLinks };
