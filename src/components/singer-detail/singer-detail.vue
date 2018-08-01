<template>
  <transition name="slide">
    <music-list :songs-list="songsList" :title="title" :bg-image="bgImage"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import {mapGetters} from 'vuex';
import {getSingerDetail} from '@/api/singer.js';
import {ERR_OK} from '@/api/config.js';
import {createSong, isValidMusic, processSongsUrl} from '@/common/js/Song.js';
import MusicList from '@/components/music-list/music-list';

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
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
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
      console.log(this.singer);
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
