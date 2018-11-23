<template>
  <transition name="slide">
    <div class="diss" ref="diss">
      <route-header title="歌单" @back="back"></route-header>
      <scroll class="diss-wrapper" :data="dissList" ref="dissWrapper" :pullup="pullup" @scrollToEnd="loadDissList">
        <div>
          <div class="hot-diss" @click="showHotDiss">
            <div class="bg-image">
              <img :src="hotDiss && hotDiss.imgurl">
            </div>
            <div class="filter"></div>
            <div class="hot-diss-content">
              <div class="hot-diss-avatar">
                <img width="100%" height="100%" :src="hotDiss && hotDiss.imgurl" >
              </div>
              <div class="hot-diss-desc">
                <div class="hot-diss-title">
                  <i class="iblock icon-exclusive"></i>
                  <span class="iblock">热门歌单<i class="icon-arrow-right"></i></span>
                </div>
                <div class="diss-name">{{hotDiss.dissname}}</div>
                <div class="diss-introduction">{{hotDiss.introduction}}</div>
              </div>
            </div>
          </div>
          <div class="diss-content">
            <h2 class="sub-title" @click="showSelect" v-html="categoryName"></h2>
            <i class="icon-arrow-right"></i>
            <second-list :list="secondList" @select="selectDiss" class="diss-list"></second-list>
            <loading v-show="dissList.length && hasMore"></loading>
            <div class="no-result" v-show="!hasMore">-没有更多歌单啦-</div>
          </div>
        </div>
        <loading v-show="!dissList.length"></loading>
      </scroll>
      <diss-select ref="dissSelect" @selectAll="selectAll" @selectCategory="selectCategory"></diss-select>
      <diss-hot ref="dissHot"></diss-hot>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import RouteHeader from '@/base/route-header/route-header';
import SecondList from '@/base/second-list/second-list';
import {getDissList} from '@/api/diss.js';
import {ERR_OK} from '@/api/config.js';
import {dissMixin, playlistMixin} from '../../common/js/mixin.js';
import DissSelect from '@/components/diss-select/diss-select';
import DissHot from '@/components/diss-hot/diss-hot';
import {DEFAULT_CATEGORY_ID, SORT_ID} from '@/common/js/config.js';

const DEFAULT_CATEGORY_NAME = '全部歌单';

export default {
  mixins: [
    dissMixin,
    playlistMixin
  ],
  data() {
    return {
      categoryName: DEFAULT_CATEGORY_NAME,
      sortId: SORT_ID.new,
      dissList: [],
      hotDiss: '',
      secondList: []
    };
  },
  created() {
    this._getHotDiss();
    this._getDissList().then(dissList => {
      this._formatSecondList(dissList);
    });
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.dissWrapper.$el.style.bottom = bottom;
      this.$refs.dissWrapper.refresh();
    },
    back() {
      this.$router.back();
    },
    showHotDiss() {
      this.$refs.dissHot.show();
    },
    showSelect() {
      this.$refs.dissSelect.show();
    },
    selectAll() {
      this._initDissList();
      this.categoryName = DEFAULT_CATEGORY_NAME;
      this.categoryId = DEFAULT_CATEGORY_ID;
      this._getDissList().then(dissList => {
        this._formatSecondList(dissList);
      });
    },
    selectCategory(category) {
      this._initDissList();
      this.categoryName = category.categoryName;
      this.categoryId = category.categoryId;
      this._getDissList().then(dissList => {
        this._formatSecondList(dissList);
      });
    },
    loadDissList() {
      if (this.hasMore) {
        this.sin += 30;
        this.ein += 30;
        this._getDissList().then(dissList => {
          this._formatSecondList(dissList);
        });
      }
    },
    _initDissList() {
      this.dissList = [];
      this.secondList = [];
      this.sin = 0;
      this.ein = 29;
      this.categoryId = DEFAULT_CATEGORY_ID;
      this.categoryName = DEFAULT_CATEGORY_NAME;
    },
    _getHotDiss() {
      getDissList({
        sin: 0,
        ein: 1,
        sortId: 5
      }).then(res => {
        if (res.code === ERR_OK) {
          this.hotDiss = res.data.list[0];
        }
      });
    },
    _formatSecondList(dissList) {
      dissList.forEach(element => {
        let diss = {};
        diss.imgurl = element.imgurl;
        diss.name = element.dissname;
        diss.creator = element.creator.name;
        this.secondList.push(diss);
      });
    }
  },
  components: {
    Scroll,
    SecondList,
    DissSelect,
    Loading,
    DissHot,
    RouteHeader
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
    .diss-wrapper
      position fixed
      top 40px
      right 0
      bottom 0
      left 0
      overflow hidden
      .hot-diss
        position relative
        width 100%
        height 125px
        overflow hidden
        .bg-image
          position absolute
          top 0
          left 0
          width 100%
          height 100%
          overflow hidden
        .filter
          position absolute
          top 0
          left 0
          width 100%
          height 100%
          background rgba(7,17,27,0.2)
        .hot-diss-content
          position relative
          display flex
          padding 10px
          .hot-diss-avatar
            flex 0 0 100px
            width 100px
            height 100px
          .hot-diss-desc
            flex 1
            margin-left 10px
            color $color-text-white
            .hot-diss-title
              margin-bottom 10px
              height 30px
              line-height 30px
              font-size $font-size-medium-x
              .iblock
                display inline-block
                vertical-align middle
              .icon-program
                font-size $font-size-large-x
              .icon-arrow-right
                margin-left 5px
                font-size $font-size-medium
                color $color-text-l
            .diss-name
              font-size $font-size-medium
            .diss-introduction
              font-size $font-size-small
              color $color-text-l
      .diss-content
        position relative
        padding 10px 10px 0
        .sub-title
          width 90px
          height 25px
          line-height 25px
          text-align center
          font-size $font-size-medium
          color $color-text
          border 1px solid $color-border
          border-radius 15px
        .icon-arrow-right
          position absolute
          top 18px
          left 85px
          font-size $font-size-small-s
        .diss-list
          margin-top 10px
        .no-result
          width 100%
          height 40px
          line-height 40px
          text-align center
          font-size $font-size-small-s
          color $color-text-grey

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
