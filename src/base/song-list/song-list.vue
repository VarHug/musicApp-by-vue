<template>
  <div class="song-list">
    <ul>
      <li v-for="(song, index) in songsList" :key="index" class="item" @click="selectItem(song, index)">
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
    }
  },
  data() {
    return {

    };
  },
  methods: {
    getDesc(song) {
      return `${song.singer}-${song.album}`;
    },
    selectItem(item, index) {
      this.$emit('select', item, index);
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
        margin-right 30px
        text-align center
        .icon
          display inline-block
          width 25px
          height 24px
          background-size 25px 24px
        .text
          color $color-theme
          font-size $font-size-large
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
