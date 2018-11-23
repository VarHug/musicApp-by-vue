<template>
  <transition name="slide">
  <div class="user-center" ref="userCenter">
    <slide-list :bg-image="bgImage" :scroll-data="scrollData" ref="slideList">
      <div slot="top">
        <div class="user">
          <div class="avatar-wrapper">
            <img class="avatar" src="../../common/image/avatar.jpg" width="100%" height="100%">
          </div>
          <div class="user-name">VarHug</div>
        </div>
      </div>
      <div slot="middle">
        <div class="switches-wrapper">
          <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        </div>
      </div>
      <div slot="bottom">
        <div class="list-inner" v-if="currentIndex === 0">
          <song-list :songs-list="favoriteList" :rankNumShow="rankNumShow" @select="selectSong"></song-list>
        </div>
        <div class="list-inner" v-if="currentIndex === 1">
          <song-list :songs-list="playHistory" :rankNumShow="rankNumShow" @select="selectSong"></song-list>
        </div>
        <div class="no-result-wrapper" v-show="noResult">
          <div>{{noResultDesc}}</div>
        </div>
      </div>
    </slide-list>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SlideList from '@/base/slide-list/slide-list';
import Switches from '@/base/switches/switches';
import SongList from '@/base/song-list/song-list';
import {mapGetters, mapActions} from 'vuex';
import Song from '@/common/js/Song.js';
import {playlistMixin} from '@/common/js/mixin.js';

export default {
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      bgImage: require('../../common/image/background.jpg'),
      scrollData: [],
      switches: [
        {name: '我喜欢的'},
        {name: '最近听的'}
      ],
      currentIndex: 0,
      rankNumShow: false
    };
  },
  computed: {
    noResult() {
      if (this.currentIndex === 0) {
        return !this.favoriteList.length;
      }
      if (this.currentIndex === 1) {
        return !this.playHistory.length;
      }
    },
    noResultDesc() {
      if (this.currentIndex === 0) {
        return '暂无收藏歌曲';
      }
      if (this.currentIndex === 1) {
        return '您最近还没有听过歌曲哦';
      }
    },
    ...mapGetters([
      'favoriteList',
      'playHistory'
    ])
  },
  methods: {
    back() {
      this.$router.back();
    },
    switchItem(index) {
      this.currentIndex = index;
      if (index === 0) {
        this.scrollData = this.favoriteList;
      }
      if (index === 1) {
        this.scrollData = this.playHistory;
      }
    },
    refresh() {
      this.$refs.slideList.refresh();
    },
    selectSong(song) {
      console.log(song);
      this.insertSong(new Song(song));
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60' : '';
      this.$refs.slideList.setBottom(bottom);
      this.$refs.slideList.refresh();
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SlideList,
    Switches,
    SongList
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .user
      position absolute
      left 20px
      top 80px
      z-index 10
      .avatar-wrapper
        margin-bottom 10px
        width 75px
        height 75px
        .avatar
          border-radius 50%
      .user-name
        line-height 20px
        text-align center
        height 20px
        font-size $font-size-medium
        color $color-text-white
    .switches-wrapper
      padding-top 5px
      border-1px($color-border)
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play-random
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      width: 100%
      text-align center
</style>
