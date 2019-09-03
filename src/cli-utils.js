const axios = require('axios');

const env = require('../.env');

const token = env.PRINTIFY_API_TOKEN;
const baseUrl = env.baseUrl;

const getBluePrints = async token => {
  try {
    const response = await axios({
      method: 'get',
      url: `${baseUrl}/v1/catalog/blueprints.json`,
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`GET_BLUEPRINTS: ${error}`);
  }
};

const filterShirtsHoddies = data =>
  data.filter(
    date =>
      !date.title.toLowerCase().includes('tee') &&
      !date.title.toLowerCase().includes('shirt') &&
      !date.title.toLowerCase().includes('tank') &&
      !date.title.toLowerCase().includes('sleeve') &&
      !date.title.toLowerCase().includes('hoodie')
  );

const count = data => data.length;

const main = async () => {
  try {
    const blueprints = await getBluePrints(token);
    const filtered = filterShirtsHoddies(blueprints);

    console.log('filtered: ', filtered);
    console.log('count(filtered): ', count(filtered));
  } catch (error) {
    console.error(error);
  }
};

main();
