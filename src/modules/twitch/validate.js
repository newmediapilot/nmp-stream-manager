const {getSecret} = require('../store/manager');

/**
 * Compare the request header with the configured header
 * If they don't match stop the request
 * @param req
 */
function validBotHeaders(req) {

    const headers = getSecret('twitch_bot_headers');

    console.log('validBotHeaders.headers :: ', !!headers);
    if (!headers) return false;

    const mapped = Object.keys(headers).map(key => {
        const a = headers[key]
        const b = req.headers[key];
        const c = a === b;
        console.log(`validBotHeaders.headers :: [${c}] ${a} => ${b}`);
        return c;
    });

    return false === mapped.includes(false);

}

/**
 * Wrapper to secure specific paths
 * @param next call
 */
function validateBot(next) {
    return (req, res) => {
        if (!validBotHeaders(req)) {
            return res.send('Invalid agent.');
        } else {
            return next(req, res);
        }
    }
}

module.exports = {
    validateBot
};
