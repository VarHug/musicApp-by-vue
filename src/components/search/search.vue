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
    <div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
      <scroll class="shortcut" ref="shortcut" :data="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li class="item" v-for="(item, index) in hotKey" :key="index" @click="addQuery(item.k)">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear" @click.stop="showConfirm">
                <i class="icon-delete"></i>
              </span>
            </h1>
            <search-list :searches="searchHistory" @select="addQuery" @delete="deleteSearchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest :query="query" @listScroll="blurInput" @select="saveSearch" ref="suggest"></suggest>
    </div>
    <confirm ref="confirm" text="是否清空所有历史" confirmBtnText="清空" @confirm="clearSearchHistory"></confirm>
    <router-view></router-view>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import SearchBox from '@/base/search-box/search-box';
import SearchList from '@/base/search-list/search-list';
import Confirm from '@/base/confirm/confirm';
import Scroll from '@/base/scroll/scroll';
import {getHotKey} from '@/api/search.js';
import {ERR_OK} from '@/api/config.js';
import Suggest from '@/components/suggest/suggest';
import {mapActions, mapGetters} from 'vuex';
import {playlistMixin} from '@/common/js/mixin.js';

export default {
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      hotKey: [],
      query: ''
    };
  },
  computed: {
    shortcut() {
      return this.hotKey.concat(this.searchHistory);
    },
    ...mapGetters([
      'searchHistory'
    ])
  },
  created() {
    this._getHotKey();
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.shortcutWrapper.style.bottom = bottom;
      this.$refs.shortcut.refresh();
      this.$refs.searchResult.style.bottom = bottom;
      this.$refs.suggest.refresh();
    },
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
    saveSearch() {
      this.saveSearchHistory(this.query);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    _getHotKey() {
      getHotKey().then(res => {
        if (res.code === ERR_OK) {
          this.hotKey = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcut.refresh();
        }, 20);
      }
    }
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

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
        .search-history
          position relative
          margin 0 20px
          .title
            display flex
            align-items center
            height 40px
            font-size $font-size-medium
            color $color-text-grey
            .text
              flex 1
            .clear
              extend-click()
              .icon-delete
                font-size $font-size-medium-x
                color $color-text-grey
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
