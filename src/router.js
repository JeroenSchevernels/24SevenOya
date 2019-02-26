import Vue from 'vue'
import Router from 'vue-router'
// Views
import Home from './views/Home.vue'
import Changelog from './views/Changelog.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/changelog',
            name: 'changelog',
            component: Changelog
        }
    ]
})