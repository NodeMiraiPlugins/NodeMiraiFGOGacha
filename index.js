const fs = require('fs');
const path = require('path');
const init = require('./init');

fs.existsSync(path.resolve(__dirname, '.init')) ? init() : init(true, true);
