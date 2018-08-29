<template>
  <transition name="fade">
  <div class="swipe-bar" v-show="showFlag" @click="hide">
    <transition name="slide">
    <div class="swipe-content"
        ref="swipeContent"
        v-show="showFlag"
        @touchstart.prevent="swipeTouchStart"
        @touchmove.prevent="swipeTouchMove"
        @touchend="swipeTouchEnd"
    >
      <div class="swipe-header">
        <div class="user">
          <a class="avatar-wrapper" @touchstart.prevent="toUser">
            <img class="avatar" src="../../common/image/avatar.jpg" width="100%" height="100%">
          </a>
          <div class="user-name">VarHug</div>
        </div>
        <div class="filter"></div>
      </div>
    </div>
    </transition>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {prefix} from '@/common/js/dom.js';

const transform = prefix('transform');
const transitionDuration = prefix('transitionDuration');
const time = 500;

export default {
  data() {
    return {
      showFlag: false
    };
  },
  created() {
    this.touch = {};
  },
  methods: {
    show() {
      this.$refs.swipeContent.style = '';
      this.showFlag = true;
    },
    hide() {
      this.showFlag = false;
      this._swipeHide();
    },
    toUser() {
      this.hide();
      setTimeout(() => {
        this.$router.push({
          path: '/user'
        });
      }, time);
    },
    swipeTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
    },
    swipeTouchMove(e) {
      if (this.touch.initiated) {
        const touch = e.touches[0];
        const deltaX = touch.pageX - this.touch.startX;
        if (deltaX < 0) {
          const swipeContentWidth = this.$refs.swipeContent.clientWidth;
          this.touch.percent = Math.abs(deltaX / swipeContentWidth);
          this.$refs.swipeContent.style[transform] = `translate3d(${deltaX}px, 0, 0)`;
          this.$refs.swipeContent.style[transitionDuration] = 0;
        }
      }
    },
    swipeTouchEnd() {
      if (this.touch.percent) {
        if (this.touch.percent >= 0.5) {
          this.hide();
        } else {
          this._swipeShow();
          // 解决异步动画未能执行完成
          setTimeout(() => {
            this.$refs.swipeContent.style = '';
          }, time);
        }
        this.touch = {};
      }
    },
    _swipeShow() {
      this.$refs.swipeContent.style[transitionDuration] = `${time}ms`;
      this.$refs.swipeContent.style[transform] = `translate3d(0, 0, 0)`;
    },
    _swipeHide() {
      this.$refs.swipeContent.style[transitionDuration] = `${time}ms`;
      this.$refs.swipeContent.style[transform] = `translate3d(-100%, 0, 0)`;
    }
  },
  components: {

  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .swipe-bar
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 200
    background $color-background-d
    &.fade-enter-active, &.fade-leave-active
      transition all .5s
    &.fade-enter, &.fade-leave-to
      transform opacity 1
    .swipe-content
      position relative
      width 80%
      height 100%
      background $color-background
      &.slide-enter-active
        transition all .5s
      &.slide-enter
        transform translate3d(-100%, 0, 0)
      .swipe-header
        position relative
        height 200px
        background url("../../common/image/background.jpg")
        background-size cover
        .user
          position absolute
          left 20px
          top 80px
          z-index 10
          .avatar-wrapper
            display block
            margin-bottom 10px
            width 75px
            height 75px
            .avatar
              border-radius 50%
          .user-name
            line-height 20px
            height 20px
            font-size $font-size-medium
            color $color-text-white
        .filter
          position absolute
          top 0
          left 0
          width 100%
          height 100%
          background rgba(7,17,27,0.4)
</style>
