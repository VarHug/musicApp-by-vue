<template>
  <transition name="slide">
  <div class="add-song" v-show="showFlag" @click.stop="">
    <div class="header">
      <h1 class="title">添加歌曲到播放列表</h1>
      <div class="close" @click="hide">
        <i class="icon-dismiss"></i>
      </div>
    </div>
    <div class="search-box-wrapper">
      <search-box ref="searchBox" placeholder="搜索歌曲" @query="onQueryChange"></search-box>
    </div>
    <div class="shortcut" v-show="!query">
      <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
      <div class="list-wrapper">
        <scroll class="list-scroll" v-if="currentIndex === 0" :data="playHistory" ref="songList">
          <div class="list-inner">
            <song-list :songs-list="playHistory" :rankNumShow="rankNumShow" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll class="list-scroll" v-if="currentIndex === 1" :data="searchHistory" ref="searchList" :refreshDelay="refreshDelay">
          <div class="list-inner">
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </scroll>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" :showSinger="false" @select="selectSuggest" @listScroll="blurInput"></suggest>
    </div>
    <top-tip ref="topTip" :delay="delay">
      <div class="tip-title">
        <i class="icon-songlist"></i>
        <span class="text">1首歌曲已经添加到播放列表</span>
      </div>
    </top-tip>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box';
import Switches from '@/base/switches/switches';
import Scroll from '@/base/scroll/scroll';
import SearchList from '@/base/search-list/search-list';
import SongList from '@/base/song-list/song-list';
import TopTip from '@/base/top-tip/top-tip';
import Suggest from '@/components/suggest/suggest';
import {searchMixin} from '@/common/js/mixin.js';
import {mapGetters, mapActions} from 'vuex';
import Song from '@/common/js/Song.js';

export default {
  mixins: [
    searchMixin
  ],
  data() {
    return {
      showFlag: false,
      currentIndex: 0,
      switches: [
        {name: '最近播放'},
        {name: '搜索历史'}
      ],
      rankNumShow: false,
      delay: 1000
    };
  },
  computed: {
    ...mapGetters([
      'playHistory'
    ])
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        if (this.currentIndex === 0) {
          this.$refs.songList.refresh();
        } else {
          this.$refs.searchList.refresh();
        }
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    switchItem(index) {
      this.currentIndex = index;
    },
    selectSuggest() {
      this.saveSearch();
      this.showTip();
    },
    selectSong(song, index) {
      if (index !== 0) {
        this.insertSong(new Song(song));
        this.showTip();
      }
    },
    showTip() {
      this.$refs.topTip.show();
    },
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    SearchBox,
    Switches,
    Scroll,
    SongList,
    SearchList,
    TopTip,
    Suggest
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      color $color-text-white-shallow
      background $color-background-red
      .title
        line-height: 44px
        font-size: $font-size-large
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-dismiss
          display: block
          padding: 12px
          font-size: 20px

    .search-box-wrapper
      background $color-background-red
      padding-bottom 10px
    .shortcut
      .list-wrapper
        position: absolute
        top: 125px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-songlist
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
