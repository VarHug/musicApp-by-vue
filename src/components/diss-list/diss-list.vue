<template>
  <ul class="diss-list">
    <li v-for="(item, index) in dissList" :key="index" class="diss-list-item" @click="selectDiss(item)">
      <div class="img-wrapper">
        <img v-lazy="item.imgurl">
      </div>
      <p class="desc" v-html="item.dissname"></p>
      <p class="creator-name" v-html="item.creator.name"></p>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dissList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectDiss(diss) {
      this.$emit('select', diss);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .diss-list
    display flex
    flex-flow row wrap
    align-content flex-start
    margin-right -5%
    .diss-list-item
      flex 0 0 45%
      position relative
      width 45%
      margin-right 5%
      padding-bottom 30px
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
        line-height 18px
        font-size $font-size-small-s
        color $color-text-grey

</style>
