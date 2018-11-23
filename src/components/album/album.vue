<template>
  <transition name="slide">
    <div class="album">
      <route-header title="专辑" @back="back"></route-header>
      <scroll class="album-list-wrapper" :data="secondList" ref="alWrapper" :pullup="pullup" @scrollToEnd="loadAlbumList">
        <div class="album-list-inner">
          <second-list :list="secondList" @select="selectAlbum" class="album-list"></second-list>
          <loading v-show="secondList.length && hasMore"></loading>
          <div class="no-result" v-show="!hasMore">-没有更多专辑啦-</div>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import RouteHeader from '@/base/route-header/route-header';
import Scroll from '@/base/scroll/scroll';
import SecondList from '@/base/second-list/second-list';
import Loading from '@/base/loading/loading';
import {getAlbumList} from '@/api/album.js';
import {ERR_OK} from '@/api/config.js';
import {playlistMixin} from '../../common/js/mixin.js';
import { mapMutations } from 'vuex';

export default {
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      albumList: [],
      secondList: [],
      hasMore: true,
      sin: 0, // 起始index
      num: 19, // 查询数量(此处后端API可能有些问题)
      pullup: true
    };
  },
  created() {
    this._getAlbumList().then(albumList => {
      this._formatAlbumList(albumList);
    });
  },
  methods: {
    ...mapMutations({
      setAlbum: 'SET_ALBUM'
    }),
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.alWrapper.$el.style.bottom = bottom;
      this.$refs.alWrapper.refresh();
    },
    back() {
      this.$router.back();
    },
    selectAlbum(album) {
      this.$router.push({
        path: `/album/${album.album_mid}`
      });
      this.setAlbum(album);
    },
    loadAlbumList() {
      if (this.hasMore) {
        this.sin += this.num + 1;
        this._getAlbumList().then(albumList => {
          this._formatAlbumList(albumList);
        });
      }
    },
    getAlbumImg(albumMid) {
      return `http://y.gtimg.cn/music/photo_new/T002R300x300M000${albumMid}.jpg?max_age=2592000`;
    },
    getAlbumSinger(singers) {
        if (!singers) {
          return '';
        }
        let singerName = [];
        singers.forEach(item => {
          singerName.push(item.singer_name);
        });
        return singerName.join('/');
    },
    _getAlbumList() {
      return new Promise(resolve => {
        let albumData = {};
        albumData.areaId = -1; // 全部
        albumData.sin = this.sin;
        albumData.num = this.num;
        getAlbumList(albumData).then(res => {
          if (res.code === ERR_OK) {
            this.albumList = res.albumlib.data.list;
            this._checkMore(res.albumlib.data);
            resolve(this.albumList);
          }
        });
      });
    },
    _formatAlbumList(albumList) {
      albumList.forEach(element => {
        let album = {};
        album.album_mid = element.album_mid;
        album.imgurl = this.getAlbumImg(element.album_mid);
        album.name = element.album_name;
        album.creator = this.getAlbumSinger(element.singers);
        this.secondList.push(album);
      });
    },
    _checkMore(data) {
      if (data.total < this.sin + this.num + 1) {
        this.hasMore = false;
      }
    }
  },
  components: {
    RouteHeader,
    Scroll,
    SecondList,
    Loading
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .album
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 100
    background $color-background
    .album-list-wrapper
      position fixed
      top 40px
      right 0
      bottom 0
      left 0
      overflow hidden
      .album-list-inner
        .album-list
          padding 10px 10px 0
        .no-result
          width 100%
          height 40px
          line-height 40px
          text-align center
          font-size $font-size-small-s
          color $color-text-grey

  transition-slide()

</style>
