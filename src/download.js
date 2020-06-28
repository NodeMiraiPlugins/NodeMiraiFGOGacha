const fs = require('fs');
const axios = require('axios');

/**
 * @method download
 * @description download a file to dist
 * @param { string } src download url
 * @param { string } dist
 * @param { boolean } [overwrite] overwrite file if exist
 */
const download = async (src, dist, overwrite = false) => {
  if (!overwrite && fs.existsSync(dist)) return;
  await axios({
    method: 'GET',
    url: src,
    responseType: 'stream',
  }).then(({ data }) => {
    const stream = fs.createWriteStream(dist);
    return new Promise((res, rej) => {
      data.pipe(stream);
      data.on('end', res);
      data.on('error', rej);
    });
  });
};

module.exports = download;
