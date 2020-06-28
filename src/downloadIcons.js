const fs = require('fs');
const path = require('path');
const download = require('./download');
/**
 * @method downloadIcons
 * @description Read icons.json and download icons
 * @param { function } logger
 */
const downloadIcons = async (logger = () => {}, overwrite = false) => {
  const icons = JSON.parse(fs.writeFileSync(path.resolve(__dirname, '../statics/icons.json')));
  for (let key in icons) {
    for (let ico of icons[key]) {
      const src = `https://fgo.wiki${encodeURI(ico)}`;
      const dist = path.resolve(__dirname, '../statics/icons', ico.replace('/images', '').replace(/\//g, '_'));
      await download(src, dist, overwrite);
      logger('Downloaded', ico, '=>', dist);
    }
  }
};

module.exports = downloadIcons;
