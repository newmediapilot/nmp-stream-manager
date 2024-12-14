
# NMP Stream Manager

NMP Stream Manager is a comprehensive utility designed for Twitch streamers. It integrates multiple API endpoints to enhance your streaming experience, including Twitter integration, Twitch clip creation, command management, and sensor data logging. The application also features a simple HTML interface for managing Twitch commands.

## Features

- **Twitter Integration**: Post tweets directly from the app with customizable messages and predefined hashtags.
- **Twitch Integration**:
  - Authenticate using Twitch OAuth.
  - Create clips for your stream.
  - Manage Twitch chat commands dynamically (add, remove, or update commands).
- **Sensor Logging**: Fetch sensor data (e.g., heart rate) via a Sensor Logger app and log it locally or use it in-stream.
- **Customizable Interface**: Modify Twitch commands through a settings page built using Nunjucks templates.

---

## Configuration

1. Clone the repository and install dependencies:
   ```bash
   npm install
   ```

2. Copy the `.env-example` file to `.env`:
   ```bash
   cp .env-example .env
   ```

3. Open the `.env` file and update it with your credentials for Ngrok, Twitch, Twitter, and the Sensor Logger.

---

## Prerequisites

To run the app, ensure you have the following installed:

1. **Node.js and npm**:
   - Install [Node.js](https://nodejs.org/) and npm (comes with Node.js).

2. **Ngrok**:
   - Create an [Ngrok account](https://ngrok.com/), generate your API key, and set up a static domain.
   - Store your Ngrok API key and static domain in the `.env` file.

3. **Twitch Developer Account**:
   - Create a [Twitch Developer Account](https://dev.twitch.tv/console/apps) and generate a client ID, client secret, and OAuth redirect URL.
   - Store these in the `.env` file.

4. **Twitter Developer Account**:
   - Create a [Twitter Developer Account](https://developer.twitter.com/en/apps) and generate your Twitter API key and secret.
   - Store these in the `.env` file.

5. **Sensor Logger App**:
   - Use the Awesome Sensor Logger app to fetch heart rate data and ensure it posts JSON data.

---

## API Endpoints

### Twitter
- **`/twitter/tweet`**
  - **Method**: `GET`
  - **Description**: Post a tweet with a custom message and predefined hashtags.
  - **Params**: `tweet_message` (Your tweet message)

### Twitch
- **`/twitch/login`**
  - **Method**: `GET`
  - **Description**: Redirects to Twitch for OAuth login.

- **`/twitch/login/success`**
  - **Method**: `GET`
  - **Description**: Handles the OAuth redirect and captures the access token.

- **`/twitch/clip/create`**
  - **Method**: `GET`
  - **Description**: Create a clip from your Twitch stream.

- **`/twitch/command/set`**
  - **Method**: `GET`
  - **Description**: Add a Twitch command to the chatbot.

- **`/twitch/command/unset`**
  - **Method**: `GET`
  - **Description**: Remove a Twitch command from the chatbot.

- **`/twitch/command/create`**
  - **Method**: `GET`
  - **Description**: Replace an existing Twitch command with a new one.

### Sensor Logger
- **`/sensor/data`**
  - **Method**: `GET`
  - **Description**: Fetch sensor data from the configured Sensor Logger.

---

## File Structure

```plaintext
nmp-stream-manager/
├── .env-example
├── .gitignore
├── package.json
├── README.md
└── src/
    ├── index.js
    ├── modules/
    │   ├── ngrok/
    │   │   └── launch.js
    │   ├── sensor/
    │   │   └── data.js
    │   ├── store/
    │   │   └── manager.js
    │   ├── twitter/
    │   │   └── tweet.js
    │   ├── twitch/
    │   │   ├── clip.js
    │   │   ├── configure.js
    │   │   ├── login.js
    │   │   └── success.js
    │   ├── nunjucks/
    │   │   └── configure.js
    │   └── util/
    │       ├── combine.js
    │       └── uncombine.js
    ├── routes.js
    ├── views/
    │   ├── layouts/
    │   │   └── main.njk
    │   ├── partials/
    │   │   ├── footer.njk
    │   │   └── header.njk
    │   ├── macros/
    │   │   └── form_loop.njk
    │   └── settings.html
    └── assets/
        ├── css/
        │   └── main.css
        └── js/
            └── form_loop.js
```

---

## Running the App

1. Start the app:
   ```bash
   npm start
   ```

2. The app will launch the Twitch login page automatically for authentication.

---

## Important Notes

- **StreamElements Integration**: Use StreamElements chatbots to trigger API endpoints via custom commands. Refer to API examples for command setup.
- **Security**: Ensure API commands are restricted to "Broadcaster" or "Moderator" roles to prevent unauthorized access.
- **Dynamic Command Updates**: Commands like `/clip` and `/tweet` are dynamically added and managed via the app.

---

