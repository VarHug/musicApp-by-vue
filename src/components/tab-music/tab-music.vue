<template>
  <div class="tab">
    <router-link tag="div" class="tab-item" to="/recommend" @click.native="tabClickHandler(0)">
      <span class="tab-link">推荐</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/singer" @click.native="tabClickHandler(1)">
      <span class="tab-link">歌手</span>
    </router-link>
    <router-link tag="div" class="tab-item" to="/rank" @click.native="tabClickHandler(2)">
      <span class="tab-link">排行</span>
    </router-link>
    <div class="border" ref="border"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        pos: []
      };
    },
    mounted() {
      // 获取DOM元素
      let border = this.$refs.border;
      let tabItem = document.getElementsByClassName('tab-item');
      let tabItemWidth = tabItem[0].clientWidth;
      let diff = (tabItemWidth - border.clientWidth) / 2;
      // 设置动画运行的位置数组
      for (let i = 0; i < tabItem.length; i++) {
        this.pos.push(i * tabItemWidth + diff);
      }
      // 设置位置
      border.style.left = `${this.pos[0]}px`;
    },
    methods: {
      tabClickHandler(index) {
        let border = this.$refs.border;
        border.style.left = `${this.pos[index]}px`;
      }
    }
  };
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .tab
    position relative
    display: flex
    height: 40px
    line-height: 40px
    font-size: $font-size-medium
    background-color $color-background-head
    .tab-item
      flex: 1
      text-align: center
      .tab-link
        color $color-text-head
        padding-bottom: 5px
      &.router-link-active
        .tab-link
          color: $color-text-head-hover
    .border
      position absolute
      width 40px
      height 35px
      border-bottom 1px solid $color-text-head
      transition left .3s
</style>
