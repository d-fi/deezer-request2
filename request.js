const got = require("got");
const { CookieJar } = require("tough-cookie");
const map = new Map();

const DefaultHeaders = {
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
  "cache-control": "max-age=0",
  "accept-language": "en-US,en;q=0.9,en-US;q=0.8,en;q=0.7",
  "accept-charset": "utf-8,ISO-8859-1;q=0.8,*;q=0.7",
  "content-type": "text/plain;charset=UTF-8"
};

class Request {
  constructor() {
    this.cookieJar = new CookieJar();
  }

  setCookie(name, value, url) {
    this.cookieJar.setCookie(name + "=" + value, url, {}, () => {});
  }

  post(url, parameters, body, enableRetry, useCache, json) {
    let options = {
      cookieJar: this.cookieJar,
      headers: DefaultHeaders,
      json: json,
      query: parameters,
      body: body
    };

    if (!enableRetry) {
      options.retry = 0;
    }

    if (useCache) {
      options.cache = map;
    }

    return got(url, options);
  }

  get(url, parameters, enableRetry, useCache, json) {
    let options = {
      cookieJar: this.cookieJar,
      headers: DefaultHeaders,
      json: json,
      query: parameters
    };

    if (!enableRetry) {
      options.retry = 0;
    }

    if (useCache) {
      options.cache = map;
    }

    return got(url, options);
  }

  do(...args) {
    return got(...args);
  }
}

const request = new Request();
module.exports = request;
