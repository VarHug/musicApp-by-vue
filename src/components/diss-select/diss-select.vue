<template>
  <transition name="slide">
  <div class="diss-select" v-show="showFlag">
    <div class="back" @click="hide">
      <i class="icon-arrow-left"></i>
    </div>
    <h1 class="title">全部分类</h1>
    <scroll class="select-list" ref="selectList">
      <div>
        <li class="category-group" v-for="(categoryGroup, index) in diss" :key="index">
          <div class="diss-tag-name">
            <div class="diss-desc">
              <i class="icon" :class="getTagIcon(categoryGroup)"></i>
              <span class="name">{{categoryGroup.categoryGroupName}}</span>
            </div>
          </div>
          <ul class="diss-tag" ref="dissTag">
            <li class="category" v-for="(category, index) in categoryGroup.items" :key="index" v-html="category.categoryName"></li>
          </ul>
        </li>
      </div>
    </scroll>
  </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import {getDissTag} from '../../api/diss.js';
import Scroll from '@/base/scroll/scroll';
import {ERR_OK} from '@/api/config.js';

const colNum = 3;

export default {
  data() {
    return {
      showFlag: false,
      diss: []
    };
  },
  created() {
    this._getDissTag();
  },
  mounted() {
    this.$nextTick(() => {
      this._setBorderCss();
    });
  },
  methods: {
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.selectList.refresh();
      }, 20);
    },
    hide() {
      this.showFlag = false;
    },
    getTagIcon(categoryGroup) {
      if (categoryGroup.categoryGroupName === '语种') {
        return 'icon-type-language';
      }
      if (categoryGroup.categoryGroupName === '流派') {
        return 'icon-type-style';
      }
      if (categoryGroup.categoryGroupName === '主题') {
        return 'icon-type-theme';
      }
      if (categoryGroup.categoryGroupName === '心情') {
        return 'icon-type-mood';
      }
      if (categoryGroup.categoryGroupName === '场景') {
        return 'icon-type-scene';
      }
    },
    _getDissTag() {
      getDissTag().then(res => {
        if (res.code === ERR_OK) {
          this.diss = res.data.categories.slice(1);
        }
      });
    },
    _setBorderCss() {
      let dissTag = this.$refs.dissTag;
      if (dissTag && dissTag.length) {
        for (let i = 0; i < dissTag.length; i++) {
          let items = dissTag[i].children;
          let len = items.length;
          let num = len % colNum;
          if (num === 0) {
            num = colNum;
          }
          for (let j = len - 1; num > 0; num--, j--) {
            items[j].style.borderBottom = 'none';
          }
        }
      }
    }
  },
  components: {
    Scroll
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .diss-select
    position fixed
    top 0
    bottom 0
    width 100%
    z-index 200
    background $color-background
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
      z-index 40
      no-wrap()
      line-height 40px
      text-align center
      font-size $font-size-large
      color $color-text-white
      background $color-background-red
    .select-list
      position absolute
      top 40px
      bottom 0
      overflow hidden
      .category-group
        display flex
        border-top 5px solid #ddd
        &:last-child
          border-bottom 5px solid #ddd
        .diss-tag-name
          position relative
          flex 0 0 75px
          width 75px
          border-right 1px solid $color-border
          .diss-desc
            position absolute
            top 50%
            left 50%
            transform translate3d(-50%, -50%, 0)
            text-align center
            color $color-text-grey
            .icon
              font-size $font-size-large
            .name
              display block
              font-size $font-size-medium
        .diss-tag
          flex 1
          .category
            display inline-block
            line-height 35px
            width 33.3%
            height 35px
            text-align center
            font-size $font-size-medium-x
            color $color-text
            border-right 1px solid $color-border
            border-bottom 1px solid $color-border
            box-sizing border-box
            &:nth-child(3n)
              border-right none

  .slide-enter-active, .slide-leave-active
    transition all .3s
  .slide-enter, .slide-leave-to
    transform translate3d(100%, 0, 0)
</style>
