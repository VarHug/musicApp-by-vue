import Vue from 'vue';
import Router from 'vue-router';
import Recommend from 'components/recommend/recommend.vue';
import Singer from 'components/singer/singer.vue';
import Rank from 'components/rank/rank.vue';
import SingerDetail from 'components/singer-detail/singer-detail.vue';
import Diss from 'components/diss/diss.vue';
import TopList from 'components/top-list/top-list.vue';
import Search from 'components/search/search';
import UserCenter from 'components/user-center/user-center.vue';

Vue.use(Router);

export default new Router({
  routes: [{
    path: '/',
    redirect: '/recommend'
  }, {
    path: '/recommend',
    component: Recommend,
    children: [{
      path: ':id',
      component: Diss
    }]
  }, {
    path: '/singer',
    component: Singer,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  }, {
    path: '/rank',
    component: Rank,
    children: [{
      path: ':id',
      component: TopList
    }]
  }, {
    path: '/search',
    component: Search,
    children: [{
      path: ':id',
      component: SingerDetail
    }]
  }, {
    path: '/user',
    component: UserCenter
  }]
});
