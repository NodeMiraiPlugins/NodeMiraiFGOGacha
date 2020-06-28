# Node Mirai Fgo Gacha

[node-mirai-sdk](https://github.com/RedBeanN/node-mirai) 的 FGO 模拟扭蛋插件

## Usage

`npm i -S node-mirai-fgo-gacha`

index.js

``` javascript
const Mirai = require('node-mirai-sdk');
const FGOGacha = require('node-mirai-fgo-gacha');

const bot = new Mirai({/* ... */});
bot.use(FGOGacha({
  cooldown: 60000,     // 扭蛋的冷却时间，单位 ms
  allowGroup: true,    // 群聊扭蛋开关
  allowPrivate: false, // 私聊扭蛋开关
  recall: true,        // 在指定时间后撤回扭蛋图片以防刷屏
  recallDelay: 30000,  // 指定撤回延迟，时间 5000 - 60000
  prefix: '',          // 指令前缀，可用于避免误触发
  hints: {             // 一些可配置的提示
    listPools: '现在数据库里有这些卡池哦~',
    invalidPoolId: '卡池编号不正确哦~',
    setPoolSuccess: '设置卡池成功',
    poolNotSet: `尚未设置卡池，无法进行十连`,
    inCooldown: `召唤冷却中，每${cooldown / 1000}秒可进行一次召唤`,
  },
}));

```
