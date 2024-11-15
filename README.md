
# NMP Stream Manager

NMP Stream Manager is a stream utility designed for Twitch streamers. It integrates various API endpoints to help manage your stream, including Twitter tweets, Twitch clips, and sensor data logging. This utility automatically opens the Twitch login page when launched, enabling seamless integration for the other API endpoints.

## Features

- **Twitter Integration**: Tweet directly from the app using custom messages and hashtags.
- **Twitch Integration**: Log in to your Twitch account and create clips for your stream.
- **Sensor Logging**: Fetch heart rate data (or any other sensor data) and log it locally.

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

3. Open the `.env` file and update it with your credentials for Ngrok, Twitch, Twitter, and Sensor Logger.

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
   - Use the Awesome Sensor Logger app to fetch heart rate data and make sure it posts JSON data.

---

## API Endpoints

### `/twitter/tweet`
- **Method**: `GET`
- **Description**: Post a tweet with a custom message and hashtags.
- **Params**: `tweet_message` (Your tweet message)
- **Usage**:
  ```bash
  $(customapi.https://12345.ngrok-free.app/twitter/tweet?tweet_message=HelloWorld)
  ```

### `/twitch/login`
- **Method**: `GET`
- **Description**: Redirects to Twitch for OAuth login.
- **Params**: `twitch_login_intent` (Specify where to redirect after successful login)
- **Usage**:
  ```bash
  $(customapi.https://12345.ngrok-free.app/twitch/login?twitch_login_intent=/twitch/login/success)
  ```

### `/twitch/clip/create`
- **Method**: `GET`
- **Description**: Create a clip from your Twitch stream.
- **Params**: None
- **Usage**:
  ```bash
  $(customapi.https://12345.ngrok-free.app/twitch/clip/create)
  ```

### `/sensor/data`
- **Method**: `GET`
- **Description**: Fetch sensor data (e.g., heart rate) from the configured sensor logger.
- **Params**: None
- **Usage**:
  ```bash
  $(customapi.https://12345.ngrok-free.app/sensor/data)
  ```

---

## File Tree

```plaintext
nmp-stream-manager/
│
├── .env-example
├── .gitignore
├── package.json
└── src/
    ├── index.js
    ├── helpers/
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
    │   │   └── login.js
    │   └── util/
    │       ├── combine.js
    │       └── uncombine.js
```

---

## Running the App

1. Run the app with the following command:
   ```bash
   npm start
   ```

2. The app will launch the Twitch login page automatically for authentication.

---
