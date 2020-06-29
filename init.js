const fs = require('fs');
const path = require('path');
const download = require('./src/download');

const getGachaPools = require('./src/getGachaPools');
const downloadIcons = require('./src/downloadIcons');
const gacha = require('./src/gacha');

const tmpDir = path.resolve(process.cwd(), '.fgo-gacha');
const baseDir = path.resolve(process.cwd(), '.fgo-gacha/statics');
const dbPath = path.resolve(process.cwd(), '.fgo-gacha/statics/db.json');

const mooncellBackgroundUrl = 'https://fgo.wiki/images/bg/bg-mc-icon.png';
const mooncellBackgroundPath = path.resolve(process.cwd(), '.fgo-gacha/statics/bg-mc-icon.png');

/**
 * @method init
 * @description init resources
 * @param { boolean } [log] show log
 * @param { boolean } [overwrite] force download and overwrite files
 */
const init = async (log = false, overwrite = false) => {
  const info = (...t) => log && console.log(`[init]`, ...t);
  info('Ready to init');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir);
    info('Create .fgo-gacha/');
  }
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir);
    info('Created statics/');
  }
  if (!fs.existsSync(path.resolve(baseDir, 'icons'))) {
    fs.mkdirSync(path.resolve(baseDir, 'icons'));
    info('Created statics/icons/');
  }
  if (!fs.existsSync(path.resolve(baseDir, 'gacha'))) {
    fs.mkdirSync(path.resolve(baseDir, 'gacha'));
    info('Created statics/gacha/');
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, '{}');
    info('Create db.json');
  }
  await download(mooncellBackgroundUrl, mooncellBackgroundPath, overwrite);
  info(`Downloaded bg-mc-icon.png`);
  await getGachaPools(info);
  await downloadIcons(log, overwrite);
  info(`Downloaded resources`);
  fs.writeFileSync(path.resolve(process.cwd(), '.fgo-gacha/.init'), '');
  console.log('[FGOGacha] Updated pools');
  gacha(1);
};

module.exports = init;
