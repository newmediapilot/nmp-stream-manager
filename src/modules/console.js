/**
 * File: src\modules\console.js
 * Description: Logic and operations for src\modules\console.js.
 */

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

console.warn2 = function (dir, ...args) {
  console.log(chalk.bgBlack.white(dir.slice(-12)), chalk.yellow(...args));
};
