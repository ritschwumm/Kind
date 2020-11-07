var fs = require("fs");
var {execSync} = require("child_process");

// Builds fm.js
execSync(`rm fm.js; fmjs main | js-beautify >> fm.js`);

// Runs main.fmfm using fm.js
var fmjs = fs.readFileSync("./fm.js", "utf8");
var fmfm = fs.readFileSync("./main.fmfm", "utf8");
eval(fmjs.replace('"{{FMFM}}"', '`'+fmfm+'`'));
