#!/usr/bin/env node
/**
 * Deploy Landing Page to GitHub Pages
 *
 * Creates a GitHub repo (if needed) and deploys the landing page.
 *
 * Prerequisites:
 * - gh CLI installed and authenticated (gh auth login)
 * - Landing page files in docs/landing/
 *
 * Usage:
 *   node deploy-landing-page.js [--org=butterlemonade]
 *
 * This will:
 * 1. Create a GitHub repo: butterlemonade/rivulet-app (or your org/user)
 * 2. Push docs/landing/ contents to the gh-pages branch
 * 3. Enable GitHub Pages
 * 4. Output the live URL
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const LANDING_DIR = path.resolve(__dirname, '..', '..', 'docs', 'landing');
const REPO_NAME = 'rivulet-app';

function run(cmd, opts = {}) {
  console.log(`  $ ${cmd}`);
  return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe', ...opts }).trim();
}

async function main() {
  const args = process.argv.slice(2);
  const orgArg = args.find((a) => a.startsWith('--org='));
  const org = orgArg ? orgArg.split('=')[1] : null;

  // Verify landing page exists
  const indexPath = path.join(LANDING_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('Landing page not found at docs/landing/index.html');
    console.error('Run the content generation first.');
    process.exit(1);
  }

  // Verify gh CLI
  try {
    run('gh --version');
  } catch {
    console.error('GitHub CLI (gh) not found. Install it: https://cli.github.com');
    process.exit(1);
  }

  const fullName = org ? `${org}/${REPO_NAME}` : REPO_NAME;
  console.log(`\nDeploying landing page to GitHub Pages...`);
  console.log(`Repository: ${fullName}\n`);

  // Check if repo exists
  let repoExists = false;
  try {
    run(`gh repo view ${fullName}`);
    repoExists = true;
    console.log('Repository already exists.\n');
  } catch {
    console.log('Creating repository...');
    const createCmd = org
      ? `gh repo create ${fullName} --public --description "Rivulet — Beautiful Water Tracker"`
      : `gh repo create ${REPO_NAME} --public --description "Rivulet — Beautiful Water Tracker"`;
    run(createCmd);
    console.log('Repository created.\n');
  }

  // Create a temporary directory for the gh-pages deploy
  const tmpDir = path.join(require('os').tmpdir(), 'rivulet-landing-deploy');
  if (fs.existsSync(tmpDir)) {
    fs.rmSync(tmpDir, { recursive: true });
  }
  fs.mkdirSync(tmpDir, { recursive: true });

  // Clone or init
  console.log('Setting up deploy branch...');
  try {
    run(`git clone --depth 1 --branch gh-pages https://github.com/${fullName}.git "${tmpDir}"`, { stdio: 'pipe' });
  } catch {
    // No gh-pages branch yet — init fresh
    run(`git init "${tmpDir}"`);
    run(`git -C "${tmpDir}" checkout -b gh-pages`);
    run(`git -C "${tmpDir}" remote add origin https://github.com/${fullName}.git`);
  }

  // Copy landing files
  console.log('Copying landing page files...');
  const files = fs.readdirSync(LANDING_DIR);
  for (const file of files) {
    const src = path.join(LANDING_DIR, file);
    const dest = path.join(tmpDir, file);
    fs.copyFileSync(src, dest);
  }

  // Commit and push
  console.log('Committing and pushing...');
  run(`git -C "${tmpDir}" add -A`);
  try {
    run(`git -C "${tmpDir}" commit -m "Deploy landing page"`);
  } catch {
    console.log('No changes to deploy.');
    return;
  }
  run(`git -C "${tmpDir}" push -u origin gh-pages --force`);

  // Enable GitHub Pages
  console.log('\nEnabling GitHub Pages...');
  try {
    run(`gh api repos/${fullName}/pages -X POST -f source.branch=gh-pages -f source.path=/`);
  } catch {
    // May already be enabled
  }

  // Get the URL
  const owner = org || run('gh api user -q .login');
  const pagesUrl = `https://${owner.toLowerCase()}.github.io/${REPO_NAME}/`;

  console.log('\n========================================');
  console.log(' Landing page deployed!');
  console.log(`\n URL: ${pagesUrl}`);
  console.log(` Privacy: ${pagesUrl}privacy-policy.html`);
  console.log('========================================');
  console.log('\nUse the privacy policy URL in your app store listings.');

  // Cleanup
  fs.rmSync(tmpDir, { recursive: true });
}

main().catch(console.error);
