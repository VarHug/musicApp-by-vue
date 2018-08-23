<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs-list="songsList"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list';
import {mapGetters} from 'vuex';
import {getDissSongList} from '@/api/diss.js';
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
      return this.diss.dissname;
    },
    bgImage() {
      return this.diss.imgurl;
    },
    ...mapGetters([
      'diss'
    ])
  },
  created() {
    this._getDissSongList();
  },
  methods: {
    _getDissSongList() {
      if (!this.diss.dissid) {
        this.$router.back();
        return;
      }
      getDissSongList(this.diss.dissid).then(res => {
        if (res.code === ERR_OK) {
          let normalList = this._normallizeSongsList(res.cdlist[0].songlist);
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
