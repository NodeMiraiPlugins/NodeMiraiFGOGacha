const fs = require('fs');
const path = require('path');

let icons = null;

const getGachaIcon = (conf = {
  type: 'svt',
  id: 1,
}) => {
  if (!icons) icons = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../statics/icons.json')));
  const { type, id } = conf;
  let img = '';
  if (type === 'svt') img = icons.svtIcons[id - 1];
  else img = icons.cftIcons[id - 1];
  if (!img) {
    console.error('Icon path not found', conf);
  }
  return path.resolve(__dirname, '../statics/icons', img.replace('/images', '').replace(/\//g, '_'));
};

module.exports = getGachaIcon;
