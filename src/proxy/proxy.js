const express = require('express');
const https = require('https');
const app = express();
app.all('/', (req, res) => {
    res.send(`Service online ${req.path}`);
});
https
    .createServer({
        key: `key-xxx`,
        cert: `cert-xxx`,
    }, app)
    .listen(443, () => {
        console.log('Server running');
    });