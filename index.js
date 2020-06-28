const fs = require('fs');
const path = require('path');
const init = require('./init');

if (!fs.existsSync(path.resolve(__dirname, '.init'))) {
  init(true, true);
}

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
