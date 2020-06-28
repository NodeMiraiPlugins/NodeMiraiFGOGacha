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
  cooldown: 60000,
}));

```
