import {playMode} from '../common/js/config';

const state = {
  singer: {},
  playing: false, // 播放状态
  fullScreen: false, // 是否全屏
  playlist: [], // 播放列表
  sequenceList: [], // 顺序列表
  mode: playMode.sequence,
  curIndex: -1 // 当前播放的歌曲
};

export default state;
