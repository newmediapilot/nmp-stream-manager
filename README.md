
# Stream Utility Tool

## Overview
This tool is a stream utility that launches a local server compatible with OBS. It enables us to:
- Create Twitch clips
- Post tweets to Twitter
- More integrations can be added in the future

This tool runs locally and uses ngrok to send messages between your local server and OBS. It allows reliable, local, and secure integration with your streaming setup.

The server will only run while your localhost is active.

## Prerequisites

### npm
You need to have **npm** installed. If it's not installed, follow the [npm installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm).

### Ngrok
You will also need **ngrok** to expose your local server to the internet. You can get it from [ngrok's official site](https://ngrok.com/). After registering, you'll get an API key and a static domain.

### Twitch Developer Account
You'll need a **Twitch Developer API key and secret**. To create your account and generate keys, follow [this link](https://dev.twitch.tv/docs/authentication/).

### Twitter Developer Account
You'll need a **Twitter Developer API key and secret**. To apply for access, follow [this link](https://developer.twitter.com/en/docs/authentication/oauth-1-0a).

## Configuration

After setting up the prerequisites, you need to fill out the `.secrets-env` file with the following fields:
- `NGROK_AUTHTOKEN`: Your ngrok API key.
- `TWITCH_CLIENT_ID`: Your Twitch API Client ID.
- `TWITCH_CLIENT_SECRET`: Your Twitch API Client Secret.
- `TWITCH_USERNAME`: Your Twitch username.
- `TWITCH_REDIRECT_URL`: The redirect URL used in your Twitch authentication flow.
- `TWITTER_API_KEY`: Your Twitter API key.
- `TWITTER_API_SECRET`: Your Twitter API secret.
- `TWITTER_ACCESS_TOKEN`: Your Twitter access token.
- `TWITTER_ACCESS_TOKEN_SECRET`: Your Twitter access token secret.

## API Endpoints

### `/tweet`
- **Description**: Post a tweet to Twitter.
- **Params**:
  - `m`: The message for the tweet.
  
- **Note**: This endpoint will post the provided message to Twitter.

### `/twitch/login`
- **Description**: This is the initial endpoint to initiate the OAuth flow with Twitch.
- **Params**:
  - `twitch_login_intent`: The path you want to navigate to after successful login (e.g., `/twitch/redirect/clip`).
  
- **Note**: This will redirect you to the Twitch authentication page. After successful login, it will redirect to the specified `twitch_login_intent`.

### `/twitch/clip`
- **Description**: This endpoint allows you to create a clip on Twitch.
- **Params**:
  - `twitch_clip_title`: The title for the clip you want to create.
  
- **Note**:
  - The first time you run the server, you will need to click on the link generated in the console to authenticate and generate your access codes. These will be stored in a hidden file called `.secrets`. The console log will look something like this:
  
  ```
  App service running locally on http://localhost:80
  TWEET: https://12345.ngrok-free.app/tweet?m=HelloWorld
  Twitch LOGIN: https://12345.ngrok-free.app/twitch/login?twitch_login_intent=/twitch/redirect/clip
  CLIP: https://12345.ngrok-free.app/twitch/clip
  ```
  
  - **Highlight the link** in the console: **https://12345.ngrok-free.app/twitch/login?twitch_login_intent=/twitch/redirect/clip**.
  - After generating the `.secrets` file, you will be able to create clips from Streamlabs while the server is up and running.

## File Tree

```
├── .env-example
├── .gitignore
├── package.json
└── src
    ├── index.js
    ├── helpers
    │   ├── util
    │   │   ├── combine.js
    │   │   └── uncombine.js
    │   ├── twitter
    │   │   └── sender.js
    │   ├── twitch
    │   │   ├── oauth.js
    │   │   └── clip.js
    │   └── store
    │       └── manager.js
    └── helpers
        └── ngrok
            └── launcher.js
```

## Usage

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Fill out the `.secrets-env` file with your API keys and required configuration.
4. Run the server using `npm start`.
5. Use ngrok to expose your local server and get a public URL.
6. Access the API endpoints via the ngrok URL.

