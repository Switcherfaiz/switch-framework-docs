'use strict';

const fs = require('node:fs');
const path = require('node:path');

const pkgPath = path.join(__dirname, '..', 'package.json');
const DEV_DEP_KEY = 'switch-framework-dev-dep';
const PROD_DEP_KEY = 'switch-framework-prod-dep';

function parseMode(argv) {
  const fromNpm = String(process.env.npm_config_mode || '').trim().toLowerCase();
  if (fromNpm === 'dev' || fromNpm === 'prod') return fromNpm;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '-m' || arg === '--mode') {
      const next = argv[i + 1];
      if (next) return next.trim().toLowerCase();
    }
    if (arg.startsWith('--mode=')) return arg.slice(7).trim().toLowerCase();
    if (arg.startsWith('-mode=')) return arg.slice(6).trim().toLowerCase();
    if (arg === 'dev' || arg === 'prod') return arg;
  }
  return '';
}

function main() {
  const mode = parseMode(process.argv.slice(2));

  if (mode !== 'dev' && mode !== 'prod') {
    console.error('Usage: npm run change-mode --mode=prod');
    console.error('       npm run change-mode --mode=dev');
    console.error('       npm run change-mode -- -mode=prod');
    process.exit(1);
  }

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  const sourceKey = mode === 'dev' ? DEV_DEP_KEY : PROD_DEP_KEY;
  const source = pkg[sourceKey];

  if (!source || typeof source !== 'object') {
    console.error(`Missing "${sourceKey}" in package.json`);
    process.exit(1);
  }

  if (!pkg.dependencies) pkg.dependencies = {};

  let changed = false;
  for (const [name, version] of Object.entries(source)) {
    if (version == null) continue;
    if (pkg.dependencies[name] !== version) {
      pkg.dependencies[name] = version;
      changed = true;
    }
  }

  if (!changed) {
    console.log(`[change-mode] already on ${mode} — dependencies unchanged`);
    return;
  }

  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`);
  console.log(`[change-mode] set ${mode} — updated dependencies`);
  console.log('[change-mode] run npm install from the repo root, then start the app');
}

main();
