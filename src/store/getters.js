export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playlist = state => state.playlist;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const curIndex = state => state.curIndex;

export const curSong = (state) => {
  return state.playlist[state.curIndex] || {};
};

export const diss = state => state.diss;

export const topList = state => state.topList;
