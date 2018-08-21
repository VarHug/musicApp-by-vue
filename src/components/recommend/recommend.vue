<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="dissList" :pullup="pullup" @scrollToEnd="loadDissList" ref="recommendContent">
      <div>
        <div v-if="recommends.length" class="slider-wrapper">
          <div class="slider-bg"></div>
          <div class="slider-content">
            <slider>
              <div v-for="(item, index) in recommends" :key="index">
                <a :href="item.linkUrl" class="img-wrapper">
                  <div class="img-wrapper-bgc"></div>
                  <img :src="item.picUrl" class="slider-img">
                </a>
              </div>
            </slider>
          </div>
        </div>
        <div class="recommend-list" ref="recommendList">
          <router-link tag="h1" class="list-title" to="/diss">
            热门歌单推荐
            <i class="icon icon-arrow-right"></i>
          </router-link>
          <ul v-if="dissList.length" class="list">
            <li v-for="(item, index) in dissList" :key="index" class="item" ref="item" @click="selectDiss(item)">
              <div class="img-wrapper">
                <img v-lazy="item.imgurl">
              </div>
              <p class="desc" v-html="item.dissname"></p>
            </li>
          </ul>
          <loading v-show="dissList.length"></loading>
        </div>
      </div>
      <loading v-show="!dissList.length"></loading>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">

import Scroll from '@/base/scroll/scroll';
import Slider from '@/base/slider/slider';
import Loading from '@/base/loading/loading';
import {getRecommend, getDissList} from '@/api/recommend.js';
import {ERR_OK} from '@/api/config.js';
import {playlistMixin} from '../../common/js/mixin.js';
import {mapMutations} from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      pullup: true,
      recommends: [],
      // 歌单列表
      dissList: [],
      sin: 0,
      ein: 8
    };
  },
  created() {
    this._getRecommend();
    this._getDissList();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.recommendContent.refresh();
    },
    loadDissList() {
      this.sin += 9;
      this.ein += 9;
      this._getDissList();
    },
    selectDiss(diss) {
      this.$router.push({
        path: `/recommend/${diss.dissid}`
      });
      this.setDiss(diss);
    },
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    },
    _getDissList() {
      getDissList({
        sin: this.sin,
        ein: this.ein
      }).then(res => {
        if (res.code === ERR_OK) {
          this.dissList = this.dissList.concat(res.data.list);
        }
      });
    },
    ...mapMutations({
      setDiss: 'SET_DISS'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position fixed
    width 100%
    top 104px
    bottom 0
    .recommend-content
      height 100%
      overflow hidden
      .slider-wrapper
        position relative
        width 100%
        height 0
        padding-top 40%
        overflow hidden
        .slider-bg
          position absolute
          top 0
          left 0
          width 100%
          height 70%
          background-color $color-background-red
        .slider-content
          position absolute
          top 0
          left 0
          width 100%
          height 100%
        .slider-img
          width 95%
          margin 0 auto
          border-radius 5px
      .recommend-list
        width 96%
        margin 0 auto
        .list-title
          margin-left 0.6%
          height 40px
          line-height 40px
          font-size $font-size-medium
          font-weight bold
          color $color-text
          .icon
            font-size $font-size-small-s
            color $color-text-white-shallow
        .list
          .item
            display inline-block
            width 33.3%
            font-size 0
            vertical-align top
            box-sizing border-box
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
                height 100%
                margin 0 auto
                border-radius 5px
            .desc
              margin-top 5px
              line-height 18px
              font-size $font-size-small-s
              color $color-text
</style>
