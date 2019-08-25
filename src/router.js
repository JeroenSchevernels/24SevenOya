import Vue from 'vue'
import Router from 'vue-router'

// Views
import Home from './views/Home.vue'
import Changelog from './views/Changelog.vue'
import Changerequest from './views/Changerequest.vue'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [{
      path: '*',
      redirect: '/home'
    },
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/changelog',
      name: 'changelog',
      component: Changelog
    },
    {
      path: '/wishlist',
      name: 'changerequest',
      component: Changerequest
    }
  ]
})
