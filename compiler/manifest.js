const fs = require('fs');
const {sync: globSync} = require('glob');
const hash = process.argv[2] || 'demo';
const manifestJSON = JSON.parse(fs.readFileSync(globSync("src/client/demo/manifest.json")[0], {encoding: "utf-8"}));
manifestJSON.start_url = `/${hash}/start.html`;
fs.writeFileSync(
    'manifest.json',
    JSON.stringify(manifestJSON),
    {encoding: 'utf-8'}
);