const fs = require('fs');
const path = require('path');

const hookContent = `#!/bin/bash
# Pre-commit hook to update spatial index metadata
echo "Running pre-commit spatial index update..."
./scripts/update-index.sh
git add data/index-version.json
`;

const gitHooksPath = path.join(__dirname, '../.git/hooks');
const preCommitPath = path.join(gitHooksPath, 'pre-commit');

if (fs.existsSync(gitHooksPath)) {
    fs.writeFileSync(preCommitPath, hookContent, { mode: 0o755 });
    console.log('Git pre-commit hook installed successfully.');
} else {
    console.error('.git directory not found. Please run git init first.');
}
