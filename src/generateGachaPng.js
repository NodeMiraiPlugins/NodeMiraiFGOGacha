const path = require('path');
const sharp = require('sharp');
const getIcon = require('./getGachaIcon');

const tenPosition = require('../config/tenPosition.json');

const generateGacha = async result => {
  if (!result || result.length === 0) throw new Error('Invalid result');
  const dist = path.resolve(__dirname, `../statics/gacha/${Date.now()}.png`);
  const compositeGroup = [{
    input: await sharp(path.resolve(__dirname, '../statics/bg-mc-icon.png')).toBuffer(),
    left: 0,
    top: 0,
    tile: true,
  }];
  for (let index in result) {
    const res = result[index];
    const iconPath = getIcon(res);
    compositeGroup.push({
      input: await sharp(iconPath).resize(132, 144).toBuffer(),
      left: tenPosition[index].left || 0,
      top: tenPosition[index].top || 0,
    });
  }
  await sharp({
    create: {
      width: 876,
      height: 324,
      channels: 4,
      background: '#fff',
    },
  }).composite(compositeGroup).toFile(dist);
  return dist;
};

module.exports = generateGacha;
