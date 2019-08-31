const http = require('http');
const {parse} = require('url');

const {makeScreenshot, writeUsername} = require('./image-generator.js');
const {uploadImage} = require('./image-uploader.js');

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;

const server = http.createServer(async (req, res) => {
  try {
    const username = parse(req.url).query;

    await makeScreenshot(username);
    await writeUsername(username);
    const response = await uploadImage(username);

    console.log('response: ', response);
    res.end('finished');
  } catch (err) {
    console.error(`ERROR: ${err}`);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
