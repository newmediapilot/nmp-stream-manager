const chalk = require("chalk");

console.log2 = function (dir, ...args) {
  console.log(chalk.bgBlack.white(dir), chalk.green(...args));
};

console.err2 = function (dir, ...args) {
  console.log(chalk.bgBlack.white(dir), chalk.red(...args));
};

console.info2 = function (dir, ...args) {
  console.log(chalk.bgBlack.white(dir), chalk.blue(...args));
};

console.warn2 = function (dir, ...args) {
  console.log(chalk.bgBlack.white(dir), chalk.yellow(...args));
};