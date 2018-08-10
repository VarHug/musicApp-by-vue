<template>
  <div class="no-result">
    <p class="no-result-text">没有找到与"{{text}}"相关的结果</p>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    text: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .no-result
    text-align center
    .no-result-text
      font-size $font-size-medium

</style>
