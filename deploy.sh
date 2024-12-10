#!/bin/bash

# Install Rollup plugin for resolving Node.js modules
npm install --save-dev @rollup/plugin-node-resolve

# Create rollup.config.js with necessary configuration for bundling
echo "import resolve from '@rollup/plugin-node-resolve'; export default { input: 'src/index.js', output: { file: 'dist/bundle.js', format: 'cjs' }, plugins: [resolve()] };" > rollup.config.js

# Run Rollup to bundle the code in CommonJS format
npx rollup --config rollup.config.js

echo "Build complete! Output is in dist/bundle.js"
