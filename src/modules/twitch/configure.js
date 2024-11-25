const {getParam, setSecret, getSecret} = require('../store/manager');
const {twitchMessageCreate} = require('./message');
const ROUTES = require('../../routes');
const chalk = require('chalk');

// Timeout before next action
const TIMEOUT_WAIT = 2000;

// Blocks concurrent configure calls to `twitchMessageConfigure`
let hasConfigured = false;

/**
 * Pings chat to retrieve headers which we will verify against subsequent requests.
 */
async function twitchCommandSetup(req, res) {

    const COMMANDS = {
        configure: {
            call: `!configure`,
            remove: `!command remove configure`,
            add: `!command add configure $(customapi.${getParam('public_url')}${ROUTES.TWITCH_MESSAGE_CONFIGURE})`,
        },
        tweet: {
            call: `!tweet`,
            remove: `!command remove tweet`,
            add: `!command add tweet $(customapi.${getParam('public_url')}${ROUTES.TWITTER_TWEET}?tweet_message=$(1:))`,
        },
        clip: {
            call: `!clip`,
            remove: `!command remove clip`,
            add: `!command add clip $(customapi.${getParam('public_url')}${ROUTES.TWITCH_CLIP_CREATE})`,
        },
    }

    try {

        // configure
        console.log(chalk.bgBlackBright.cyanBright('twitchCommandSetup.start::configure => START'));
        await twitchMessageCreate(COMMANDS.configure.remove, res, true);
        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));
        await twitchMessageCreate(COMMANDS.configure.add, res, true);
        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));
        await twitchMessageCreate(COMMANDS.configure.call, res, true);
        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));
        await twitchMessageCreate(COMMANDS.configure.remove, res);
        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));
        console.log(chalk.bgBlackBright.cyanBright('twitchCommandSetup.start::configure => DONE'));
        console.log('');

        // clip
        console.log(chalk.bgBlackBright.cyanBright('twitchCommandSetup.start::clip => START'));
        await twitchMessageCreate(COMMANDS.clip.remove, res);
        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));
        await twitchMessageCreate(COMMANDS.clip.add, res);
        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));
        console.log(chalk.bgBlackBright.cyanBright('twitchCommandSetup.start::clip => DONE'));
        console.log('');

        // tweet
        console.log(chalk.bgBlackBright.cyanBright('twitchCommandSetup.start::tweet => START'));
        await twitchMessageCreate(COMMANDS.tweet.remove, res);
        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));
        await twitchMessageCreate(COMMANDS.tweet.add, res);
        await new Promise(r => setTimeout(r, TIMEOUT_WAIT));
        console.log(chalk.bgBlackBright.cyanBright('twitchCommandSetup.start::tweet => DONE'));
        console.log('');

    } catch (error) {

        console.log(chalk.green('Error in twitchCommandSetup:', error.status));
        throw Error(error);

    }
}

/**
 * Used to extract chatbot configuration information.
 * Only the chatbot may use this API endpoint
 * Once the headers are captured we use them to
 * Gatekeep any follow-up requests
 */
async function twitchMessageConfigure(req, res) {

    console.log(chalk.blue('Start configure'));

    if (hasConfigured) return res.send(`Configure recall forbidden.`);

    if (
        req.headers['host'] === process.env.NGROK_URL &&
        req.headers['user-agent'] === 'StreamElements Bot'
    ) {
        setSecret('twitch_bot_headers', {
                'host': process.env.NGROK_URL,
                'user-agent': 'StreamElements Bot',
                'cf-connecting-ip': req.headers['cf-connecting-ip'],
                'cf-worker': req.headers['cf-worker'],
                'x-forwarded-host': process.env.NGROK_URL,
                'x-streamelements-channel': req.headers['x-streamelements-channel']
            }
        );

        hasConfigured = true;

        return res.send(`Configure ready`);
    }

    return res.send(`Configure forbidden.`);
}

module.exports = {
    twitchCommandSetup,
    twitchMessageConfigure,
};
