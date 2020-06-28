const fs = require('fs');
const path = require('path');

const axios = require('axios');
const cheerio = require('cheerio');

const poolsUrl = 'https://fgo.wiki/w/%E6%8A%BD%E5%8D%A1%E6%A8%A1%E6%8B%9F%E5%99%A8';

/**
 * @method getGachaPools
 * @description parse pages and download pools, gacha infos and icon infos
 * @param { function } logger logger
 */
const getGachaPools = async (logger = () => {}) => {
  const poolsPage = await axios.get(poolsUrl);
  const $ = cheerio.load(poolsPage.data);
  const pools = [];
  const gachaData = [];
  $('p a').each((i, ele) => {
    const title = $(ele).prop('title');
    if (title.endsWith('模拟器') && !title.includes('福袋') && !title.includes('剧情')) {
      const href = $(ele).prop('href');
      const pool = {
        title: title.replace(/(详情)?\/模拟器/, ''),
        href: 'https://fgo.wiki' + href,
      };
      pools.push(pool);
    }
  });
  fs.writeFileSync(path.resolve(__dirname, '../statics/pools.json'), JSON.stringify(pools, null, 2));
  logger('Saved pools.json');
  const icons = {
    svtIcons: [],
    cftIcons: [],
  };
  for (let pool of pools) {
    const gacha = [];
    const { data } = await axios.get(pool.href);
    const rawStrList = data.match(/raw_str_list\s=\s\['(.*)'\]/)[1].split('\\n');
    rawStrList.shift();
    rawStrList.forEach(line => {
      const [ type, star, weight, display, ids] = line.split('\t');
      const id = ids.replace(/\'/g, '').split(', ').filter(i => i.length).map(i => parseInt(i));
      gacha.push({
        type,
        star: parseInt(star),
        weight: parseFloat(weight),
        display,
        id,
      });
    });
    gachaData.push(gacha);
    if (icons.svtIcons.length + icons.cftIcons.length === 0) {
      const svtIconList = data.match(/svt_icons\s=\s(\[.*\])/)[1];
      icons.svtIcons = JSON.parse(svtIconList);
      const cftIconList = data.match(/cft_icons\s=\s(\[.*\])/)[1];
      icons.cftIcons = JSON.parse(cftIconList);
    }
  }
  fs.writeFileSync(path.resolve(__dirname, '../statics/gacha.json'), JSON.stringify(gachaData, null, 2));
  logger('Saved gacha.json');
  fs.writeFileSync(path.resolve(__dirname, '../statics/icons.json'), JSON.stringify(icons, null, 2));
  logger('Saved icons.json');
};

module.exports = getGachaPools;

getGachaPools();