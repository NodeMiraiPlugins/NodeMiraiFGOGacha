const fs = require('fs');
const path = require('path');
const init = require('./init');

if (!fs.existsSync(path.resolve(__dirname, '.init'))) {
  init(true, true);
}

const dbPath = path.resolve(__dirname, './statics/db.json');
const db = fs.writeFileSync(dbPath);
const saveDb = () => {
  fs.writeFileSync(dbPath, JSON.stringify(db));
};

/**
 * @method FGOGacha
 * @description NodeMiraiSDK FGO Gacha plugin
 * @param { object } config
 */
const FGOGacha = ({
  cooldown = 60000,
}) => {
  const gachaCooldown = [];
};

// 普通的更新一下
FGOGacha.update = () => init();
// 强制初始化
FGOGacha.init = () => init(true, true);

module.exports = FGOGacha;
