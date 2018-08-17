<template>
  <div class="slide-list">
    <div class="back" @click="back">
      <i class="icon-arrow-left"></i>
    </div>
    <div class="bg-image" :style="bgStyle" ref="bgImage">
      <div class="filter" ref="filter"></div>
    </div>
    <div class="content" ref="content">
      <slot name="top"></slot>
    </div>
    <div class="bg-layer" ref="layer">
      <div class="middle" ref="middle">
        <slot name="middle"></slot>
      </div>
    </div>
    <scroll :data="scrollData" class="list" ref="list" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll">
      <div class="scroll-inner" ref="scrollInner">
        <slot name="bottom"></slot>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import {prefix} from '@/common/js/dom.js';

const RESERVED_HEIGHT = 50;
const transform = prefix('transform');
const backdrop = prefix('backdrop-filter');

export default {
  props: {
    bgImage: {
      type: String,
      default: ''
    },
    scrollData: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      listenScroll: true,
      probeType: 3,
      scrollY: 0
    };
  },
  computed: {
    bgStyle() {
      return `background-image: url(${this.bgImage})`;
    }
  },
  mounted() {
    this.imageHeight = this.$refs.bgImage.clientHeight;
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT; // layer层滚动距离
    let layerTop = this.imageHeight - 10;
    let middleHeight = this.$refs.middle.clientHeight;
    this.$refs.list.$el.style.top = `${layerTop + middleHeight + 5}px`;
    this.$refs.layer.style.top = `${layerTop}px`;
    this.$refs.scrollInner.style.minHeight = `${window.innerHeight - RESERVED_HEIGHT}px`;
  },
  methods: {
    scroll(pos) {
      this.scrollY = pos.y;
    },
    back() {
      this.$router.back();
    },
    refresh() {
      this.$refs.list.refresh();
    },
    setBottom(bottom) {
      this.$refs.list.$el.style.bottom = `${bottom}px`;
    }
  },
  watch: {
    scrollY(newY) {
      let translateY = Math.max(this.minTranslateY, newY);
      let zIndex = 0;
      let height = '100%';
      let scale = 1;
      let blur = 0;
      this.$refs.layer.style[transform] = `translate3d(0, ${translateY}px, 0)`;
      this.$refs.content.style[transform] = `translate3d(0, ${translateY}px, 0)`;
      const percent = Math.abs(newY / this.imageHeight);
      this.$refs.content.style.opacity = 1 - percent;
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
      } else {
        this.$refs.bgImage.style.paddingTop = '70%';
        this.$refs.bgImage.style.height = 0;
      }
      this.$refs.bgImage.style.zIndex = zIndex;
      this.$refs.layer.style.height = `${height}`;
      this.$refs.layer.style.zIndex = zIndex;
      this.$refs.content.style.zIndex = zIndex;
      this.$refs.bgImage.style[transform] = `scale(${scale})`;
      this.$refs.filter.style[backdrop] = `blur(${blur}px)`;
    }
  },
  components: {
    Scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slide-list
    position relative
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
    .bg-image
      position relative
      width 100%
      height 0
      padding-top 70%
      transform-origin top
      background-size cover
      .filter
        position absolute
        top 0
        left 0
        width 100%
        height 100%
        background rgba(7, 17, 27, 0.4)
    .content
      position absolute
      top 0
      left 0
    .bg-layer
      position absolute
      width 100%
      height 100%
      background $color-background
      border-radius 10px 10px 0 0
      .middle
        position relative
        top 5px
    .list
      position fixed
      top 0
      bottom 0
      width 100%
      background $color-background
      .scroll-inner
        padding 20px 30px
</style>
