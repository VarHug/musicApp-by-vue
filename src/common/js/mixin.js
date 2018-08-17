import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode} from '@/common/js/config.js';
import {shuffle} from '@/common/js/util.js';

export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist);
  },
  activated() {
    this.handlePlaylist(this.playlist);
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method');
    }
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal);
    }
  }
};

export const playerMixin = {
  computed: {
    iconMode() {
      if (this.mode === playMode.sequence) {
        return 'icon-play-list';
      } else if (this.mode === playMode.loop) {
        return 'icon-play-singal';
      } else {
        return 'icon-play-random';
      }
    },
    ...mapGetters([
      'sequenceList',
      'curSong',
      'mode',
      'playlist',
      'favoriteList'
    ])
  },
  methods: {
    changeMode() {
      const mode = (this.mode + 1) % 3;
      this.setPlayMode(mode);
      let list = null;
      if (this.mode === playMode.random) {
        list = shuffle(this.sequenceList);
      } else {
        list = this.sequenceList;
      }
      this._resetCurIndex(list);
      this.setPlayList(list);
    },
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite';
      } else {
        return 'icon-not-favorite';
      }
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song);
      } else {
        this.saveFavoriteList(song);
      }
    },
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id;
      });
      return index > -1;
    },
    // curIndex随歌曲模式切换而改变，从而保证在切换模式时当前播放的歌曲不变
    _resetCurIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.curSong.id;
      });
      this.setCurIndex(index);
    },
    ...mapMutations({
      setPlayingState: 'SET_PLAYING_STATE',
      setCurIndex: 'SET_CUR_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
};

export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    };
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    blurInput() {
      this.$refs.searchBox.blur();
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    onQueryChange(query) {
      this.query = query;
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
};
