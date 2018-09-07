import {mapGetters, mapMutations, mapActions} from 'vuex';
import {playMode, DEFAULT_CATEGORY_ID} from '@/common/js/config.js';
import {shuffle} from '@/common/js/util.js';
import {getDissList} from '@/api/diss.js';
import {ERR_OK} from '@/api/config.js';
import {getRadioMusicData, createSong, isValidMusic, processSongsUrl} from '@/common/js/Song.js';
import {getRadioSongList} from '@/api/radio.js';

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

export const dissMixin = {
  data() {
    return {
      sin: 0,
      ein: 29,
      categoryId: DEFAULT_CATEGORY_ID,
      pullup: true,
      hasMore: true
    };
  },
  methods: {
    loadDissList() {
      if (this.hasMore) {
        this.sin += 30;
        this.ein += 30;
        this._getDissList();
      }
    },
    selectDiss(diss) {
      this.$router.push({
        name: 'dissDetail',
        params: {
          id: diss.dissid
        }
      });
      this.setDiss(diss);
    },
    _getDissList() {
      getDissList({
        sin: this.sin,
        ein: this.ein,
        categoryId: this.categoryId,
        sortId: this.sortId
      }).then(res => {
        if (res.code === ERR_OK) {
          this.dissList = this.dissList.concat(res.data.list);
          this._checkMore(res.data);
        }
      });
    },
    _checkMore(data) {
      if (this.ein > data.sum) {
        this.hasMore = false;
      }
    },
    ...mapMutations({
      setDiss: 'SET_DISS'
    })
  }
};

export const radioMixin = {
  methods: {
    selectRadio(radio) {
      getRadioSongList(radio.radioId).then(res => {
        let normalList = this._normallizeSongsList(res.songlist.data.track_list);
        processSongsUrl(normalList).then(songs => {
          this.songsList = songs;
          this.selectPlay({
            list: songs,
            index: 0
          });
        });
      });
    },
    _normallizeSongsList(list) {
      let ret = [];
      list.forEach(item => {
        let musicData = getRadioMusicData(item);
        if (isValidMusic(musicData)) {
          ret.push(createSong(musicData));
        }
      });
      return ret;
    },
    ...mapActions([
      'selectPlay'
    ])
  }
};
