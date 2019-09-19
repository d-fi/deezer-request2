const request = require("./request");

const defaultAPIParameters = {
  api_version: "1.0",
  api_token: "",
  input: 3
};

const unofficialApiUrl = "https://www.deezer.com/ajax/gw-light.php";

class DeezerApi {
  constructor(requestFactory) {
    this.baseParameters = defaultAPIParameters;
  }

  /**
   * Get a cid for a unofficial api request.
   *
   * @return {Number}
   */
  static getApiCid() {
    return Math.floor(1e9 * Math.random());
  }

  setCookie(name, value) {
    request.setCookie(name, value, unofficialApiUrl);
  }

  setParameter(name, value) {
    this.baseParameters[name] = value;
  }

  getQueryParameters(parameters) {
    return Object.assign(this.baseParameters, parameters);
  }

  getTrackInfo(songID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "deezer.pageTrack",
        cid: this.constructor.getApiCid()
      }),
      {
        sng_id: songID
      },
      true,
      true,
      true
    );
  }

  getTrackInfos(...songIDs) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "song.getListAllData",
        cid: this.constructor.getApiCid()
      }),
      {
        SNG_IDS: songIDs.map(value => [value, 0])
      },
      true,
      true,
      true
    );
  }

  getUserData() {
    return request.get(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "deezer.getUserData",
        cid: this.constructor.getApiCid()
      }),
      true,
      false,
      true
    );
  }

  getPlaylistTracks(playlistID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "deezer.pagePlaylist",
        cid: this.constructor.getApiCid()
      }),
      {
        playlist_id: playlistID,
        lang: "en",
        nb: -1,
        start: 0,
        tab: 0,
        tags: true,
        header: true
      },
      true,
      true,
      true
    );
  }

  getArtistInfo(artistID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "artist.getData",
        cid: this.constructor.getApiCid()
      }),
      {
        art_id: artistID,
        filter_role_id: [0],
        lang: "us",
        tab: 0,
        nb: -1,
        start: 0
      },
      true,
      true,
      true
    );
  }

  getDiscography(artistID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "album.getDiscography",
        cid: this.constructor.getApiCid()
      }),
      {
        art_id: artistID,
        filter_role_id: [0],
        lang: "us",
        nb: 500,
        nb_songs: -1,
        start: 0
      },
      true,
      true,
      true
    );
  }

  getProfile(profileID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "deezer.pageProfile",
        cid: this.constructor.getApiCid()
      }),
      {
        user_id: profileID,
        tab: "loved",
        nb: -1
      },
      true,
      true,
      true
    );
  }

  getAlbumTracks(albumID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "deezer.pageAlbum",
        cid: this.constructor.getApiCid()
      }),
      {
        alb_id: albumID,
        lang: "us",
        tab: 0
      },
      true,
      true,
      true
    );
  }

  getAlbumTrackInfo(albumID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "song.getListByAlbum",
        cid: this.constructor.getApiCid()
      }),
      {
        alb_id: albumID,
        start: "0",
        nb: "500"
      },
      true,
      true,
      true
    );
  }

  searchAlternative(trackInfos) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "search.music",
        cid: this.constructor.getApiCid()
      }),
      {
        QUERY:
          "artist:'" +
          trackInfos.ART_NAME +
          "' track:'" +
          trackInfos.SNG_TITLE +
          "'",
        OUTPUT: "TRACK",
        NB: 50,
        FILTER: 0
      },
      true,
      true,
      true
    );
  }

  getLyrics(songID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: "song.getLyrics",
        cid: this.constructor.getApiCid()
      }),
      {
        sng_id: songID
      },
      true,
      true,
      true
    );
  }
}

const deezerApi = new DeezerApi();
module.exports = deezerApi;
