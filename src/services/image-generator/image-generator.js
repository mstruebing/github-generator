const fs = require('fs');
const puppeteer = require('puppeteer');
const Jimp = require('jimp');

const createImageGenerator = ({imageDirectory, cssSelector, url, viewport}) => {
  const getFileName = username => `./${imageDirectory}/${username}.png`;
  const imageDir = 'images';

  return {
    makeScreenshot: async username => {
      try {
        const browser = await puppeteer.launch({});
        const page = await browser.newPage();
        await page.setViewport(viewport);
        await page.goto(`${url}/${username}`);

        const graphElement = await page.$('.calendar-graph');
        const file = await graphElement.screenshot({
          path: `${getFileName(username)}`,
        });

        await browser.close();

        return file;
      } catch (err) {
        throw new Error(`MAKE_SCREENSHOT: ${err}`);
      }
    },
    writeUsername: async username => {
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
      } catch (err) {
        throw new Error(`WRITE_USERNAME: ${err}`);
      }
    },
  };
};

module.exports = {
  createImageGenerator,
};
