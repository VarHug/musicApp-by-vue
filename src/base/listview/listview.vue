<template>
  <scroll class="listview" :data="data" :listenScroll="listenScroll" :probeType="probeType" ref="listview" @scroll="scroll">
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group" ref="listGroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.items" :key="index" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar" class="avatar">
            <span class="name border-1px">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart($event)" @touchmove.stop.prevent="onShortcutTouchMove" @touchend.stop.prevent="onShortcutTouchEnd">
      <ul>
        <li class="item" v-for="(item, index) in shortcutList" :key="index" :data-index="index" :class="{'current': curIndex === index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" v-show="fixedTitle" ref="listFixed">
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
    <div class="bubble" v-show="bubbleShow">{{fixedTitle.substr(0, 1)}}</div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import {getData} from '@/common/js/dom.js';
import Loading from '@/base/loading/loading';

const ANCHOR_HEIGHT = 18;
const TITLE_HEIGHT = 30;

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.touch = {};
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  data() {
    return {
      scrollY: -1,
      curIndex: 0,
      diff: -1,
      bubbleShow: false
    };
  },
  computed: {
    shortcutList() {
      return this.data.map(group => {
        return group.title.substr(0, 1);
      });
    },
    fixedTitle() {
      if (this.scrollY > 0) {
        return '';
      }
      return this.data[this.curIndex] ? this.data[this.curIndex].title : '';
    }
  },
  methods: {
    onShortcutTouchStart(e) {
      this.bubbleShow = true;
      let anchorIndex = getData(e.target, 'index');
      let firstTouch = e.touches[0];
      this.touch.y1 = firstTouch.pageY;
      this.touch.anchorIndex = anchorIndex;
      this._scrollToElement(anchorIndex);
    },
    onShortcutTouchMove(e) {
      let firstTouch = e.touches[0];
      this.touch.y2 = firstTouch.pageY;
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0;
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta;
      this._scrollToElement(anchorIndex);
    },
    onShortcutTouchEnd() {
      this.bubbleShow = false;
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    selectItem(item) {
      this.$emit('select', item);
    },
    _scrollToElement(index) {
      // 点击list-shortcut的padding区域时
      if (!index && index !== 0) {
        return;
      }
      // 滑动超出list-shortcut上padding或者超出list-shortcut下padding
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0);
    },
    _calculateHeight() {
      this.listHeight = [];
      const list = this.$refs.listGroup;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < list.length; i++) {
        let item = list[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    }
  },
  watch: {
    data() {
      setTimeout(() => {
        this._calculateHeight();
      }, 20);
    },
    scrollY(newY) {
      const listHeight = this.listHeight;
      // 当滚动到顶部,newY > 0
      if (newY > 0) {
        this.curIndex = 0;
        return;
      }
      // 当滚动到中间部分时
      for (let i = 0; i < listHeight.length - 1; i++) {
        let low = listHeight[i];
        let high = listHeight[i + 1];
        if (-newY >= low && -newY < high) {
          this.curIndex = i;
          this.diff = high + newY; // - (-newY)
          return;
        }
      }
      // 当滚动到底部时,-newY大于最后一个元素的high(上限)
      this.curIndex = listHeight.length - 2;
    },
    diff(newVal) {
      let fixedTitleTransformY = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0;
      if (this.fixedTitleTransformY === fixedTitleTransformY) {
        return;
      }
      this.fixedTitleTransformY = fixedTitleTransformY;
      this.$refs.listFixed.style.transform = `translate3d(0, ${fixedTitleTransformY}px, 0)`;
    }
  },
  components: {
    Scroll,
    Loading
  }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .listview
    position: relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-white
        background $color-background-red
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          flex 0 0 50px
          width 50px
          height 50px
          border-radius 50%
        .name
          display block
          flex 1
          height 50px
          line-height 50px
          border-1px($color-border)
          margin-left 20px
          color $color-text
          font-size $font-size-medium
    .list-shortcut
      position absolute
      z-index 30
      right 5px
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-red
      font-family Helvetica
      .item
        padding 3px
        line-height 1
        color $color-text-white
        font-size $font-size-small
        &.current
          color $color-text-white-hover
          font-weight bold
    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-white
        background $color-background-red
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
    .bubble
      position absolute
      top 50%
      left 50%
      transform translate3d(-50%, -50%, 0)
      width 50px
      height 50px
      line-height 50px
      border-radius 50%
      text-align center
      color $color-text-white-hover
      background $color-background-red
</style>
