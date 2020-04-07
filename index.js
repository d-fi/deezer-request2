const axios = require('axios');
const delay = require('delay');

const defaultAPIParameters = {
  api_key: 'ZAIVAHCEISOHWAICUQUEXAEPICENGUAFAEZAIPHAELEEVAHPHUCUFONGUAPASUAY',
  output: 3,
  input: 3,
};

const unofficialApiUrl = 'https://api.deezer.com/1.0/gateway.php';

const DefaultHeaders = {
  'user-agent': 'User-Agent: Deezer/7.17.0.2 CFNetwork/1098.6 Darwin/19.0.0',
  'cache-control': 'max-age=0',
  'accept-language': 'en-US,en;q=0.9,en-US;q=0.8,en;q=0.7',
  'accept-charset': 'utf-8,ISO-8859-1;q=0.8,*;q=0.7',
  'content-type': 'text/plain;charset=UTF-8',
};

const albumCache = new Map();

const request = (url, params, data) => {
  return axios.post(url, data, { params, headers: DefaultHeaders });
};

class DeezerApi {
  constructor(arl) {
    this.baseParameters = defaultAPIParameters;
  }

  setParameter(name, value) {
    this.baseParameters[name] = value;
  }

  async initDeezerApi(arl, options = {}) {
    if (arl) {
      options = {
        ...options,
        withCredentials: true,
        headers: {
          cookie: 'arl=' + arl,
        },
      };
    }

    const { data } = await axios.get(
      'https://www.deezer.com/ajax/gw-light.php?method=deezer.ping&api_version=1.0&api_token',
      options
    );

    this.setParameter('sid', data.results.SESSION);
    return data.results.SESSION;
  }

  getQueryParameters(parameters) {
    return Object.assign(this.baseParameters, parameters);
  }

  async getTrackInfo(songID) {
    let { data } = await axios('https://api.deezer.com/track/' + songID);

    let results = await request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'song.getData',
      }),
      {
        sng_id: songID,
      }
    );

    results.data.results.TRACK_POSITION = data.track_position;
    results.data.results.DISK_NUMBER = data.disk_number;
    results.data.results.BPM = data.bpm;
    results.data.results.GAIN = data.gain;
    return results;
  }

  getPlaylistInfo(playlistID) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'playlist.getData',
      }),
      {
        playlist_id: playlistID,
        lang: 'en',
      }
    );
  }

  getPlaylistTracks(playlistID) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'playlist.getSongs',
      }),
      {
        playlist_id: playlistID,
        lang: 'en',
        nb: -1,
        start: 0,
        tab: 0,
        tags: true,
        header: true,
      }
    );
  }

  getArtistInfo(artistID) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'artist.getData',
      }),
      {
        art_id: artistID,
        filter_role_id: [0],
        lang: 'en',
        tab: 0,
        nb: -1,
        start: 0,
      }
    );
  }

  getDiscography(artistID) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'album.getDiscography',
      }),
      {
        art_id: artistID,
        filter_role_id: [0],
        lang: 'en',
        nb: 500,
        nb_songs: -1,
        start: 0,
      }
    );
  }

  getProfile(profileID) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'mobile.pageUser',
      }),
      {
        user_id: profileID,
        tab: 'loved',
        nb: -1,
      }
    );
  }

  getAlbumTracks(albumID) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'song.getListByAlbum',
      }),
      {
        alb_id: albumID,
        lang: 'us',
        nb: -1,
      }
    );
  }

  async getAlbumTrackInfo(albumID) {
    if (albumCache[albumID]) {
      return albumCache[albumID];
    }

    let { data } = await axios('https://api.deezer.com/album/' + albumID);

    let results = await request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'album.getData',
      }),
      {
        alb_id: albumID,
        start: '0',
        nb: '500',
      }
    );

    results.data.results.GENRES = data.genres.data.map((genre) => genre.name);
    results.data.results.LABEL = data.label;
    albumCache[albumID] = results;

    return results;
  }

  searchMusic(query, nb = 15) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'search.music',
      }),
      {
        query,
        nb,
        output: 'TRACK',
        filter: 'TRACK',
        start: 0,
      }
    );
  }

  searchAlternative(trackInfos, nb = 10) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'search.music',
      }),
      {
        query: "artist:'" + trackInfos.ART_NAME + "' track:'" + trackInfos.SNG_TITLE + "'",
        output: 'TRACK',
        filter: 'TRACK',
        nb,
      }
    );
  }

  getLyrics(songID) {
    return request(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'song.getLyrics',
      }),
      {
        sng_id: songID,
      }
    );
  }
}

const deezerApi = new DeezerApi();

// Add a request interceptor
axios.interceptors.response.use(async (response) => {
  // Do something before request is sent
  if (response.data.error && Object.keys(response.data.error).length > 0) {
    if (response.data.error.NEED_API_AUTH_REQUIRED) {
      const sid = await deezerApi.initDeezerApi();
      response.config.params.sid = sid;
      return await axios(response.config);
    } else if (response.data.error.code == 4) {
      await delay(1000);
      return await axios(response.config);
    }
  }
  return response;
});

module.exports = deezerApi;
