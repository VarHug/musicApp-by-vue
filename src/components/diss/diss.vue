<template>
  <transition name="slide">
    <div class="diss">
      <div class="back" @click="back">
        <i class="icon-arrow-left"></i>
      </div>
      <h1 class="title">歌单</h1>
      <scroll class="diss-content" :data="dissList">
        <div>
          <h2 class="sub-title">推荐分类</h2>
          <ul class="disslist-tag">
            <li class="disslist-tag-item" v-for="(item, index) in recommendDiss" :key="index">{{item.name}}</li>
          </ul>
          <h2 class="sub-title">编辑推荐</h2>
          <ul class="recommend-diss">
            <li v-for="(item, index) in dissList" :key="index" class="recommend-diss-item">
              <div class="img-wrapper">
                <img v-lazy="item.imgurl">
              </div>
              <p class="desc" v-html="item.dissname"></p>
              <p class="creator-name" v-html="item.creator.name"></p>
            </li>
          </ul>
        </div>
      </scroll>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import {recommendDiss} from '../../common/js/diss.js';
import {getDissList} from '@/api/diss.js';
import {ERR_OK} from '@/api/config.js';

export default {
  data() {
    return {
      recommendDiss: recommendDiss,
      dissList: []
    };
  },
  created() {
    this._getDissList();
  },
  methods: {
    back() {
      this.$router.back();
    },
    _getDissList() {
      getDissList({
        sortId: 2
      }).then(res => {
        if (res.code === ERR_OK) {
          this.dissList = res.data.list;
        }
      });
    }
  },
  components: {
    Scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .diss
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 100
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
      padding-left 45px
      z-index 40
      no-wrap()
      line-height 40px
      font-size $font-size-large
      color $color-text-white
      background $color-background-red
    .diss-content
      position fixed
      top 50px
      bottom 0
      padding 10px 10px 0
      overflow hidden
      .sub-title
        font-size $font-size-medium-x
        color $color-text
      .disslist-tag
        overflow hidden
        margin 10px -3.3% 10px 0
        .disslist-tag-item
          float left
          margin 0 3.3% 5px 0
          line-height 20px
          width 30%
          height 20px
          text-align center
          font-size $font-size-medium
          color $color-text-ll
          background $color-sub-theme
          border-radius 5px
      .recommend-diss
        display flex
        flex-flow row wrap
        align-content flex-start
        margin-top 10px
        .recommend-diss-item
          flex 0 0 50%
          position relative
          padding-bottom 30px
          .img-wrapper
            position relative
            width 100%
            height 0
            padding-top 100%
            img
              position absolute
              top 0
              left 0
              display block
              width 96%
              margin 0 auto
          .desc
            margin-top 5px
            line-height 18px
            font-size $font-size-small-s
            color $color-text
          .creator-name
            position absolute
            bottom 8px
            line-height 18px
            font-size $font-size-small-s
            color $color-text-grey

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
