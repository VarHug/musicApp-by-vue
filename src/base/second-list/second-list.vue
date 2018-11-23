<template>
  <ul class="second-list" v-if="list">
    <li v-for="(item, index) in list" :key="index" class="second-list-item" @click="select(item)">
      <div class="img-wrapper">
        <img v-lazy="item.imgurl">
      </div>
      <p class="desc" v-html="item.name"></p>
      <p class="creator-name" v-html="item.creator"></p>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    select(item) {
      this.$emit('select', item);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .second-list
    display flex
    flex-flow row wrap
    align-content flex-start
    justify-content space-between
    .second-list-item
      flex 0 0 48%
      position relative
      width 48%
      padding-bottom 30px
      overflow hidden
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
          margin 0 auto
      .desc
        margin-top 5px
        line-height 18px
        font-size $font-size-small-s
        color $color-text
      .creator-name
        position absolute
        bottom 8px
        width 100%
        line-height 18px
        font-size $font-size-small-s
        color $color-text-grey
        no-wrap()

</style>
