<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songsList" :key="index" class="item" @click="selectItem(song, index)">
        <div class="rank">
          <span :class="getRankCls(index)">{{getRankText(index)}}</span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    songsList: {
      type: Array,
      default: () => []
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    getDesc(song) {
      return `${song.singer}-${song.album}`;
    },
    selectItem(item, index) {
      this.$emit('select', item, index);
    },
    getRankCls(index) {
      if (this.rank && index <= 2) {
        return 'text text-red';
      } else {
        return 'text';
      }
    },
    getRankText(index) {
      return index + 1;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display flex
      align-items center
      box-sizing border-box
      height 64px
      font-size $font-size-medium
      border-1px(rgba(7, 17, 27, 0.1))
      .rank
        flex 0 0 25px
        width 25px
        margin-right 20px
        text-align center
        .text
          color $color-text
          font-size $font-size-large
          &.text-red
            color $color-background-red
      .content
        flex 1
        line-height 20px
        overflow hidden
        .name
          no-wrap()
          color $color-text
        .desc
          no-wrap()
          margin-top 4px
          color $color-text-grey
</style>
