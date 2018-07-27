// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';
import App from './App';
import router from './router';
import VueLazyLoad from 'vue-lazyload';
import fastclick from 'fastclick';

import '@/common/stylus/index.styl';

Vue.config.productionTip = false;

fastclick.attach(document.body);

Vue.use(VueLazyLoad, {
  loading: require('./common/image/load.png')
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
