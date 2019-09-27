const deezerApi = require('./index');

const test = async (id) => {
  console.log('Testing: ' + id);
  console.time('no-cache');
  try {
    const { data } = await deezerApi.getAlbumTrackInfo(id, 1000);
    console.log(data);
  } catch (err) {
    console.log(err);
  }
  console.timeEnd('no-cache');
};

test('104879372');
