#!/bin/bash

echo "Resetting bins..."
rm -rf "./.deploy/bin"
mkdir -p "./.deploy/bin"

echo "Downloading Portable Node.js (exe version)..."
curl -L "https://nodejs.org/dist/v22.12.0/node-v22.12.0-win-x64.zip" -o "./.deploy/bin/node.zip"
unzip -o "./.deploy/bin/node.zip" -d "./.deploy/bin/node/"
rm "./.deploy/bin/node.zip"

echo "Finding the node.exe..."
NODE_EXE=$(find "./.deploy/bin/node/" -name "node.exe" -print -quit)
echo "Finding the node.exe...$NODE_EXE"

echo "Downloading hds_desktop_windows.exe..."
curl -L "https://github.com/Rexios80/hds_desktop/releases/download/0.2.3/hds_desktop_windows.exe" -o "./.deploy/bin/hds_desktop_windows.exe"

echo "Copying src to .deploy/src..."
cp -r "./src" "./.deploy/src"

echo "Copying node_modules to .deploy/node_modules..."
cp -r "./node_modules" "./.deploy/node_modules"

echo "Running node.exe on .deploy/src/index.js..."
"$NODE_EXE" "./.deploy/src/index.js"

echo "Script completed."
