const fs = require("fs");
const path = require("path");

const featuresDir = path.resolve(__dirname, "../features");
const files = fs.readdirSync(featuresDir).filter(f => f.endsWith(".feature"));
console.log(JSON.stringify(files.map(f => f.replace(".feature", ""))));
