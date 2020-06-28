# Node Mirai Fgo Gacha

[node-mirai-sdk](https://github.com/RedBeanN/node-mirai) 的 FGO 模拟扭蛋插件

## Usage

`NodeMiraiSDK` 的配置请参考 [node-mirai-sdk](https://github.com/RedBeanN/node-mirai)

`npm i -S node-mirai-fgo-gacha`

index.js

``` javascript
// 初次调用时会自动初始化卡池，并下载相关资源，这可能需要一些时间
const FGOGacha = require('node-mirai-fgo-gacha');

const bot = new Mirai({/* ... */});

// 配置参数均为可选，以下列出的是默认参数值
bot.use(FGOGacha({
  cooldown: 60000,           // 扭蛋的冷却时间，单位 ms
  allowGroup: true,          // 群聊扭蛋开关
  allowPrivate: false,       // 私聊扭蛋开关
  recall: true,              // 在指定时间后撤回扭蛋图片以防刷屏
  recallDelay: 30000,        // 指定撤回延迟，时间 5000 - 60000
  prefix: ``,                // 指令前缀，可用于避免误触发
  groupWhitelistMode: false, // 群聊白名单模式快关
  groupBlacklist: [],        // 群聊黑名单
  groupWhitelist: [],        // 群聊白名单
  qqWhitelistMode: false,    // qq 白名单开关
  qqBlacklist: [],           // qq 黑名单
  qqWhitelist: [],           // qq 白名单
  hints: {                   // 一些可配置的提示
    listPools: `现在数据库里有这些卡池哦~`,
    invalidPoolId: `卡池编号不正确哦~`,
    setPoolSuccess: `设置卡池成功`,
    poolNotSet: `尚未设置卡池，无法进行十连`,
    inCooldown: `召唤冷却中，每${cooldown / 1000}秒可进行一次召唤`,
  },
}));

// 可选
// 更新卡池信息和资源
FGOGacha.update();
// 强制初始化
FGOGacha.init();

```
