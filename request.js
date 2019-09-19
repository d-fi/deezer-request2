const got = require('got');
const map = new Map();

const DefaultHeaders = {
  'user-agent': 'User-Agent: Deezer/7.17.0.2 CFNetwork/1098.6 Darwin/19.0.0',
  'cache-control': 'max-age=0',
  'accept-language': 'en-US,en;q=0.9,en-US;q=0.8,en;q=0.7',
  'accept-charset': 'utf-8,ISO-8859-1;q=0.8,*;q=0.7',
  'content-type': 'text/plain;charset=UTF-8',
};

class Request {
  post(url, parameters, body, cache = map, json = true) {
    let options = {
      headers: DefaultHeaders,
      query: parameters,
      body: body,
      json,
      cache,
    };

    return got.post(url, options);
  }

  get(url, parameters, cache = map, json = true) {
    let options = {
      headers: DefaultHeaders,
      query: parameters,
      cache,
      json,
    };

    return got.get(url, options);
  }

  do(...args) {
    return got(...args);
  }
}

const request = new Request();
module.exports = request;
