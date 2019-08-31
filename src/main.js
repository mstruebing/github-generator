const http = require('http');
const {parse} = require('url');

const {createImageGenerator, createImageUploader} = require('./services');

const env = require('../.env');
const PRINTIFY_API_TOKEN = env.PRINTIFY_API_TOKEN;

const imageUploaderOptions = {
  token: env.PRINTIFY_API_TOKEN,
  url: `${env.baseUrl}/${env.imagePostPath}`,
  imageDirectory: env.imageDirectory,
};

const imageGeneratorOptions = {
  imageDirectory: env.imageDirectory,
  cssSelector: '.calendar-graph',
  url: 'https://github.com',
  viewport: {
    width: 1920,
    height: 1080,
  },
};

const imageUploder = createImageUploader(imageUploaderOptions);
const imageGenerator = createImageGenerator(imageGeneratorOptions);

const server = http.createServer(async (req, res) => {
  try {
    // TODO: Make this a post request
    const username = parse(req.url).query;

    await imageGenerator.makeScreenshot(username);
    await imageGenerator.writeUsername(username);
    const response = await imageUploder.upload(username);

    console.log('response: ', response);
    console.log('response.data.id: ', response.data.id);
    res.end('finished');
  } catch (err) {
    console.error(`ERROR: ${err}`);
  }
});

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
