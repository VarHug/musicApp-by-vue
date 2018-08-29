<template>
  <div class="route-header">
    <div class="back" @click="back">
      <i class="icon-arrow-left"></i>
    </div>
    <h1 class="title">{{title}}</h1>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    back() {
      this.$emit('back');
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .back
      position absolute
      top 0
      left 6px
      z-index 50
      .icon-arrow-left
        display block
        padding 10px
        font-size $font-size-large
        color $color-text-white
    .title
      no-wrap()
      line-height 40px
      text-align center
      font-size $font-size-large
      color $color-text-white
      background $color-background-red
</style>
