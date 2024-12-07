#!/bin/bash

# Directory context
SCRIPT_DIR=$(dirname "$0")
chmod +x "$SCRIPT_DIR"/*.sh
bash "$SCRIPT_DIR/get-node.sh"
bash "$SCRIPT_DIR/get-bpm.sh"

# Start app
NODE_BIN="$SCRIPT_DIR/../.bin/node/node.exe"
INDEX_FILE="$SCRIPT_DIR/../src/index.js"
"$NODE_BIN" "$INDEX_FILE"
