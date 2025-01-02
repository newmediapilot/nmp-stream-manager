const express = require('express');
const https = require('https');
const app = express();
app.all('/', (req, res) => {
  res.send('Hello from Express!');
});
const certs = {
    key: `key-xxx`,
    cert: `cert-xxx`,
};
https.createServer(certs, app)
.listen(443, () => {
    console.log('Server running on https://localhost');
});