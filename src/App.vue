<template>
  <div id="app">
    <m-header></m-header>
    <tab-music></tab-music>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header';
import TabMusic from 'components/tab-music/tab-music';

export default {
  name: 'App',
  components: {
    MHeader,
    TabMusic
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
