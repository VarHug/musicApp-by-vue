<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="item in searches" :key="item" @click="selectItem(item)">
        <span class="text">{{item}}</span>
        <span class="icon" @click.stop="deleteOne(item)">
          <i class="icon-dismiss"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searches: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item);
    },
    deleteOne(item) {
      this.$emit('delete', item);
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search-list
    .search-item
      display flex
      align-items center
      height 40px
      overflow hidden
      &.list-enter-active, &.list-leave-active
        transition all 0.1s
      &.list-enter, &.list-leave-to
        height 0
      .text
        flex 1
        font-size $font-size-medium
      .icon
        extend-click()
        .icon-dismiss
          font-size $font-size-small
          color $color-text-grey

</style>
