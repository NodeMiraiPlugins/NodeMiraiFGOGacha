# Node Mirai Fgo Gacha

[node-mirai-sdk](https://github.com/RedBeanN/node-mirai) 的 FGO 模拟扭蛋插件

卡池内容、概率、资源素材等均来自 [Mooncell](https://fgo.wiki/)，如有余力请多多支持 Mooncell

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
    poolNotSet: `尚未设置卡池，无法进行召唤`,
    inCooldown: `召唤冷却中，每60秒可进行一次召唤`,
  },
}));

// 可选
// 更新卡池信息和资源
FGOGacha.update();
// 强制初始化
FGOGacha.init();

```

## 关于卡池

- `node-mirai-fgo-gacha` 采用的是 [这个页面](https://fgo.wiki/w/%E6%8A%BD%E5%8D%A1%E6%A8%A1%E6%8B%9F%E5%99%A8) 所展示的卡池(不含福袋)

- `node-mirai-fgo-gacha` 会在初次使用时自动初始化卡池, 下载资源文件(总计`10MB+`), 此后必须通过 `FGOGacha.update()` 方法手动更新, 如果已有的资源出现错误, 可以通过 `FGOGacha.init()` 方法重新初始化

- 随机和保底机制纯属猜测, 与官方不一定一致, 因此结果没有参考价值, 仅供娱乐, 请勿当真
