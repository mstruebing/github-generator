const fs = require('fs');
const { promisify } = require('util');
const axios = require('axios');

const readFileAsync = promisify(fs.readFile);

const createImageUploader = ({ token, url, imageDirectory }) => {
  const getFileName = username => `./${imageDirectory}/${username}.png`;

  return {
    upload: async username => {
      try {
        const fileName = getFileName(username);
        const file = await readFileAsync(fileName);
        const encodedFile = file.toString('base64');

        const data = {
          file_name: username, // eslint-disable-line camelcase
          contents: encodedFile
        };

        const response = await axios({
          method: 'post',
          url,
          data,
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        return response;
      } catch (error) {
        throw new Error(`UPLOAD_IMAGE: ${error}`);
      }
    }
  };
};

module.exports = {
  createImageUploader
};
