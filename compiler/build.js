console.time("Build :: complete");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const {execSync} = require("child_process");
const crypto = require("crypto");
const execa = require("execa");
let length = 1;
(async () => {
    try {
        Array.from({length})
            .map((_, index) => crypto.createHash('sha256').update(String(index)).digest('hex'))
            .map(async (hash) => {
                    const a = await execa('npm', ['run', 'concat', hash]);
                    const b = await execa('npm', ['run', 'snapshot', hash]);
                    const c = await execa('npm', ['run', 'compile', hash]);
                    const d = await execa('npm', ['run', 's3', hash]);
                    const e = await execa('npm', ['run', 'cloudfront', hash]);
                    return [a, b, c, d, e];
                }
            );
    } catch (error) {
        console.error('build :: error', error.message);
    } finally {
        console.error('build :: done', length);
    }
})();