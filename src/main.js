const http = require('http');

const env = require('../.env');
const { createImageGenerator, createImageUploader } = require('./services');

const imageUploaderOptions = {
  token: env.PRINTIFY_API_TOKEN,
  url: `${env.baseUrl}/${env.imagePostPath}`,
  imageDirectory: env.imageDirectory
};

const imageGeneratorOptions = {
  imageDirectory: env.imageDirectory,
  cssSelector: '.calendar-graph',
  url: 'https://github.com',
  viewport: {
    width: 1920,
    height: 1080
  }
};

const imageUploder = createImageUploader(imageUploaderOptions);
const imageGenerator = createImageGenerator(imageGeneratorOptions);

const server = http.createServer(async (req, res) => {
  try {
    // TODO: Make this a post request
    const username = req.url.substring(1);

    await imageGenerator.makeScreenshot(username);
    await imageGenerator.writeUsername(username);
    const response = await imageUploder.upload(username);

    const image = response.data;
    console.log('image:', image);
    res.end('finished');
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
});

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
