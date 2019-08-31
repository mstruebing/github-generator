const {promisify} = require('util');
const axios = require('axios');
const fs = require('fs');

const readFileAsync = promisify(fs.readFile);

const createImageUploader = ({token, url, imageDirectory}) => {
  const getFileName = username => `./${imageDirectory}/${username}.png`;

  return {
    upload: async username => {
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
          url,
          data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return response;
      } catch (err) {
        throw new Error(`UPLOAD_IMAGE: ${err}`);
      }
    },
  };
};

module.exports = {
  createImageUploader,
};
