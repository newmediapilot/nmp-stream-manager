// src/console.js
const chalk = require('chalk');

// Extend the console object with additional methods
console.log2 = function (dir, ...args) {
    console.log(chalk.green(`[${dir}]`), ...args);
};

console.err2 = function (dir, ...args) {
    console.log(chalk.red(`[${dir}]`), ...args);
};

console.info2 = function (dir, ...args) {
    console.log(chalk.blue(`[${dir}]`), ...args);
};

console.warn2 = function (dir, ...args) {
    console.log(chalk.yellow(`[${dir}]`), ...args);
};