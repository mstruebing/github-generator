const http = require('http');
const fs = require('fs');
const {parse} = require('url');
const puppeteer = require('puppeteer');
const Jimp = require('jimp');

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;

const getFileName = username => `./${imageDir}/${username}.png`;
const imageDir = 'images';

const makeScreenshot = async username => {
  try {
    const browser = await puppeteer.launch({});
    const page = await browser.newPage();
    await page.setViewport({width: 1920, height: 1080});
    await page.goto(`https://github.com/${username}`);

    const graphElement = await page.$('.calendar-graph');
    const file = await graphElement.screenshot({
      path: `${getFileName(username)}`,
    });

    await browser.close();

    return file;
  } catch (e) {
    console.error(e);
  }
};

const writeUsername = async username => {
  try {
    const fileName = getFileName(username);
    let image = await Jimp.read(fileName);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);

    const width = image.bitmap.width;
    const height = image.bitmap.height;

    // activity overview off
    if (height === 132 && width === 894) {
      await image.crop(0, 0, 894, 200).writeAsync(fileName);
      image = await Jimp.read(fileName);
      await image
        .print(font, 58, 130, `@${username}`)
        .crop(0, 0, 880, 155)
        .writeAsync(fileName);

      // activity overview on
    } else {
      await image.crop(0, 0, 739, 184).writeAsync(fileName);
      image = await Jimp.read(fileName);
      await image
        .print(font, 30, 115, `@${username}`)
        .crop(0, 0, 739, 140)
        .writeAsync(fileName);
    }
  } catch (e) {
    console.error(e);
  }
};

const server = http.createServer(async (req, res) => {
  try {
    const username = parse(req.url).query;
    const file = await makeScreenshot(username);
    await writeUsername(username);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'image/png');

    const readStream = fs.createReadStream(getFileName(username));
    readStream.pipe(res);
  } catch (e) {
    console.errr(e);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
