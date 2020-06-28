const fs = require('fs');
const path = require('path');

const random = require('./random');
const shuffle = require('./shuffle');

const poolDir = path.resolve(__dirname, '../statics/gacha.json');

const gachaOne = pool => {
  const rand = random(0, 10000);
  let sum = 0;
  for (let i = 0; i < pool.length; i++) {
    sum += pool[i].weight * 100;
    if (sum >= rand) {
      const ids = pool[i].id;
      const id = ids[random(0, ids.length - 1)];
      return {
        type: pool[i].type,
        star: pool[i].star,
        id,
      };
    }
  }
  return null;
}

const gacha = (poolId, total = 10) => {
  const pools = JSON.parse(fs.readFileSync(poolDir));
  const pool = pools[poolId - 1];
  if (!pool) return [];
  let result = [];
  let get4s = false;
  let get3sSvt = false;
  while (!get3sSvt) {
    const res = gachaOne(pool);
    if (res && res.type === 'svt' && res.star >= 3) {
      get3sSvt = true;
      if (res.star >= 4) get4s = true;
      result.push(res);
    }
  }
  for (let i = 1; i < total; i++) {
    let res = null;
    while (!res) {
      res = gachaOne(pool);
    }
    if (res.star >= 4) get4s = true;
    result.push(res);
  }
  let baodi = result.pop();
  while (!get4s) {
    const res = gachaOne(pool);
    if (res && res.star >= 4) {
      get4s = true;
      baodi = res;
    }
  }
  result.push(baodi);
  result = shuffle(result);
  return result;
};

module.exports = gacha;
