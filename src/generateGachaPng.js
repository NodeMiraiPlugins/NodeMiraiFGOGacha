const path = require('path');
const sharp = require('sharp');
const getIcon = require('./getGachaIcon');

const tenPosition = require('../config/tenPosition.json');
const elevenPosition = require('../config/elevenPosition.json');

const generateGacha = async result => {
  if (!result || result.length === 0) throw new Error('Invalid result');
  const position = result.length > 10 ? elevenPosition : tenPosition;
  const dist = path.resolve(__dirname, `../statics/gacha/${Date.now()}.png`);
  const compositeGroup = [{
    input: await sharp(path.resolve(__dirname, '../statics/bg-mc-icon.png')).toBuffer(),
    left: 0,
    top: 0,
    tile: true,
  }];
  if (result.length > 11) {
    const filtered = result.filter(i => i.star >= 4).sort((a, b) => {
      if (a.type === 'svt') {
        if (b.type === 'svt') {
          if (a.star === b.star) return b.id - a.id;
          return b.star - a.star;
        }
        return -1;
      }
      if (a.type === 'ce' && b.type === 'ce') {
        if (a.star === b.star) return b.id - a.id;
        return b.star - a.star;
      }
      return 1;
    });
    for (let index in filtered) {
      const res = filtered[index];
      const iconPath = getIcon(res);
      const top = 12 + Math.floor(parseInt(index) / 6) * 156;
      const left = 12 + parseInt(index) % 6 * 144;
      compositeGroup.push({
        input: await sharp(iconPath).resize(132, 144).toBuffer(),
        left,
        top,
      });
    }
    await sharp({
      create: {
        width: 876,
        height: (Math.floor(filtered.length / 6) + 1) * 156 + 12,
        channels: 4,
        background: '#fff',
      },
    }).composite(compositeGroup).toFile(dist);
    return dist;
  }
  for (let index in result) {
    const res = result[index];
    const iconPath = getIcon(res);
    compositeGroup.push({
      input: await sharp(iconPath).resize(132, 144).toBuffer(),
      left: position[index].left || 0,
      top: position[index].top || 0,
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
