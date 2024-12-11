const chalk = require("chalk");
console.log2 = function (dir, ...args) {
    console.log(chalk.bgBlack.white(dir.slice(-12)), chalk.green(...args));
};
console.err2 = function (dir, ...args) {
    console.log(chalk.bgBlack.white(dir.slice(-12)), chalk.red(...args));
};
console.info2 = function (dir, ...args) {
    console.log(chalk.bgBlack.white(dir.slice(-12)), chalk.blue(...args));
};
ole.warn2 = function (dir, ...args) {
    console.log(chalk.bgBlack.white(dir.slice(-12)), chalk.yellow(...args));
};