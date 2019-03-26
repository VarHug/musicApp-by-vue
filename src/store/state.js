import {playMode} from '../common/js/config';
import {loadSearch, loadPlay, loadFavorite} from '../common/js/cache';

const state = {
  singer: {}, // 歌手信息
  playing: false, // 播放状态
  fullScreen: false, // 是否全屏
  playlist: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence,
  curIndex: -1, // 当前播放的歌曲
  diss: {}, // 歌单信息
  topList: {}, // 排行榜歌曲信息
  searchHistory: loadSearch(), // 搜索历史
  playHistory: loadPlay(), // 播放历史
  favoriteList: loadFavorite(),
  album: {} // 歌单信息
};

export default state;
