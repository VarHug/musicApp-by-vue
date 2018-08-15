import * as types from './mutation-types';
import {playMode} from '@/common/js/config.js';
import {shuffle} from '@/common/js/util.js';
import {saveSearch, deleteSearch, clearSearch, savePlay} from '@/common/js/cache';

/**
 * 查找歌曲是否存在在歌曲列表中
 * @param {*} list // 歌曲列表
 * @param {*} song // 歌曲
 * @returns {Number}
 */
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id;
  });
}

export const selectPlay = function ({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list);
  if (state.mode === playMode.random) {
    let randomList = shuffle(list);
    commit(types.SET_PLAYLIST, randomList);
    index = findIndex(randomList, list[index]);
  } else {
    commit(types.SET_PLAYLIST, list);
  }
  commit(types.SET_CUR_INDEX, index);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_SEQUENCE_LIST, list);
  let randomList = shuffle(list);
  commit(types.SET_PLAYLIST, randomList);
  commit(types.SET_CUR_INDEX, 0);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const insertSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let curIndex = state.curIndex;
  // 记录当前歌曲
  let curSong = playlist[curIndex];

  // 查找当前播放列表中是否有要待插入的歌曲并返回其索引
  let fpIndex = findIndex(playlist, song);

  // 插入歌曲
  curIndex++;
  playlist.splice(curIndex, 0, song);

  // 如果已经包含了这首歌
  if (fpIndex > -1) {
    // 如果当前插入歌曲的序号大于列表中存在的歌曲的序号
    if (curIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      curIndex--;
    } else {
      playlist.splice(fpIndex + 1, 1);
    }
  }

  // sequenceList中的当前播放的歌曲的index + 1
  // 即
  // 要插入的歌曲应该插入的位置的index
  let curSIndex = findIndex(sequenceList, curSong) + 1;

  // sequenceList中是否包含要插入的歌曲
  let fsindex = findIndex(sequenceList, song);

  // 插入歌曲
  sequenceList.splice(curSIndex, 0, song);

  if (fsindex > -1) {
    if (curSIndex > fsindex) {
      sequenceList.splice(fsindex, 1);
    } else {
      sequenceList.splice(fsindex + 1, 1);
    }
  }

  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CUR_INDEX, curIndex);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_PLAYING_STATE, true);
};

export const deleteSong = function ({commit, state}, song) {
  let playlist = state.playlist.slice();
  let sequenceList = state.sequenceList.slice();
  let curIndex = state.curIndex;

  // 当前播放的歌曲在播放列表中的索引
  let pIndex = findIndex(playlist, song);
  playlist.splice(pIndex, 1);
  // 当前播放的歌曲在顺序列表中的索引
  let sIndex = findIndex(sequenceList, song);
  sequenceList.splice(sIndex, 1);

  if (curIndex > pIndex || curIndex === playlist.length) {
    curIndex--;
  }

  commit(types.SET_PLAYLIST, playlist);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CUR_INDEX, curIndex);

  const playingState = playlist.length > 0;

  commit(types.SET_PLAYING_STATE, playingState);
};

export const deleteSongList = function ({commit}) {
  commit(types.SET_PLAYLIST, []);
  commit(types.SET_SEQUENCE_LIST, []);
  commit(types.SET_CUR_INDEX, -1);
  commit(types.SET_PLAYING_STATE, false);
};

export const saveSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, saveSearch(query));
};

export const deleteSearchHistory = function ({commit}, query) {
  commit(types.SET_SEARCH_HISTORY, deleteSearch(query));
};

export const clearSearchHistory = function ({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearch());
};

export const savePlayHistory = function ({commit}, song) {
  commit(types.SET_PLAY_HISTORY, savePlay(song));
};
