<template>
  <div class="m-header">
    <div class="user">
      <i class="icon icon-list"></i>
    </div>
    <div class="icon-wrapper">
      <i class="icon icon-songlist"></i>
    </div>
    <div class="search">
      <i class="icon icon-search"></i>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .m-header
    position: relative
    height: 64px
    padding-top 15px
    text-align: center
    color $color-text-head
    font-size: 0
    background-color $color-background-head
    box-sizing border-box
    .icon
      font-size 25px
    .user
      position absolute
      top 15px
      left 10px
    .search
      position absolute
      top 15px
      right 10px
</style>
