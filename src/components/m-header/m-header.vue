<template>
  <div class="m-header">
    <div class="swipe" @click="showSwipeBar">
      <i class="icon icon-list"></i>
    </div>
    <div class="icon-wrapper">
      <i class="icon icon-songlist"></i>
    </div>
    <router-link tag="div" class="search" to="/search">
      <i class="icon icon-search"></i>
    </router-link>
    <swipe-bar ref="swipeBar"></swipe-bar>
  </div>
</template>

<script type="text/ecmascript-6">
import SwipeBar from '../../components/swipe-bar/swipe-bar';

export default {
  methods: {
    showSwipeBar() {
      this.$refs.swipeBar.show();
    }
  },
  components: {
    SwipeBar
  }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 64px
    padding-top 15px
    text-align: center
    color $color-text-white
    font-size: 0
    background-color $color-background-red
    box-sizing border-box
    .icon
      font-size 25px
    .swipe
      position absolute
      top 15px
      left 10px
    .search
      position absolute
      top 10px
      right 5px
      padding 5px
</style>
