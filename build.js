const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a build script that filters out experimental warnings
const build = spawn('npx', ['next', 'build'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

// Filter out experimental warnings
build.stdout.on('data', (data) => {
  const output = data.toString();
  if (!output.includes('experimental feature') && 
      !output.includes('Experimental features are not covered by semver')) {
    process.stdout.write(data);
  }
});

build.stderr.on('data', (data) => {
  const output = data.toString();
  if (!output.includes('experimental feature') && 
      !output.includes('Experimental features are not covered by semver')) {
    process.stderr.write(data);
  }
});

build.on('close', (code) => {
  process.exit(code);
}); 