<template>
  <transition name="slide">
  <div class="search">
    <div class="search-head">
      <div class="back" @click="back">
        <i class="icon-arrow-left"></i>
      </div>
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange"></search-box>
      </div>
    </div>
    <div class="shortcut-wrapper" v-show="!query">
      <div class="shortcut">
        <div class="hot-key">
          <h1 class="title">热门搜索</h1>
          <ul>
            <li class="item" v-for="(item, index) in hotKey" :key="index" @click="addQuery(item.k)">
              <span>{{item.k}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="search-result" v-show="query">
      <suggest :query="query" @listScroll="blurInput"></suggest>
    </div>
    <router-view></router-view>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box';
import {getHotKey} from '@/api/search.js';
import {ERR_OK} from '@/api/config.js';
import Suggest from '@/components/suggest/suggest';

export default {
  data() {
    return {
      hotKey: [],
      query: ''
    };
  },
  created() {
    this._getHotKey();
  },
  methods: {
    back() {
      this.$router.back();
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query);
    },
    onQueryChange(query) {
      this.query = query;
    },
    blurInput() {
      this.$refs.searchBox.blur();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    }
  },
  components: {
    SearchBox,
    Suggest
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 100
    background $color-background
    .search-head
      display flex
      padding-top 10px
      background $color-background-red
      .back
        flex 0 0 50px
        width 50px
        z-index 50
        text-align center
        .icon-arrow-left
          display block
          padding 10px
          font-size $font-size-large
          color $color-text-white
      .search-box-wrapper
        flex 1
    .shortcut-wrapper
      position fixed
      top 60px
      bottom 0
      width 100%
      .shortcut
        height 100%
        overflow hidden
        .hot-key
          margin 0 20px 0 20px
          .title
            margin-bottom 20px
            font-size $font-size-medium
            color $color-text-grey
          .item
            display inline-block
            padding 5px 10px
            margin 0 20px 10px 0
            border-radius 10px
            border 1px solid $color-border
            font-size $font-size-medium
    .search-result
      position: fixed
      width: 100%
      top: 60px
      bottom: 0

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
