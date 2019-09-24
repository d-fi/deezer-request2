const axios = require('axios');

const DefaultHeaders = {
  'user-agent': 'User-Agent: Deezer/7.17.0.2 CFNetwork/1098.6 Darwin/19.0.0',
  'cache-control': 'max-age=0',
  'accept-language': 'en-US,en;q=0.9,en-US;q=0.8,en;q=0.7',
  'accept-charset': 'utf-8,ISO-8859-1;q=0.8,*;q=0.7',
  'content-type': 'text/plain;charset=UTF-8',
};

const request = (url, params, data, cache = map) => {
  return axios.post(url, data, { params, headers: DefaultHeaders });
};

module.exports = request;
