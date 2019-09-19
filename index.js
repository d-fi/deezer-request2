const request = require('./request');

const defaultAPIParameters = {
  api_key: 'ZAIVAHCEISOHWAICUQUEXAEPICENGUAFAEZAIPHAELEEVAHPHUCUFONGUAPASUAY',
  output: 3,
  input: 3,
};

const unofficialApiUrl = 'https://api.deezer.com/1.0/gateway.php';

class DeezerApi {
  constructor(requestFactory) {
    this.baseParameters = defaultAPIParameters;
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
        method: 'song.getData',
      }),
      {
        sng_id: songID,
      }
    );
  }

  getPlaylistTracks(playlistID) {
    return request.post(
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
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'artist.getData',
      }),
      {
        art_id: artistID,
        filter_role_id: [0],
        lang: 'us',
        tab: 0,
        nb: -1,
        start: 0,
      }
    );
  }

  getDiscography(artistID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'album.getDiscography',
      }),
      {
        art_id: artistID,
        filter_role_id: [0],
        lang: 'us',
        nb: 500,
        nb_songs: -1,
        start: 0,
      }
    );
  }

  getProfile(profileID) {
    return request.post(
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
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'deezer.pageAlbum',
      }),
      {
        alb_id: albumID,
        lang: 'us',
        tab: 0,
      }
    );
  }

  getAlbumTrackInfo(albumID) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'song.getListByAlbum',
      }),
      {
        alb_id: albumID,
        start: '0',
        nb: '500',
      }
    );
  }

  searchMusic(query, nb = 15) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'search.music',
      }),
      {
        QUERY: query,
        OUTPUT: 'TRACK',
        NB: nb,
        FILTER: 0,
      }
    );
  }

  searchAlternative(trackInfos) {
    return request.post(
      unofficialApiUrl,
      this.getQueryParameters({
        method: 'search.music',
      }),
      {
        QUERY: "artist:'" + trackInfos.ART_NAME + "' track:'" + trackInfos.SNG_TITLE + "'",
        OUTPUT: 'TRACK',
        NB: 10,
        FILTER: 0,
      }
    );
  }

  getLyrics(songID) {
    return request.post(
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
module.exports = deezerApi;
