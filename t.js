const deezerApi = require('./index');
const axios = require('axios');
/**
 * Fetch and set the api token.
 */
const initDeezerApi = async () => {
  const { data } = await axios.get(
    'https://www.deezer.com/ajax/gw-light.php?method=deezer.ping&api_version=1.0&api_token'
  );

  console.log(data.results.SESSION);
};

module.exports = initDeezerApi;

const test = async (id) => {
  try {
    deezerApi.setParameter('sid', 'fra935c714535252fae01063244314538fab6ae8');
    const { data } = await deezerApi.searchMusic(id, 1);
    if (data.error.NEED_API_AUTH_REQUIRED) {
      initDeezerApi();
    }
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

test('isrc');
