const path = require('path');
const download = require('./src/download');

const mooncellBackgroundUrl = 'https://fgo.wiki/images/bg/bg-mc-icon.png';
const mooncellBackgroundPath = path.resolve(__dirname, './statics/bg-mc-icon.png');

/**
 * @method init
 * @description init resources
 * @param { boolean } [log] show log
 * @param { boolean } [overwrite] force download and overwrite files
 */
const init = async (log = false, overwrite = false) => {
  const info = (...t) => log && console.log(`[init]`, ...t);
  await download(mooncellBackgroundUrl, mooncellBackgroundPath, overwrite);
  info(`Downloaded bg-mc-icon.png`);
};

module.exports = init;
