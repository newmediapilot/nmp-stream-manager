#!/bin/bash

# Define the folder and Node.js version
BIN_DIR=".bin"
NODE_VERSION="v18.18.2" # Replace with the version you want
NODE_PLATFORM="win-x64" # Platform and architecture

# Create the .bin directory if it doesn't exist
mkdir -p "$BIN_DIR"

# Construct the download URL
NODE_URL="https://nodejs.org/dist/$NODE_VERSION/node-$NODE_VERSION-$NODE_PLATFORM.zip"

# File names
ZIP_FILE="$BIN_DIR/node-$NODE_VERSION-$NODE_PLATFORM.zip"
EXTRACTED_DIR="$BIN_DIR/node-$NODE_VERSION-$NODE_PLATFORM"

echo "Downloading Node.js $NODE_VERSION..."

# Download Node.js zip file
curl -o "$ZIP_FILE" "$NODE_URL"

# Check if the download succeeded
if [ $? -ne 0 ]; then
    echo "Failed to download Node.js. Check your internet connection or the version/platform."
    exit 1
fi

echo "Extracting Node.js to $BIN_DIR..."

# Unzip the downloaded file
unzip -q "$ZIP_FILE" -d "$BIN_DIR"

# Move the extracted files to .bin/node
mv "$EXTRACTED_DIR" "$BIN_DIR/node"

# Cleanup: Remove the zip file
rm "$ZIP_FILE"

echo "Node.js $NODE_VERSION has been downloaded and extracted to $BIN_DIR/node."

# Add .bin to PATH temporarily for this session
export PATH="$(pwd)/$BIN_DIR/node:$PATH"

echo "Node.js has been added to your PATH. Run 'node -v' to verify."
