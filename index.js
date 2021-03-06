const fs = require('fs');
const path = require('path');

const Mirai = require('node-mirai-sdk');
const { At, Image, Plain } = Mirai.MessageComponent;

const init = require('./init');
const gacha = require('./src/gacha');
const generateGachaPng = require('./src/generateGachaPng');

if (!fs.existsSync(path.resolve(process.cwd(), '.fgo-gacha/.init'))) {
  init(true, true);
}

const dbPath = path.resolve(process.cwd(), '.fgo-gacha/statics/db.json');
const poolsPath = path.resolve(process.cwd(), '.fgo-gacha/statics/pools.json');
const db = JSON.parse(fs.readFileSync(dbPath));
const saveDb = () => {
  fs.writeFileSync(dbPath, JSON.stringify(db));
};

/**
 * @method FGOGacha
 * @description NodeMiraiSDK FGO Gacha plugin
 * @param { object } config
 * @param { number } [config.cooldown] (ms, default: 60000) gacha cooldown
 * @param { boolean } [config.allowGroup] (default: true) allow gacha in group chatting
 * @param { boolean } [config.allowPrivate] (default: false) allow gacha in private chatting
 * @param { boolean } [config.recall] (default: true) recall result or not
 * @param { number } [config.recallDelay] (default: 30000) recall delay
 * @param { string } [config.prefix] (default: '') command prefix
 * @param { boolean } [config.groupWhitelistMode] use whitelist mode for specific group
 * @param { array } [config.groupBlacklist] blacklist groups
 * @param { array } [config.groupWhitelist] whitelist groups
 * @param { boolean } [config.qqWhitelistMode] use whitelist mode for specific qq
 * @param { array } [config.qqBlacklist] blacklist qqs
 * @param { array } [config.qqWhitelist] whitelist qqs
 * @param { array } [config.superAdmin] super admin list
 * @param { object } [config.hints] hint texts
 * @param { string } [config.hints.gacha] hint for 召唤结果
 * @param { string } [config.hints.listPools] hint for 查询卡池
 * @param { string } [config.hints.invalidPoolId] hint for 设置卡池 getting invalid poolid
 * @param { string } [config.hints.setPoolSuccess] hint for 设置卡池 success
 * @param { string } [config.hints.poolNotSet]
 * @param { string } [config.hints.inCooldown]
 * @param { string } [config.hints.permissionError]
 */
const FGOGacha = ({
  cooldown = 60000,
  allowGroup = true,
  allowPrivate = false,
  recall = true,
  recallDelay = 30000,
  prefix = '',
  groupWhitelistMode = false,
  groupBlacklist = [],
  groupWhitelist = [],
  qqWhitelistMode = false,
  qqBlacklist = [],
  qqWhitelist = [],
  superAdmin = [],
  hints: {
    gacha: gachaHint = '本次召唤结果',
    listPools: listPools = '现在数据库里有这些卡池哦~',
    invalidPoolId: invalidPoolId = '卡池编号不正确哦~',
    setPoolSuccess: setPoolSuccess = '设置卡池成功',
    poolNotSet: poolNotSet = `尚未设置卡池，无法进行召唤`,
    inCooldown: inCooldown = `召唤冷却中，每${cooldown / 1000}秒可进行一次召唤`,
    permissionError: permissionError = '权限不足',
  } = {},
} = {}) => {
  const gachaCooldown = {};
  if (recallDelay < 5000) recallDelay = 5000;
  else if (recallDelay > 60000) recallDelay = 60000;
  const isAdmin = sender => sender.permission === 'ADMINISTRATOR' || sender.permission === 'OWNER' || superAdmin.includes(sender.id);
  /**
   * @method callback
   * @param { object } message message object
   * @param { Mirai } bot bot instance
   */
  const callback = async (message, bot) => {
    const { sender, messageChain, reply } = message;
    const { group } = sender;
    if (qqWhitelistMode) {
      if (!qqWhitelist.includes(sender.id)) return;
    }
    if (qqBlacklist.includes(sender.id)) return;
    if (group && groupWhitelistMode) {
      if (!groupWhitelist.includes(group.id)) return;
    }
    if (group && groupBlacklist.includes(group.id)) return;
    if (!db.group) db.group = {};
    if (!db.sender) db.sender = {};
    if (!group && !allowPrivate) return;
    if (group && !allowGroup) return;
    if (group) {
      if (!db.group[group.id]) db.group[group.id] = {};
      if (!gachaCooldown[group.id]) gachaCooldown[group.id] = [];
    } else {
      if (!db.sender[sender.id]) db.sender[sender.id] = {};
    }
    let msg = '';
    messageChain.forEach(chain => {
      if (chain.type === 'Plain') msg += Plain.value(chain);
    });
    msg = msg.trim();
    if (!msg.startsWith(prefix)) return;
    if (msg === prefix + '更新') {
      if (superAdmin.includes(sender.id)) {
        reply(`开始更新卡池信息`);
        await init().then(() => reply(`更新成功`))
                    .catch(() => reply(`更新出错，请检查log`));
      } else reply(permissionError);
    }
    if (msg === prefix + '查询卡池') {
      const pools = JSON.parse(fs.readFileSync(poolsPath));
      return reply(
        listPools + '\n' +
        pools.map((i, index) => `${index + 1}. ${i.title}`).join('\n') +
        `\n发送“${prefix}设置卡池 编号”可以设置召唤的卡池`
      );
    }
    if (msg.startsWith(prefix + '设置卡池')) {
      if (!isAdmin(sender)) return reply(permissionError);
      const poolId = parseInt(msg.substr(prefix.length + 4));
      if (isNaN(poolId)) return reply(invalidPoolId + `发送"${prefix}查询卡池"可以查询已有卡池`);
      if (poolId > gacha.poolCounts || poolId < 1) return reply(invalidPoolId + `发送"${prefix}查询卡池"可以查询已有卡池`);
      if (group) {
        db.group[group.id].selectedPool = poolId;
      } else {
        db.sender[sender.id].selectedPool = poolId;
      }
      saveDb();
      return reply(setPoolSuccess);
    }
    if (msg === prefix + '十连召唤' || msg === prefix + '十一连召唤' || msg === prefix + '百连召唤') {
      if (group && gachaCooldown[group.id].includes(sender.id)) return reply(inCooldown);
      const total = msg === prefix + '百连召唤' ? 100 : (prefix + '十一连召唤' ? 11 : 10);
      const poolId = group ? db.group[group.id].selectedPool : db.sender[sender.id].selectedPool;
      if (!poolId) return reply(poolNotSet + `发送"${prefix}设置卡池 编号"可以设置卡池`);
      const result = gacha(poolId, total);
      if (group) gachaCooldown[group.id].push(sender.id);
      const imgPath = await generateGachaPng(result);
      // let replyMsg = await bot.sendImageMessage(imgPath, message);
      const img = await bot.uploadImage(imgPath, message);
      const replyMsg = await reply([At(sender.id), Plain(gachaHint + '\n'), Image(img)]);
      if (!replyMsg.messageId) {
        console.log('[FGOGacha] Unknown error @ sending gacha result');
      }
      if (group) {
        setTimeout(() => {
          gachaCooldown[group.id].shift();
        }, cooldown);
        if (recall && replyMsg.messageId) {
          setTimeout(() => {
            bot.recall(replyMsg);
          }, recallDelay);
        }
      }
      return fs.unlinkSync(imgPath);
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
