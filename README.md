# NPM Stream

This tool is a stream utility that launches a local server compatible with OBS. It enables the following functionalities:

- **Clip**: Create clips on Twitch using a simple API.
- **Tweet**: Send tweets from your account through an integrated API.
- **More integrations**: More integrations can be added as per requirements.

The service only runs locally and uses **ngrok** to send messages between your local server and OBS. This ensures a reliable, local, and secure integration.

**Note**: The service only runs while the localhost is active.

## Prerequisites

Before you can use this tool, ensure the following:

1. **npm**:
    - Install npm (Node Package Manager) on your system.
    - Install required npm dependencies with: `npm install`.

2. **Ngrok**:
    - You'll need an **ngrok** account and a static domain.
    - Sign up and get your ngrok API key here: [Ngrok Sign Up](https://ngrok.com/).
    - Configure ngrok for the static domain to link your local server.

3. **Twitch API Key**:
    - You need a **Twitch Developer API Key** and **Client Secret**.
    - You can get these by registering your application with Twitch here: [Twitch Developer Console](https://dev.twitch.tv/console/apps).

4. **Twitter Developer API Key**:
    - You'll need a **Twitter Developer Account** and API keys.
    - Get your keys from the [Twitter Developer Portal](https://developer.twitter.com/en/apps).

## Configuration

In order to get the service running, fill out the `.secrets-env` file. Each field needs to be populated with your credentials:

- **NGROK_AUTHTOKEN**: Your ngrok API token.
- **TWITCH_CLIENT_ID**: The client ID from your Twitch developer application.
- **TWITCH_CLIENT_SECRET**: The client secret from your Twitch developer application.
- **TWITCH_USERNAME**: Your Twitch username.
- **TWITCH_REDIRECT_URL**: The redirect URL that is registered with Twitch for OAuth.
- **TWITTER_API_KEY**: The API key for your Twitter developer account.
- **TWITTER_API_SECRET**: The API secret for your Twitter developer account.
- **TWITTER_ACCESS_TOKEN**: Your Twitter access token.
- **TWITTER_ACCESS_TOKEN_SECRET**: Your Twitter access token secret.

## API Endpoints

The following API endpoints are defined in the tool:

1. **/tweet**: 
   - Sends a tweet to Twitter.
   - **Params**: `m` (Message to tweet).
   - Returns a confirmation message with the tweet text and rate limit information.

2. **/twitch/login**: 
   - Initiates the Twitch OAuth flow to allow the server to access your Twitch account.
   - **Params**: `twitch_login_intent` (The intended action after login, e.g., create a clip).
   - Returns a redirection to the Twitch login URL.

3. **/twitch/clip**:
   - Creates a clip on Twitch.
   - **Params**: None, but requires valid OAuth tokens (obtained from `/twitch/login`).
   - Returns the URL of the created clip.

4. **/twitch/clip/create**:
   - An endpoint triggered to actually create a clip on Twitch.
   - **Params**: None.
   - Returns the URL of the created clip.

## File Tree

```plaintext
.
├── .env-example               # Example environment configuration file
├── .gitignore                 # Git ignore file to exclude sensitive data
├── package.json               # Node.js dependencies and scripts
├── src
│   ├── index.js               # Main server file that initializes the app and routes
│   ├── helpers
│   │   ├── ngrok              # ngrok launcher
│   │   │   └── launcher.js    # Starts ngrok and returns the public URL
│   │   ├── store              # Store the state and tokens
│   │   │   └── manager.js     # Manages the secret tokens
│   │   ├── twitch             # Twitch-related operations
│   │   │   ├── clip.js        # Handles creating clips on Twitch
│   │   │   └── oauth.js       # Handles Twitch OAuth flow
│   │   └── twitter            # Twitter-related operations
│   │       └── sender.js      # Sends tweets via Twitter API
│   └── helpers
│       ├── util
│       │   ├── combine.js     # Combines files into one
│       │   └── uncombine.js   # Uncombines files from combined JSON
└── .combined.json             # Contains combined content of all files for easy distribution
```

## How to Run the Application

1. Install the required dependencies:
   ```bash
   npm install
   ```
2. Set up your API keys and static domain as described in the configuration section.
3. Start the server:
   ```bash
   npm start
   ```
4. Ngrok will expose your local server to a public URL. You can use this URL with OBS to send messages and interact with the tool.

5. Access the endpoints for creating clips, tweeting, and more.

