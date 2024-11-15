
# Stream Utility Tool

This tool is a stream utility that launches a local server compatible with OBS. It enables various integrations such as:

- Tweeting via Twitter API
- Creating clips on Twitch

The tool only runs locally and uses ngrok to send messages between your local server and OBS, providing reliable, local, and secure integration.

This service only runs while the localhost is active.

## Prerequisites

### NPM

Make sure you have `npm` installed. You will also need to generate an API key and a static domain for ngrok. For more information, visit [ngrok](https://ngrok.com/).

### Ngrok

You need an [ngrok account](https://ngrok.com/), and you will need to generate an API key and a static domain. The static domain will be used to expose your local server to the internet securely.

### Twitch API Key

You need a [Twitch developer account](https://dev.twitch.tv/) and create an API key and secret to enable Twitch integration.

### Twitter API Key

You need a [Twitter Developer account](https://developer.twitter.com/en/apps) and generate your API key and secret for Twitter integration.

## Configuration

You will need to fill out the `.secrets-env` file with the following details:

- **NGROK_AUTHTOKEN**: Your ngrok auth token.
- **TWITCH_CLIENT_ID**: Your Twitch client ID.
- **TWITCH_CLIENT_SECRET**: Your Twitch client secret.
- **TWITCH_USERNAME**: Your Twitch username.
- **TWITCH_REDIRECT_URL**: The ngrok-generated URL that Twitch will redirect to after authentication.
- **TWITTER_API_KEY**: Your Twitter API key.
- **TWITTER_API_SECRET**: Your Twitter API secret.
- **TWITTER_ACCESS_TOKEN**: Your Twitter access token.
- **TWITTER_ACCESS_TOKEN_SECRET**: Your Twitter access token secret.

## API Endpoints

### `/tweet`

- **POST**: `$(customapi.https://12345.ngrok-free.app/tweet?m=$(1:))`
- This endpoint posts a tweet with the message provided in the query parameter `m`.
- It returns a success message along with the tweet content and remaining tweets in the 24-hour limit.

### `/twitch/clip`

- **POST**: `$(customapi.https://12345.ngrok-free.app/twitch/clip)`
- This endpoint creates a clip on your Twitch channel.
- The first time you open the server, you will need to click on the link in the console to generate your access codes. These codes will be stored under a hidden file called `.secrets`.
- Once you have a `.secrets` file, you will be able to create clips from Streamlabs while the server is up and running.

**Console log for the first-time access**:

```
App service running locally on http://localhost:80
TWEET: http://localhost:80/tweet?m=HelloWorld
Twitch LOGIN: http://localhost:80/twitch/login?twitch_login_intent=/twitch/clip/create
CLIP: http://localhost:80/twitch/clip
```
After clicking on the URL, you will be redirected to generate your access codes.

## File Tree

```
.
├── .env-example
├── .gitignore
├── package.json
├── src
│   ├── index.js
│   ├── helpers
│   │   ├── ngrok
│   │   │   └── launch.js
│   │   ├── store
│   │   │   └── manager.js
│   │   ├── twitch
│   │   │   ├── clip.js
│   │   │   └── login.js
│   │   └── twitter
│   │       └── tweet.js
│   └── helpers
│       ├── util
│       │   ├── combine.js
│       │   └── uncombine.js
├── .combined.json
└── .secrets
```

## License

This project is licensed under the MIT License.
