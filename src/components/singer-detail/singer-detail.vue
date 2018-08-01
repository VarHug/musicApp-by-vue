<template>
  <transition name="slide">
    <div class="singer-detail"></div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex';
import {getSingerDetail} from '@/api/singer.js';
import {ERR_OK} from '@/api/config.js';
import {createSong, isValidMusic, processSongsUrl} from '@/common/js/Song.js';

export default {
  data() {
    return {
      songsList: []
    };
  },
  created() {
    this._getSingerDetail();
  },
  computed: {
    ...mapGetters([
      'singer'
    ])
  },
  methods: {
    _getSingerDetail() {
      if (!this.singer.mid) {
        this.$router.push('/singer');
        return;
      }
      getSingerDetail(this.singer.mid).then(res => {
        if (res.code === ERR_OK) {
          let normalList = this._normallizeSongsList(res.data.list);
          processSongsUrl(normalList).then(songs => {
            this.songsList = songs;
            console.log(this.songsList);
          });
        }
      });
    },
    _normallizeSongsList(list) {
      let res = [];
      list.forEach(item => {
        let {musicData} = item;
        if (isValidMusic(musicData)) {
          res.push(createSong(musicData));
        }
      });
      return res;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .singer-detail
    position fixed
    z-index 100
    top 0
    left 0
    right 0
    bottom 0
    background $color-background

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slider-enter, .slider-leave-to
    transform translate3d(100%, 0, 0)

</style>
