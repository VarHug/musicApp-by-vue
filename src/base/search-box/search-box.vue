<template>
  <div class="search-box">
    <input class="box" v-model="query" :placeholder="placeholder" ref="query"/>
    <i class="icon-dismiss" v-show="query" @click="clear"></i>
  </div>
</template>

<script type="text/ecmascript-6">
import {debounce} from '@/common/js/util.js';

export default {
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      query: ''
    };
  },
  created() {
    this.$watch('query', debounce((newQuery) => {
      this.$emit('query', newQuery);
    }, 200));
  },
  methods: {
    clear() {
      this.query = '';
    },
    setQuery(query) {
      this.query = query;
    },
    blur() {
      this.$refs.query.blur();
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      padding-right 25px
      line-height: 25px
      background: $color-background-red
      color: $color-text-white
      font-size: $font-size-medium
      border-bottom 1px solid $color-text-l
      outline: 0
      &::placeholder
        color: $color-text-d
      &:focus
        border-bottom 1px solid $color-text-ll
    .icon-dismiss
      position absolute
      right 15px
      font-size: 14px
      color: $color-background
</style>
