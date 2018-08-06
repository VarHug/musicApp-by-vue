<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="singerList"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList, getSingerListNew} from '@/api/singer.js';
import {ERR_OK} from '@/api/config.js';
import Singer from '@/common/js/Singer.js';
import ListView from '@/base/listview/listview';
import {mapMutations} from 'vuex';
import {playlistMixin} from '../../common/js/mixin.js';

const HOT_NAME = '热门';
const HOT_NUM = 10;

export default {
  mixins: [
    playlistMixin
  ],
  data() {
    return {
      singers: [],
      singersNew: []
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    selectSinger(singer) {
      this.$router.push({
        path: `/singer/${singer.mid}`
      });
      this.setSinger(singer);
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '';
      this.$refs.singer.style.bottom = bottom;
      this.$refs.singerList.refresh();
    },
    _getSingerList() {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normallizeSingerList(res.data.list);
        }
      });
    },
    _getSingerListNew() {
      getSingerListNew().then(res => {
        if (res.code === ERR_OK && res.singerList.code === ERR_OK) {
          this.singers = res.singerList.data.singerlist;
        }
      });
    },
    _normallizeSingerList(list) {
      let map = {
        hot: {
          title: HOT_NAME,
          items: []
        }
      };
      list.forEach((item, index) => {
        if (index < HOT_NUM) {
          map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name));
        }
        const key = item.Findex; // 姓名首字母
        if (!map[key]) {
          map[key] = {
            title: key,
            items: []
          };
        }
        map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name));
      });
      // 将无序对象转换为有序列表
      let hot = [];
      let ret = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(ret);
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

.singer
  position fixed
  top 104px
  bottom 0
  width 100%

</style>
