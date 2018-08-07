import {playMode} from '../common/js/config';

const state = {
  singer: {}, // 歌手信息
  playing: false, // 播放状态
  fullScreen: false, // 是否全屏
  playlist: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence,
  curIndex: -1, // 当前播放的歌曲
  diss: {}, // 歌单信息
  topList: {} // 排行榜歌曲信息
};

export default state;
