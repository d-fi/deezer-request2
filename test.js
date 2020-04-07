const deezerApi = require('./index');

const test = async (id) => {
  console.log('Testing: ' + id);
  console.time('no-cache');
  try {
    const { data } = await deezerApi.getTrackInfo(id, 1000);
    console.log(data.results);
  } catch (err) {
    console.log(err);
  }
  console.timeEnd('no-cache');
};

test('7561772');
