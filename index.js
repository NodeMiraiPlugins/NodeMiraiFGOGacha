const fs = require('fs');
const path = require('path');

const Mirai = require('node-mirai-sdk');
const { Image, Plain } = Mirai.MessageComponent;

const init = require('./init');

if (!fs.existsSync(path.resolve(__dirname, '.init'))) {
  init(true, true);
}

const dbPath = path.resolve(__dirname, './statics/db.json');
const poolsPath = path.resolve(__dirname, './statics/pools.json');
const db = fs.writeFileSync(dbPath);
const saveDb = () => {
  fs.writeFileSync(dbPath, JSON.stringify(db));
};

/**
 * @method FGOGacha
 * @description NodeMiraiSDK FGO Gacha plugin
 * @param { object } config
 * @param { number } [config.cooldown] (ms, default: 60000) gacha cooldown
 * @param { boolean } [config.allowGroup] (default: true) allow gacha in group talking
 * @param { boolean } [config.allowPrivate] (default: false) allow gacha in private talking
 * @param { string } [config.prefix] (default: '') command prefix
 * @param { object } [config.hints] hint texts
 * @param { string } [config.hints.listPools] hint for 查询卡池
 */
const FGOGacha = ({
  cooldown = 60000,
  allowGroup = true,
  allowPrivate = false,
  prefix = '',
  hints = {
    listPools: '现在数据库里有这些卡池哦~',
  },
}) => {
  const gachaCooldown = {
    group: [],
    sender: [],
  };
  const callback = async (message, bot) => {
    const { sender, messageChain, reply } = message;
    const { group } = sender;
    if (!group && !allowPrivate) return;
    if (group && !allowGroup) return;
    let msg = '';
    messageChain.forEach(chain => {
      if (chain.type === 'Plain') msg += Plain.value(chain);
    });
    msg = msg.trim();
    if (!msg.startsWith(prefix)) return;
    if (msg === prefix + '查询卡池') {
      const pools = JSON.parse(fs.readFileSync(poolsPath));
      reply(
        hints.listPools + '\n' +
        pools.map((i, index) => `${index + 1}. ${i.title}`).join('\n') +
        '\n发送“设置卡池 编号”可以设置召唤的卡池'
      );
    }
  };
  return {
    name: 'NodeMiraiFgoGacha',
    subscribe: 'message',
    callback,
  };
};

// 普通的更新一下
FGOGacha.update = () => init();
// 强制初始化
FGOGacha.init = () => init(true, true);

module.exports = FGOGacha;
