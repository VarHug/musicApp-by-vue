<template>
  <transition name="slide">
  <div class="diss-hot" v-show="showFlag">
    <route-header title="热门歌单·全部" @back="hide"></route-header>
    <scroll :data="dissList" class="hot-list" v-if="dissList" :pullup="pullup" @scrollToEnd="loadDissList" ref="hotList">
      <ul>
        <li v-for="(diss, index) in dissList" :key="index" class="diss-item" @click="selectDiss(diss)">
          <div class="avatar">
            <div class="icon">
              <i class="icon-exclusive"></i>
            </div>
            <img width="100%" height="100%" v-lazy="diss.imgurl">
          </div>
          <div class="diss-desc">
            <div class="diss-name" v-html="diss.dissname"></div>
            <div class="diss-creator" v-html="'by ' + diss.creator.name"></div>
          </div>
        </li>
        <loading v-show="dissList.length && hasMore"></loading>
        <div class="no-result" v-show="!hasMore">-没有更多歌单啦-</div>
      </ul>
      <loading v-show="!dissList.length"></loading>
    </scroll>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {dissMixin, playlistMixin} from '@/common/js/mixin.js';
import Loading from '@/base/loading/loading';
import Scroll from '@/base/scroll/scroll';
import RouteHeader from '@/base/route-header/route-header';
import {SORT_ID} from '@/common/js/config.js';

export default {
  mixins: [
    dissMixin,
    playlistMixin
  ],
  data() {
    return {
      showFlag: false,
      sortId: SORT_ID.hot,
      dissList: []
    };
  },
  methods: {
    show() {
      this.showFlag = true;
      this._getDissList();
    },
    hide() {
      this.showFlag = false;
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.hotList.$el.style.bottom = bottom;
      this.$refs.hotList.refresh();
    }
  },
  components: {
    Scroll,
    Loading,
    RouteHeader
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .diss-hot
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 100
    background $color-background
    .hot-list
      position absolute
      top 40px
      bottom 0
      padding 0 5px
      width 100%
      overflow hidden
      .diss-item
        display flex
        padding-top 5px
        .avatar
          position relative
          width 100px
          height 100px
          .icon
            position absolute
            top 0
            left 0
            width 0
            height 0
            border-width 15px
            border-style solid
            border-color $color-sub-theme transparent transparent $color-sub-theme
            border-radius 5px 0px 0px 0px
            .icon-exclusive
              position absolute
              top -11px
              left -13px
              transform rotate(-45deg)
              font-size $font-size-small
              color $color-background
          img
            border-radius 5px
        .diss-desc
          flex 1
          padding-left 10px
          border-1px($color-border)
          .diss-name
            margin 20px 0 10px 0
            font-size $font-size-medium-x
            color $color-text
          .diss-creator
            font-size $font-size-medium
            color $color-text-grey

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
