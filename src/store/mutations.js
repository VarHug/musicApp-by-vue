import * as types from './mutation-types';

const mutations = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag;
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag;
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list;
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list;
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode;
  },
  [types.SET_CUR_INDEX](state, index) {
    state.curIndex = index;
  },
  [types.SET_DISS](state, diss) {
    state.diss = diss;
  },
  [types.SET_TOP_LIST](state, list) {
    state.topList = list;
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history;
  },
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history;
  },
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list;
  },
  [types.SET_RADIO_LIST](state, list) {
    state.radioList = list;
  },
  [types.SET_ALBUM](state, album) {
    state.album = album;
  }
};

export default mutations;
