const password123 = `localPa$$123`;
const pathIn = `C:\\Users\\marcinzajkowski\\Desktop\\desktop\\aaknot\\server\\.cert\\cert.pfx`;
const pathOut = `C:\\Users\\marcinzajkowski\\Desktop\\desktop\\aaknot\\server\\.cert\\cert.key`;
const fs = require('fs');
const path = require('path');
const {execSync} = require('child_process');
execSync(`openssl pkcs12 -in "${pathIn}" -nocerts -out "${pathOut}"`);
