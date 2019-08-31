const {promisify} = require('util');
const axios = require('axios');
const fs = require('fs');
const env = require('./.env');

const readFileAsync = promisify(fs.readFile);
const imagePostUrl = 'https://api.printify.com';
const imagePostPath = 'v1/uploads/images.json';
const PRINTIFY_API_TOKEN = env.PRINTIFY_API_TOKEN;

const getFileName = username => `./${imageDir}/${username}.png`;
const imageDir = 'images';

const uploadImage = async username => {
  try {
    const fileName = getFileName(username);
    const file = await readFileAsync(fileName);
    const encodedFile = file.toString('base64');

    const data = {
      file_name: username,
      contents: encodedFile,
    };

    const response = await axios({
      method: 'post',
      url: `${imagePostUrl}/${imagePostPath}`,
      data,
      headers: {
        Authorization: `Bearer ${PRINTIFY_API_TOKEN}`,
      },
    });

    return response;
  } catch (err) {
    throw new Error(`UPLOAD_IMAGE: ${err}`);
  }
};

module.exports = {
  uploadImage,
};
