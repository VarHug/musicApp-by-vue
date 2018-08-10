<template>
  <scroll class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
          ref="suggest"
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for="(item, index) in result" :key="index" @click="selectItem(item)">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="loadingShow" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!hasMore && !result.length">
      <no-result :text="query"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import {search} from '@/api/search.js';
import {ERR_OK} from '@/api/config.js';
import {createSong, isValidMusic, processSongsUrl} from '@/common/js/Song.js';
import Singer from '@/common/js/Singer.js';
import Scroll from '@/base/scroll/scroll';
import Loading from '@/base/loading/loading';
import NoResult from '@/base/no-result/no-result';
import {mapMutations, mapActions} from 'vuex';

const TYPE_SINGER = 'singer';
const perpage = 20;

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    };
  },
  computed: {
    loadingShow() {
      return this.hasMore && this.result.length >= perpage;
    }
  },
  methods: {
    search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then(result => {
            this.result = result;
          });
          this._checkMore(res.data);
        }
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then(res => {
        this._genResult(res.data).then(result => {
            this.result = this.result.concat(result);
          });
          this._checkMore(res.data);
      });
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-singer';
      } else {
        return 'icon-songlist';
      }
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    selectItem(item) {
      console.log(item);
      if (item.type === TYPE_SINGER) {
        const singer = new Singer(item.singermid, item.singername);
        this.$router.push({
          path: `/search/${singer.mid}`
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
    },
    listScroll() {
      this.$emit('listScroll');
    },
    // 处理返回数据
    _genResult(data) {
      let ret = [];
      if (data.zhida && data.zhida.singerid && this.page === 1) {
        ret.push({...data.zhida, ...{type: TYPE_SINGER}});
      }
      return processSongsUrl(this._normallizeSongsList(data.song.list)).then(songs => {
        ret = ret.concat(songs);
        return ret;
      });
    },
    _normallizeSongsList(list) {
      let res = [];
      list.forEach(musicData => {
        if (isValidMusic(musicData)) {
          res.push(createSong(musicData));
        }
      });
      return res;
    },
    // 是否有多余数据还能查询
    _checkMore(data) {
      const song = data.song;
      if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage > song.totalnum)) {
        this.hasMore = false;
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query() {
      this.search();
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
      .name
        flex: 1
        font-size: $font-size-medium
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
