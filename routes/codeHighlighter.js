const express = require('express');
const router = express.Router();
const fs = require('fs');
const esbuild = require('esbuild');

const hljsCommon = require.resolve('highlight.js/lib/common');
const hljsTheme = require.resolve('highlight.js/styles/base16/dracula.css');

let bundleCache = null;

async function getCodeHighlighterBundle() {
  if (bundleCache) return bundleCache;
  const result = await esbuild.build({
    entryPoints: [hljsCommon],
    bundle: true,
    write: false,
    format: 'esm',
    platform: 'browser',
  });
  bundleCache = result.outputFiles[0].text;
  return bundleCache;
}

router.get('/codehighlighter.css', async (req, res, next) => {
  try {
    res.type('text/css').send(fs.readFileSync(hljsTheme, 'utf8'));
  } catch (error) {
    next(error);
  }
});

router.get('/codehighlighter.js', async (req, res, next) => {
  try {
    const bundle = await getCodeHighlighterBundle();
    res.type('application/javascript').send(bundle);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
