<template>
  <div class="player" v-show="playlist.length > 0">
    <transition name="normal"
                @enter="enter"
                @after-enter="afterEnter"
                @leave="leave"
                @after-leave="afterLeave"
    >
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" :src="curSong.image">
      </div>
      <div class="top">
        <div class="back" @click="hideNormalPlayer">
          <i class="icon-arrow-left"></i>
        </div>
        <h1 class="title" v-html="curSong.name"></h1>
        <h2 class="subtitle" v-html="curSong.singer"></h2>
      </div>
      <div class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
      >
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" ref="cd">
              <img class="image" :src="curSong.image" :class="cdCls" ref="image">
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{playingLyric}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="lyricList" :data="curLyric && curLyric.lines">
          <div class="lyric-wrapper">
            <div class="currentLyric" v-if="curLyric">
              <p ref="lyricLine" class="text" v-for="(line, index) in curLyric.lines" :key="index" :class="{'current': curLineNum === index}">{{line.txt}}</p>
            </div>
            <div class="pure-music" v-show="isPureMusic">
              <p>{{pureMusicLyric}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active': curShow === 'cd'}"></span>
          <span class="dot" :class="{'active': curShow === 'lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{format(curTime)}}</span>
          <div class="progress-bar-wrapper">
            <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
          </div>
          <span class="time time-r">{{format(curSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" @click="changeMode">
            <i :class="iconMode"></i>
          </div>
          <div class="icon i-left" :class="disableCls">
            <i class="icon-song-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="disableCls">
            <i :class="playIcon" @click="togglePlaying"></i>
          </div>
          <div class="icon i-right" :class="disableCls">
            <i class="icon-song-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-love"></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
    <transition name="mini">
    <div class="mini-player border-1px" v-show="!fullScreen" @click="showNormalPlayer">
      <div class="avatar">
        <img width="40" height="40" :src="curSong.image">
      </div>
      <div class="text">
        <h2 class="name" v-html="curSong.name"></h2>
        <p class="desc" v-html="curSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :radius="radius" :percent="percent">
          <i class="icon icon-mini" :class="playIcon" @click.stop="togglePlaying"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon icon-playlist"></i>
      </div>
    </div>
    </transition>
    <playlist ref="playlist"></playlist>
    <audio ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="end"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import {mapGetters, mapMutations, mapActions} from 'vuex';
import animations from 'create-keyframe-animation';
import {prefix} from '@/common/js/dom.js';
import ProgressBar from '@/base/progress-bar/progress-bar';
import ProgressCircle from '@/base/progress-circle/progress-circle';
import Scroll from '@/base/scroll/scroll';
import {playMode} from '@/common/js/config.js';
import Lyric from 'lyric-parser';
import Playlist from '@/components/playlist/playlist';
import {playerMixin} from '@/common/js/mixin.js';

const transform = prefix('transform');
const transitionDuration = prefix('transitionDuration');
const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g; // [00:00:00]

export default {
  mixins: [
    playerMixin
  ],
  data() {
    return {
      songReady: false,
      curTime: 0,
      radius: 30,
      curLyric: null,
      curLineNum: 0, // 当前歌词所在的行,
      curShow: 'cd', // cd页面还是歌词页面
      playingLyric: '',
      isPureMusic: false, // 纯音乐
      pureMusicLyric: ''
    };
  },
  computed: {
    cdCls() {
      return this.playing ? 'play' : '';
    },
    playIcon() {
      return this.playing ? 'icon-song-pause' : 'icon-song-play';
    },
    disableCls() {
      return this.songReady ? '' : 'disable';
    },
    percent() {
      return this.curTime / this.curSong.duration;
    },
    ...mapGetters([
      'fullScreen',
      'playing',
      'curIndex'
    ])
  },
  created() {
    this.touch = {};
  },
  methods: {
    // 暂停、播放
    togglePlaying() {
      if (!this.songReady) {
        return;
      }
      this.setPlayingState(!this.playing);
      if (this.curLyric) {
        this.curLyric.togglePlay();
      }
    },
    hideNormalPlayer() {
      this.setFullScreen(false);
    },
    showNormalPlayer() {
      this.setFullScreen(true);
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale();

      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      };

      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });

      animations.runAnimation(this.$refs.cd, 'move', done);
    },
    afterEnter() {
      animations.unregisterAnimation('move');
      this.$refs.cd.style.animation = '';
    },
    leave(el, done) {
      this.$refs.cd.style.transition = 'all 0.4s';
      const {x, y, scale} = this._getPosAndScale();
      this.$refs.cd.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      this.$refs.cd.addEventListener('transitionend', done);
    },
    afterLeave() {
      this.$refs.cd.style.transition = '';
      this.$refs.cd.style[transform] = '';
    },
    // 计算内层容器的旋转角度并同步到父容器
    syncWrapperTransform(wrapper, inner) {
      if (!this.$refs[wrapper]) {
        return;
      }
      let imageWrapper = this.$refs[wrapper];
      let image = this.$refs[inner];
      let wrapperTransform = getComputedStyle(imageWrapper)[transform];
      let imageTransform = getComputedStyle(image)[transform];
      imageWrapper.style[transform] = wrapperTransform === 'none' ? imageTransform : imageTransform.concat(' ', wrapperTransform);
    },
    end() {
      if (this.mode === playMode.loop) {
        this.loop();
      } else {
        this.next();
      }
    },
    loop() {
      this.$refs.audio.currentTime = 0;
      this.$refs.audio.play();
      if (this.curLyric) {
        this.curLyric.seek(0);
      }
    },
    prev() {
      if (!this.songReady) {
        return;
      }
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.curIndex - 1;
        if (index < 0) {
          index = this.playlist.length - 1;
        }
        this.setCurIndex(index);
        // 暂停时切换
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    next() {
      if (!this.songReady) {
        return;
      }
      // 播放列表只有一首歌
      if (this.playlist.length === 1) {
        this.loop();
      } else {
        let index = this.curIndex + 1;
        if (index === this.playlist.length) {
          index = 0;
        }
        this.setCurIndex(index);
        // 暂停时切换
        if (!this.playing) {
          this.togglePlaying();
        }
      }
      this.songReady = false;
    },
    ready() {
      clearTimeout(this.timer);
      // 监听 playing 这个事件可以确保慢网速或者快速切换歌曲导致的 DOM Exception
      this.songReady = true;
      this.canLyricPlay = true;
      this.savePlayHistory(this.curSong);
      // 如果歌曲的播放晚于歌词的出现，播放的时候需要同步歌词
      if (this.curLyric && !this.isPureMusic) {
        this.curLyric.seek(this.curTime * 1000);
      }
    },
    error() {
      this.songReady = true;
    },
    updateTime(event) {
      this.curTime = event.target.currentTime;
    },
    onProgressBarChange(percent) {
      const time = this.curSong.duration * percent;
      this.$refs.audio.currentTime = time;
      if (!this.playing) {
        this.togglePlaying();
      }
      if (this.curLyric) {
        this.curLyric.seek(time * 1000);
      }
    },
    // 格式化时间
    format(interval) {
      interval = interval | 0;
      const minute = interval / 60 | 0;
      const second = this._pad(interval % 60);
      return `${minute}:${second}`;
    },
    getLyric() {
      this.curSong.getLyric().then(lyric => {
        if (this.curSong.lyric !== lyric) {
          return;
        }
        this.curLyric = new Lyric(lyric, this.handleLyric);
        this.isPureMusic = !this.curLyric.lines.length;
        if (this.isPureMusic) {
          this.pureMusicLyric = this.curLyric.lrc.replace(timeExp, '').trim();
          this.playingLyric = this.pureMusicLyric;
        } else {
          if (this.playing && this.canLyricPlay) {
            this.curLyric.seek(this.curTime * 1000);
          }
        }
      }).catch(() => {
        this.curLyric = null;
        this.playingLyric = '';
        this.curLineNum = 0;
      });
    },
    handleLyric({lineNum, txt}) {
      if (!this.$refs.lyricLine) {
        return;
      }
      this.curLineNum = lineNum;
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5];
        this.$refs.lyricList.scrollToElement(lineEl, 1000);
      } else {
        this.$refs.lyricList.scrollToElement(0, 0, 1000);
      }
      this.playingLyric = txt;
    },
    middleTouchStart(e) {
      this.touch.initiated = true;
      const touch = e.touches[0];
      this.touch.startX = touch.pageX;
      this.touch.startY = touch.pageY;
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const touch = e.touches[0];
      const deltaX = touch.pageX - this.touch.startX;
      const deltaY = touch.pageY - this.touch.startY;
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return; // 歌词纵向滚动
      }
      const left = this.curShow === 'cd' ? 0 : -window.innerWidth;
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth);
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.lyricList.$el.style[transitionDuration] = 0;
      this.$refs.middleL.style.opacity = 1 - this.touch.percent;
      this.$refs.middleL.style[transitionDuration] = 0;
    },
    middleTouchEnd() {
      let offsetWidth = '';
      let opacity = '';
      if (this.curShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth;
          opacity = 0;
          this.curShow = 'lyric';
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0;
          opacity = 1;
          this.curShow = 'cd';
        } else {
          offsetWidth = -window.innerWidth;
          opacity = 0;
        }
      }
      const time = 300;
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`;
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
      this.$refs.middleL.style.opacity = opacity;
      this.$refs.middleL.style[transitionDuration] = `${time}ms`;
    },
    showPlaylist() {
      this.$refs.playlist.show();
    },
    /**
     * // 用0补位
     * @param {Number} num // 补位数字
     * @param {Number} n // 补几位
     */
    _pad(num, n = 2) {
      let len = num.toString().length;
      while (len < n) {
        num = '0' + num;
        len++;
      }
      return num;
    },
    // 获取mini-player图片位置和缩放尺寸
    _getPosAndScale() {
      const targetWidth = 40; // mini-player > img
      const paddingLeft = 40; // mini-player > img.paddingLeft + 1 / 2 img.width
      const paddingBottom = 30; // mini-player > img.paddingBottom + 1 / 2 img.width
      const width = window.innerWidth * 0.8; // cd-wrapper
      const cdWidth = width * 0.6; // cd
      const paddingTop = 80 + width * 0.2; // normal-player > cd paddingTop
      const scale = targetWidth / width;
      const x = -(window.innerWidth / 2 - paddingLeft); // normal-player -> mini-player
      const y = window.innerHeight - paddingTop - cdWidth / 2 - paddingBottom;
      return {
        x,
        y,
        scale
      };
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurIndex: 'SET_CUR_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAYLIST'
    }),
    ...mapActions([
      'savePlayHistory'
    ])
  },
  watch: {
    curSong(newSong, oldSong) {
      if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
        return;
      }
      this.songReady = false;
      this.canLyricPlay = false;
      if (this.curLyric) {
        this.curLyric.stop();
        this.curLyric = null;
        this.curLineNum = 0;
        this.curTime = 0;
        this.playingLyric = '';
      }
      this.$refs.audio.src = newSong.url;
      // 初始化播放音乐
      this.$refs.audio.play();

      // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.songReady = true;
      }, 5000);

      this.getLyric();
    },
    playing(newState) {
      const audio = this.$refs.audio;
      this.$nextTick(() => {
        newState ? audio.play() : audio.pause();
      });
      // 暂停
      if (!newState) {
        if (this.fullScreen) {
          this.syncWrapperTransform('cd', 'image');
        }
      }
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll,
    Playlist
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background-dark
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        border-1px($color-border)
        overflow hidden
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-arrow-left
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-text-white
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 5px auto 2px
          line-height: 20px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text-white
        .subtitle
          width 70%
          margin 0 auto
          line-height: 20px
          font-size: $font-size-small
          color: $color-text-white
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          &:after
            content ""
            position absolute
            top -33px
            left 50%
            width 20%
            height 40%
            background url("../../common/image/needle.png") no-repeat
            background-size contain
            z-index 3
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            box-sizing: border-box
            height: 100%
            &:before
              content ""
              position absolute
              top 0
              right 0
              bottom 0
              left 0
              background url("../../common/image/disc.png")
              background-size contain
              z-index 2
            .cd
              position absolute
              top 20%
              left 20%
              width: 60%
              height: 60%
              border-radius: 50%
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                box-sizing: border-box
                border-radius: 50%
                border: 10px solid rgba(255, 255, 255, 0.1)
              .play
                animation: rotate 20s linear infinite
          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text-white
            .pure-music
              padding-top: 50%
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text-white
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-text-white
            &.disable
              color: $color-text-white-shallow
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed !important
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-background
      border-1px-top(rgba(7, 17, 27, 0.1))
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .avatar
        flex: 0 0 40px
        width: 40px
        height: 40px
        padding: 0 10px 0 20px
        .imgWrapper
          height: 100%
          width: 100%
          img
            border-radius: 50%
            &.play
              animation: rotate 10s linear infinite
            &.pause
              animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-grey
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon
          font-size: 30px
          color: $color-text
        .icon-mini
          position absolute
          top 0
          left 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
