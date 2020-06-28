const fs = require('fs');
const path = require('path');

const Mirai = require('node-mirai-sdk');
const { Image, Plain } = Mirai.MessageComponent;

const init = require('./init');
const gacha = require('./src/gacha');

if (!fs.existsSync(path.resolve(__dirname, '.init'))) {
  init(true, true);
}

const dbPath = path.resolve(__dirname, './statics/db.json');
const poolsPath = path.resolve(__dirname, './statics/pools.json');
const db = JSON.parse(fs.readFileSync(dbPath));
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
 * @param { string } [config.hints.invalidPoolId] hint for 设置卡池 getting invalid poolid
 * @param { string } [config.hints.setPoolSuccess] hint for 设置卡池 success
 */
const FGOGacha = ({
  cooldown = 60000,
  allowGroup = true,
  allowPrivate = false,
  prefix = '',
  hints: {
    listPools: listPools = '现在数据库里有这些卡池哦~',
    invalidPoolId: invalidPoolId = '卡池编号不正确哦~',
    setPoolSuccess: setPoolSuccess = '设置卡池成功',
  } = {},
}) => {
  const gachaCooldown = [];
  const callback = async (message, bot) => {
    const { sender, messageChain, reply } = message;
    const { group } = sender;
    if (!db.group) db.group = {};
    if (!db.sender) db.sender = {};
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
      return reply(
        listPools + '\n' +
        pools.map((i, index) => `${index + 1}. ${i.title}`).join('\n') +
        '\n发送“设置卡池 编号”可以设置召唤的卡池'
      );
    }
    if (msg.startsWith(prefix + '设置卡池')) {
      const poolId = parseInt(msg.substr(prefix.length + 4));
      if (isNaN(poolId)) return reply(invalidPoolId);
      if (poolId > gacha.poolCounts) return reply(invalidPoolId);
      if (group) {
        if (!db.group[group.id]) db.group[group.id] = {};
        db.group[group.id].selectedPool = poolId;
      } else {
        if (!db.sender[sender.id]) db.sender[sender.id] = {};
        db.sender[sender.id].selectedPool = poolId;
      }
      saveDb();
      return reply(setPoolSuccess);
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
