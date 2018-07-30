<template>
  <scroll class="listview" :data="data">
    <ul>
      <li v-for="(group, index) in data" :key="index" class="list-group">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="(item, index) in group.items" :key="index" class="list-group-item">
            <img :src="item.avatar" class="avatar">
            <span class="name border-1px">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from '@/base/scroll/scroll';

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    }
  },
  components: {
    Scroll
  }
};

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .listview
    position: relative
    width 100%
    height 100%
    overflow hidden
    background $color-background
    .list-group
      padding-bottom 30px
      .list-group-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-white
        background $color-background-red
      .list-group-item
        display flex
        align-items center
        padding 20px 0 0 30px
        .avatar
          flex 0 0 50px
          width 50px
          height 50px
          border-radius 50%
        .name
          display block
          flex 1
          height 50px
          line-height 50px
          border-1px($color-border)
          margin-left 20px
          color $color-text
          font-size $font-size-medium
    .list-shortcut
      position absolute
      z-index 30
      right 0
      top 50%
      transform translateY(-50%)
      width 20px
      padding 20px 0
      border-radius 10px
      text-align center
      background $color-background-d
      font-family Helvetica
      .item
        padding 3px
        line-height 1
        color $color-text-l
        font-size $font-size-small
        &.current
          color $color-theme
    .list-fixed
      position absolute
      top 0
      left 0
      width 100%
      .fixed-title
        height 30px
        line-height 30px
        padding-left 20px
        font-size $font-size-small
        color $color-text-l
        background $color-highlight-background
    .loading-container
      position absolute
      width 100%
      top 50%
      transform translateY(-50%)
</style>
