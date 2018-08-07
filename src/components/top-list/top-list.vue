<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs-list="songsList" :rank="rank"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from '@/components/music-list/music-list';
import {mapGetters} from 'vuex';
import {getMusicList} from '@/api/rank.js';
import {ERR_OK} from '@/api/config.js';
import {createSong, isValidMusic, processSongsUrl} from '@/common/js/Song.js';

export default {
  data() {
    return {
      songsList: [],
      rank: true
    };
  },
  computed: {
    title() {
      return this.topList.topTitle;
    },
    bgImage() {
      if (this.songsList.length) {
        return this.songsList[0].image;
      }
    },
    ...mapGetters([
      'topList'
    ])
  },
  created() {
    this._getMusicList();
  },
  methods: {
    _getMusicList() {
      if (!this.topList.id) {
        this.$router.push('/rank');
        return;
      }
      getMusicList(this.topList.id).then(res => {
        if (res.code === ERR_OK) {
          let normalList = this._normallizeSongsList(res.songlist);
          processSongsUrl(normalList).then(songs => {
            this.songsList = songs;
          });
        }
      });
    },
    _normallizeSongsList(list) {
      let res = [];
      list.forEach(item => {
        const musicData = item.data;
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
