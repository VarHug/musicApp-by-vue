<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-arrow-left"></i>
    </div>
    <h1 class="title" v-html="title"></h1>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="play-wrapper">
        <div class="play" v-show="songsList.length > 0" ref="playBtn" @click="random">
          <i class="icon-play-random"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" ref="filter"></div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data="songsList" class="list" ref="list" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll">
      <div class="song-list-wrapper">
        <song-list :songs-list="songsList" @select="selectItem" :rank="rank"></song-list>
      </div>
      <div class="loading-container" v-show="!songsList.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import SongList from '@/base/song-list/song-list';
import {prefix} from '@/common/js/dom.js';
import Loading from '@/base/loading/loading';
import {mapActions} from 'vuex';
import {playlistMixin} from '../../common/js/mixin.js';

const RESERVED_HEIGHT = 50;
const transform = prefix('transform');
const backdrop = prefix('backdrop-filter');

export default {
  mixins: [
    playlistMixin
  ],
  props: {
    songsList: {
      type: Array,
      default: () => []
    },
    bgImage: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      scrollY: 0
    };
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`;
    }
  },
  created() {
    this.probeType = 3;
    this.listenScroll = true;
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT; // layer层滚动距离
    this.$refs.list.$el.style.top = `${this.imageHeight}px`;
    this.$refs.layer.style.top = `${this.imageHeight - 10}px`;
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    selectItem(song, index) {
      this.selectPlay({
        list: this.songsList,
        index: index
      });
    },
    random() {
      this.randomPlay({
        list: this.songsList
      });
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.list.$el.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    ...mapActions([
      'selectPlay',
      'randomPlay'
    ])
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      let height = '100%';
      let scale = 1;
      let blur = 0;
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
      const percent = Math.abs(newY / this.imageHeight);
      if (newY > 0) {
        scale += percent;
        zIndex = 10;
        height = '15px';
      } else {
        blur = Math.min(20 * percent, 20);
      }
      // 滑动到顶部判断
      if (newY < this.minTranslateY) {
        zIndex = 10;
        height = '10px';
        this.$refs.bgImage.style.paddingTop = 0;
        this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
        this.$refs.playBtn.style.display = 'none';
      } else {
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = 0;
        this.$refs.playBtn.style.display = '';
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.layer.style.height = `${height}`;
      this.$refs.layer.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
    }
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position fixed
    z-index 100
    top 0
    left 0
    bottom 0
    right 0
    background $color-background
    .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-arrow-left
        display block
        padding 10px
        font-size $font-size-large
        color $color-text-white
    .title
      position absolute
      top 0
      left 10%
      z-index 40
      width 80%
      no-wrap()
      text-indent 1em
      line-height 40px
      font-size $font-size-large
      color $color-text-white
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
      .play-wrapper
        position absolute
        bottom 20px
        z-index 50
        width 100%
        .play
          box-sizing border-box
          width 135px
          padding 7px 0
          margin 0 auto
          text-align center
          color $color-text-white-shallow
          background $color-background-red
          border-radius 100px
          font-size 0
          .icon-play-random
            display inline-block
            vertical-align middle
            margin-right 6px
            font-size $font-size-medium-x
          .text
            display inline-block
            vertical-align middle
            font-size $font-size-small
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)
    .bg-layer
      position absolute
      width 100%
      height 100%
      background $color-background
      border-radius 10px 10px 0 0
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      background $color-background
      .song-list-wrapper
        padding 20px 30px
      .loading-container
        position absolute
        width 100%
        top 50%
        transform translateY(-50%)
</style>
