const http = require('http');
const puppeteer = require('puppeteer');
const {parse} = require('url');

const hostname = process.env.HOSTNAME || '127.0.0.1';
const port = process.env.PORT || 3000;

const makeScreenshot = async username => {
  const browser = await puppeteer.launch({});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  await page.goto(`https://github.com/${username}`);

  const graphElement = await page.$('.calendar-graph');
  const file = await graphElement.screenshot({path: `${username}.png`});

  await browser.close();

  return file;
};

const server = http.createServer(async (req, res) => {
  const username = parse(req.url).query;
  const file = await makeScreenshot(username);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/png');
  res.end(file);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
