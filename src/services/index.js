const {
  createImageGenerator
} = require('./image-generator/image-generator.js');
const { createImageUploader } = require('./image-uploader/image-uploader.js');

module.exports = {
  createImageGenerator,
  createImageUploader
};
