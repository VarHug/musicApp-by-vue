<template>
  <transition name="list-fade">
  <div class="playlist" v-show="showFlag" @click="hide">
    <div class="list-wrapper" @click.stop>
      <div class="list-header">
        <h1 class="title">
          <i class="icon" :class="iconMode" @click="changeMode"></i>
          <span class="text">{{modeText}}</span>
          <span class="clear" @click="showConfirm"><i class="icon-delete"></i></span>
        </h1>
      </div>
      <scroll class="list-content" :data="sequenceList" ref="listContent" :refreshDelay="refreshDelay">
        <transition-group name="list" tag="ul" ref="list">
          <li class="item" v-for="(item, index) in sequenceList" :key="item.id" @click="selectItem(item, index)" ref="listItem">
            <i :class="getCurrentIcon(item)"></i>
            <span class="text" :class="getCurrent(item)">{{item.name}}<span class="singername"> - {{item.singer}}</span></span>
            <span class="like">
              <i class="icon-not-favorite"></i>
            </span>
            <span class="delete" @click.stop="deleteOne(item)">
              <i class="icon-dismiss"></i>
            </span>
          </li>
        </transition-group>
      </scroll>
      <div class="list-operate">
        <div class="add" @click.stop="addSong">
          <i class="icon-add"></i>
          <span class="text">添加歌曲到播放列表</span>
        </div>
      </div>
      <div class="list-close" @click="hide">
        <span>关闭</span>
      </div>
    </div>
    <confirm ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="confirmClear"></confirm>
    <add-song ref="addSong"></add-song>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';
import Confirm from '@/base/confirm/confirm';
import {playMode} from '@/common/js/config.js';
import {mapActions} from 'vuex';
import {playerMixin} from '@/common/js/mixin.js';
import AddSong from '@/components/add-song/add-song';

export default {
  mixins: [
    playerMixin
  ],
  data() {
    return {
      showFlag: false,
      refreshDelay: 100
    };
  },
  computed: {
    modeText() {
      if (this.mode === playMode.sequence) {
        return '顺序播放';
      }
      if (this.mode === playMode.loop) {
        return '单曲循环';
      }
      return '随机播放';
    }
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.listContent.refresh();
        this.scrollToCurrent(this.curSong);
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getCurrentIcon(item) {
      return item.id === this.curSong.id ? 'icon-song-play' : '';
    },
    getCurrent(item) {
      return item.id === this.curSong.id ? 'current' : '';
    },
    selectItem(item, index) {
      if (this.mode === playMode.random) {
        index = this.playlist.findIndex((song) => {
          return song.id === item.id;
        });
      }
      this.setCurIndex(index);
      this.setPlayingState(true);
    },
    deleteOne(item) {
      this.deleteSong(item);
      if (!this.playlist.length) {
        this.hide();
      } else {
        this.scrollToCurrent(this.curSong);
      }
    },
    scrollToCurrent(current) {
      const index = this.sequenceList.findIndex((song) => {
        return current.id === song.id;
      });
      console.log(this.$refs.listItem);
      console.log(this.$refs.list.$el.children);
      this.$refs.listContent.scrollToElement(this.$refs.list.$el.children[index], 300);
    },
    showConfirm() {
      this.$refs.confirm.show();
    },
    confirmClear() {
      this.deleteSongList();
      this.hide();
    },
    addSong() {
      this.$refs.addSong.show();
    },
    ...mapActions([
      'deleteSong',
      'deleteSongList'
    ])
  },
  watch: {
    // curSong(newSong, oldSong) {
    //   if (this.showFlag && newSong.id !== oldSong.id) {
    //     this.scrollToCurrent(newSong);
    //   }
    // }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
          .text
            flex: 1
            font-size: $font-size-medium
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          border-1px($color-border)
          &:after
            left 20px
            right 30px
            width inherit
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .icon-song-play
            flex: 0 0 20px
            width: 20px
            color $color-sub-theme
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            .singername
              font-size $font-size-small-s
              color $color-text-grey
            &.current
              color $color-sub-theme
              .singername
                color $color-sub-theme
          .like
            extend-click()
            margin-right: 20px
            font-size: $font-size-small
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
      .list-operate
        width: 160px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border-radius: 100px
          color: $color-text-white-shallow
          background $color-background-red
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background-red
        font-size: $font-size-medium-x
        color: $color-text-white-shallow
</style>
