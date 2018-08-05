<template>
  <div id="app">
    <m-header></m-header>
    <tab-music></tab-music>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header';
import TabMusic from 'components/tab-music/tab-music';
import Player from 'components/player/player';

export default {
  name: 'App',
  components: {
    MHeader,
    TabMusic,
    Player
  }
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
