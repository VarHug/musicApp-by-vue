<template>
  <transition name="slide">
    <div class="radio">
      <route-header title="电台" @back="back"></route-header>
      <scroll class="radio-shortcut" :scrollX="isScrollX" ref="shortcut">
        <div class="radio-shortcut-inner" ref="shortcutInner">
          <ul class="radio-shortcut-content" @click="selectGroup($event)">
            <li v-for="(item, index) in radioList" :key="index" class="radio-shortcut-item" ref="shortcutItem" :data-index="index" :class="{'current': currentIndex === index}">{{item.name}}</li>
          </ul>
        </div>
      </scroll>
      <scroll class="radio-list" :data="radioList" ref="radioList" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll">
        <ul class="radio-list-inner">
          <li v-for="(group, index) in radioList" :key="index" ref="listGroup">
            <div>
              <h1 class="title">{{group.name}}</h1>
              <ul class="category-list">
                <li v-for="(item, index) in group.radioList" :key="index" class="radio-item" @click="selectRadio(item)">
                  <div class="img-wrapper">
                    <img width="100%" height="100%" v-lazy="item.radioImg" class="radioImage">
                  </div>
                  <span class="name">{{item.radioName}}</span>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import RouteHeader from '@/base/route-header/route-header';
import Scroll from '@/base/scroll/scroll';
import {mapGetters} from 'vuex';
import {getData} from '@/common/js/dom.js';
import {playlistMixin, radioMixin} from '@/common/js/mixin.js';

export default {
  mixins: [
    playlistMixin,
    radioMixin
  ],
  data() {
    return {
      isScrollX: true,
      scrollY: -1,
      diff: -1,
      currentIndex: 0
    };
  },
  computed: {
    ...mapGetters([
      'radioList'
    ])
  },
  created() {
    this.listenScroll = true;
    this.listHeight = [];
    this.probeType = 3;
  },
  mounted() {
    this.$nextTick(() => {
      this._initShortCut();
      // this.$refs.radioList.refresh();
      this._calculateHeight();
    });
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.radioList.$el.style.bottom = bottom;
      this.$refs.radioList.refresh();
    },
    back() {
      this.$router.back();
    },
    selectGroup(e) {
      let anchorIndex = getData(e.target, 'index');
      this._scrollToElement(anchorIndex);
    },
    scroll(pos) {
      this.scrollY = pos.y;
    },
    _initShortCut() {
      if (this.$refs.shortcutItem) {
        let itemWidth = this.$refs.shortcutItem[0].clientWidth;
        let width = itemWidth * this.$refs.shortcutItem.length;
        this.$refs.shortcutInner.style.width = `${width}px`;
        this.$refs.shortcut.refresh();
      }
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
    },
    _scrollToElement(index) {
      // 点击shortcut的padding区域时
      if (!index && index !== 0) {
        return;
      }
      // 滑动超出shortcut上padding或者超出shortcut下padding
      if (index < 0) {
        index = 0;
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2;
      }
      this.scrollY = -this.listHeight[index];
      this.$refs.radioList.scrollToElement(this.$refs.listGroup[index], 300);
    },
    _followScroll(index) {
      this.$refs.shortcut.scrollToElement(this.$refs.shortcutItem[index], 300, -100, 0);
    }
  },
  watch: {
    scrollY(newY) {
      const listHeight = this.listHeight;
      const last = listHeight.length - 1;
      // 当滚动到顶部,newY > 0
      if (newY > 0) {
        this.currentIndex = 0;
      }
      // 当滚动到中间部分时
      if (-newY > 0 && -newY < listHeight[last]) {
        for (let i = 0; i < listHeight.length - 1; i++) {
          let low = listHeight[i];
          let high = listHeight[i + 1];
          if (-newY >= low && -newY < high) {
            this.currentIndex = i;
          }
        }
      }
      // 当滚动到底部时,-newY大于最后一个元素的high(上限)
      if (-newY >= listHeight[last]) {
        this.currentIndex = listHeight.length - 2;
      }
      this._followScroll(this.currentIndex);
    }
  },
  components: {
    RouteHeader,
    Scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .radio
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 100
    background $color-background
    .radio-shortcut
      margin-top 10px
      width 100%
      overflow hidden
      .radio-shortcut-content
        /.radio-shortcut-item
          position relative
          display inline-block
          width 50px
          height 50px
          text-align center
          font-size $font-size-medium
          color $color-text-grey
          &:after
            content ''
            position absolute
            top 20px
            left 50%
            transform translateX(-50%)
            width 1px
            height 10px
            background $color-text-grey
          &.current
            font-size $font-size-medium-x
            color $color-text
            &:after
              width 2px
              height 15px
              color $color-text
    .radio-list
      position fixed
      top 100px
      bottom 0
      padding 10px
      width 100%
      overflow hidden
      box-sizing border-box
      .radio-list-inner
        .title
          margin-bottom 10px
          line-height 30px
          color #93999f
          background $color-background-grey
        .category-list
          display flex
          flex-flow row wrap
          justify-content space-between
          /.radio-item
            flex 0 0 30%
            width 30%
            font-size $font-size-medium
          .img-wrapper
            position relative
            width 100%
            height 0
            padding-top 100%
            .radioImage
              position absolute
              top 0
              left 0
              border-radius 50%
          .name
            display inline-block
            width 100%
            line-height 40px
            text-align center
            no-wrap()

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)

</style>
