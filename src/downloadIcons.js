const fs = require('fs');
const path = require('path');

const Progress = require('progress');

const download = require('./download');
/**
 * @method downloadIcons
 * @description Read icons.json and download icons
 * @param { function } logger
 */
const downloadIcons = async (log = false, overwrite = false) => {
  const icons = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../statics/icons.json')));
  for (let key in icons) {
    const bar = new Progress(`[Init] Downloading ${key} :bar [:current/:total]`, {
      total: icons[key].length,
      width: 20,
      complete: '█',
      incomplete: '░'
    });
    for (let ico of icons[key]) {
      const src = `https://fgo.wiki${encodeURI(ico)}`;
      const dist = path.resolve(__dirname, '../statics/icons', ico.replace('/images', '').replace(/\//g, '_'));
      await download(src, dist, false);
      bar.tick();
    }
  }
};

module.exports = downloadIcons;
