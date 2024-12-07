#!/bin/bash

# Set absolute path to .deploy directory
DEPLOY_DIR="$PWD/.deploy"

# Step 1: Download Portable Node.js into .deploy/bin
echo "Downloading Portable Node.js..."
NODE_URL="https://github.com/zeit/next.js/releases/download/v10.0.1/node-v14.18.0-x64.msi"  # Update with correct portable node link if needed
mkdir -p "$DEPLOY_DIR/bin"
curl -L $NODE_URL -o "$DEPLOY_DIR/bin/node.exe"

# Step 2: Download hds_desktop_windows.exe into .deploy/bin
echo "Downloading hds_desktop_windows.exe..."
HDS_URL="https://github.com/Rexios80/hds_desktop/releases/download/0.2.3/hds_desktop_windows.exe"
curl -L $HDS_URL -o "$DEPLOY_DIR/bin/hds_desktop_windows.exe"

# Step 3: Copy the src directory into .deploy/src
echo "Copying src to .deploy/src..."
cp -r ./src "$DEPLOY_DIR/src"

# Step 4: Copy the node_modules directory into .deploy/node_modules
echo "Copying node_modules to .deploy/node_modules..."
cp -r ./node_modules "$DEPLOY_DIR/node_modules"

# Step 5: Run node.exe against .deploy/src/index.js, setting NODE_PATH to the node_modules directory
echo "Running Node.js against .deploy/src/index.js..."

# For Git Bash, use Windows-style paths (C:/ instead of /c/)
"$DEPLOY_DIR/bin/node.exe" "$DEPLOY_DIR/src/index.js"

echo "Script completed."
