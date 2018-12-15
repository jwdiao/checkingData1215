import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Manage6S from './views/Manage6S.vue'

import Cars from './views/Cars'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/Manage6S',
      name: 'manage6S',
      component: Manage6S,
    },
    {
      path: '/cars',
      component: Cars
    }
  ]
})
