<template>
  <transition name='slide'>
    <music-list :songs-list="songsList" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list';
import {mapGetters} from 'vuex';
import {getAlbumInfo} from '@/api/album.js';
import {ERR_OK} from '@/api/config.js';
import {createSong, isValidMusic, processSongsUrl} from '@/common/js/Song.js';

export default {
  data() {
    return {
      songsList: []
    };
  },
  computed: {
    title() {
      return this.album.album_name;
    },
    bgImage() {
      return `http://y.gtimg.cn/music/photo_new/T002R300x300M000${this.album.album_mid}.jpg?max_age=2592000`;
    },
    ...mapGetters([
      'album'
    ])
  },
  created() {
    this._getAlbumInfo();
  },
  methods: {
    _getAlbumInfo() {
      if (!this.album.album_mid) {
        this.$router.back();
        return;
      }
      getAlbumInfo(this.album.album_mid).then(res => {
        if (res.code === ERR_OK) {
          let normalList = this._normallizeSongsList(res.data.list);
          processSongsUrl(normalList).then(songs => {
            this.songsList = songs;
          });
        }
      });
    },
    _normallizeSongsList(list) {
      let res = [];
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          res.push(createSong(musicData));
        }
      });
      return res;
    }
  },
  components: {
    MusicList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
