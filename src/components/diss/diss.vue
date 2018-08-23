<template>
  <transition name="slide">
    <div class="diss" ref="diss">
      <div class="back" @click="back">
        <i class="icon-arrow-left"></i>
      </div>
      <h1 class="title">歌单</h1>
      <scroll class="diss-content" :data="dissList" ref="dissContent">
        <div>
          <h2 class="sub-title">推荐分类</h2>
          <div class="mroe" @click="showSelect">
            <i class="icon-arrow-right"></i>
          </div>
          <ul class="disslist-tag">
            <li class="disslist-tag-item" v-for="(item, index) in recommendDiss" :key="index">{{item.name}}</li>
          </ul>
          <h2 class="sub-title">编辑推荐</h2>
          <diss-list :dissList="dissList" @select="selectDiss" class="diss-list"></diss-list>
        </div>
      </scroll>
      <diss-select ref="dissSelect"></diss-select>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import {recommendDiss} from '@/common/js/diss.js';
import {getDissList} from '@/api/diss.js';
import {ERR_OK} from '@/api/config.js';
import {mapMutations} from 'vuex';
import {playlistMixin} from '../../common/js/mixin.js';
import DissList from '@/components/diss-list/diss-list';
import DissSelect from '@/components/diss-select/diss-select';

export default {
  mixins: [
    playlistMixin
  ],
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
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.dissContent.$el.style.bottom = bottom;
      this.$refs.dissContent.refresh();
    },
    back() {
      this.$router.back();
    },
    showSelect() {
      this.$refs.dissSelect.show();
    },
    selectDiss(diss) {
      this.$router.push({
        path: `/diss/${diss.dissid}`
      });
      this.setDiss(diss);
    },
    _getDissList() {
      getDissList({
        sortId: 2
      }).then(res => {
        if (res.code === ERR_OK) {
          this.dissList = res.data.list;
        }
      });
    },
    ...mapMutations({
      setDiss: 'SET_DISS'
    })
  },
  components: {
    Scroll,
    DissList,
    DissSelect
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
      padding 0 10px
      overflow hidden
      .sub-title
        font-size $font-size-medium-x
        color $color-text
      .mroe
        position absolute
        top 0
        right 0
        line-height 16px
        width 16px
        height 16px
        text-align center
        border 1px solid $color-text
        border-radius 50%
        .icon-arrow-right
          font-size $font-size-small-s
      .disslist-tag
        overflow hidden
        margin 15px -3.3% 15px 0
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
      .diss-list
        margin-top 10px

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
