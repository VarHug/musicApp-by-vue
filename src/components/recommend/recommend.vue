<template>
  <div class="recommend">
    <div class="recommend-content">
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
      <div class="recommend-list">
        <h1 class="list-title">热门歌单推荐</h1>
        <ul>

        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">

import Slider from '@/base/slider/slider';
import {getRecommend} from '@/api/recommend.js';
import {ERR_OK} from '@/api/config.js';

export default {
  data() {
    return {
      recommends: []
    };
  },
  created() {
    this._getRecommend();
  },
  methods: {
    _getRecommend() {
      getRecommend().then(res => {
        if (res.code === ERR_OK) {
          this.recommends = res.data.slider;
        }
      });
    }
  },
  components: {
    Slider
  }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 104px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width 100%
        height 0
        padding-top 40%
        overflow: hidden
        .slider-bg
          position absolute
          top 0
          left 0
          width 100%
          height 70%
          background-color $color-background-head
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
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
</style>
