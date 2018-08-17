<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item, index) in switches" :key="index" :class="{'active': currentIndex === index}" ref="switchItem" @click="switchItem(index)">
      <span>{{item.name}}</span>
    </li>
    <div class="border" ref="border"></div>
  </ul>
</template>

<script type="text/ecmascript-6">
const BORDER_WIDTH = 50;

export default {
  props: {
    switches: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      pos: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this._setBorderPos();

      window.addEventListener('resize', () => {
        this._setBorderPos();
      });
    });
  },
  methods: {
    switchItem(index) {
      let border = this.$refs.border;
      border.style.left = `${this.pos[index]}px`;
      this.$emit('switch', index);
    },
    _setBorderPos() {
      // 获取DOM元素
      let border = this.$refs.border;
      let itemLen = this.$refs.switchItem.length;
      let itemWidth = window.innerWidth / itemLen;
      let diff = (itemWidth - BORDER_WIDTH) / 2;
      // 设置动画运行的位置数组
      for (let i = 0; i < itemLen; i++) {
        this.pos[i] = i * itemWidth + diff;
      }
      // 设置位置
      border.style.left = `${this.pos[this.currentIndex]}px`;
    }
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    position relative
    display: flex
    align-items: center
    margin: 0 auto
    background $color-background
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-grey
      font-weight bold
      &.active
        color: $color-sub-theme
    .border
      position absolute
      bottom 3px
      width 50px
      height 35px
      border-bottom 1px solid $color-sub-theme
      transition left .3s
</style>
