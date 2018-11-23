<template>
  <div class="recommend" ref="recommend">
    <scroll class="recommend-content" :data="dissList" ref="recommendContent">
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
          <router-link v-if="dissList.length" tag="h1" class="list-title" to="/diss">
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
          <router-link v-if="radioListCopy.length" tag="h1" class="list-title" to="/radio">
            热门电台推荐
            <i class="icon icon-arrow-right"></i>
          </router-link>
          <ul v-if="radioListCopy.length" class="list">
            <li v-for="(item, index) in radioListCopy" :key="index" class="item" ref="item" @click="selectRadio(item)">
              <div class="img-wrapper">
                <img v-lazy="item.radioImg">
              </div>
              <p class="desc" v-html="item.radioName"></p>
            </li>
          </ul>
          <router-link v-if="albumList.length" tag="h1" class="list-title" to="/album">
            最新专辑推荐
            <i class="icon icon-arrow-right"></i>
          </router-link>
          <ul v-if="albumList.length" class="list">
            <li v-for="(item, index) in albumList" :key="index" class="item" ref="item" @click="selectAlbum(item)">
              <div class="img-wrapper">
                <img v-lazy="getAlbumImg(item.album_mid)">
              </div>
              <p class="desc album_name" v-html="item.album_name"></p>
              <p class="singer-name" v-html="getAlbumSinger(item.singers)"></p>
            </li>
          </ul>
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
import {getRadioList} from '@/api/radio.js';
import {getAlbumList} from '@/api/album.js';
import {ERR_OK} from '@/api/config.js';
import {playlistMixin, radioMixin} from '../../common/js/mixin.js';
import {mapGetters, mapMutations, mapActions} from 'vuex';
import queue from '@/common/js/asyncTask.js';

export default {
  mixins: [
    playlistMixin,
    radioMixin
  ],
  data() {
    return {
      recommends: [],
      scrollData: 0, // 传给scroll的data数据
      // 歌单列表
      dissList: [],
      sin: 0,
      ein: 5,
      // 电台列表
      radioListCopy: [],
      songsList: [],
      // 专辑列表
      albumList: []
    };
  },
  computed: {
    ...mapGetters([
      'radioList'
    ])
  },
  created() {
    queue([
      this._getRecommend,
      this._getDissList,
      this._getRadioList,
      this._getAlbumList
    ]);
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.recommend.style.bottom = bottom;
      this.$refs.recommendContent.refresh();
    },
    selectDiss(diss) {
      this.$router.push({
        // path: `/recommend/${diss.dissid}`
        name: 'dissDetail',
        params: {
          id: diss.dissid
        }
      });
      this.setDiss(diss);
    },
    selectAlbum(album) {
      this.$router.push({
        name: 'albumDetail',
        params: {
          id: album.album_mid
        }
      });
      this.setAlbum(album);
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
    _getRecommend() {
      return new Promise(resolve => {
        getRecommend().then(res => {
          if (res.code === ERR_OK) {
            this.recommends = res.data.slider;
            this.scrollData++;
            resolve();
          }
        });
      });
    },
    _getDissList() {
      return new Promise(resolve => {
        getDissList({
          sin: this.sin,
          ein: this.ein
        }).then(res => {
          if (res.code === ERR_OK) {
            this.dissList = this.dissList.concat(res.data.list);
            this.scrollData++;
            resolve();
          }
        });
      });
    },
    _getRadioList() {
      return new Promise(resolve => {
        if (!this.radioList || !this.radioList.length) {
          getRadioList().then(res => {
            if (res.code === ERR_OK) {
              let radioList = res.data.data.groupList;
              radioList[0].radioList.shift(); // 去除'个性电台'这个list
              this.setRadioList(radioList);
              this.radioListCopy = this.radioList[0].radioList.slice(0, 6);
              this.scrollData++;
              resolve();
            }
          });
        } else {
          this.radioListCopy = this.radioList[0].radioList.slice(0, 6);
          this.scrollData++;
          resolve();
        }
      });
    },
    _getAlbumList() {
      return new Promise(resolve => {
        let albumData = {};
        albumData.areaId = -1; // 全部
        albumData.sin = 0;
        albumData.num = 5;
        getAlbumList(albumData).then(res => {
          if (res.code === ERR_OK) {
            this.albumList = res.albumlib.data.list;
            this.scrollData++;
            resolve();
          }
        });
      });
    },
    ...mapMutations({
      setDiss: 'SET_DISS',
      setRadioList: 'SET_RADIO_LIST',
      setAlbum: 'SET_ALBUM'
    }),
    ...mapActions([
      'selectPlay'
    ])
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
  @import "~common/stylus/mixin"

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
          margin-right -3.3%
          .item
            display inline-block
            width 30%
            margin-right 3.3%
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
                width 100%
                height 100%
                margin 0 auto
                border-radius 5px
            .desc, .singer-name
              margin-top 5px
              line-height 18px
              font-size $font-size-small-s
              color $color-text
            .album_name
              no-wrap()
</style>
