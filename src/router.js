import Vue from 'vue'
import Router from 'vue-router'
// Views
import Home from './views/Home.vue'
import Changelog from './views/Changelog.vue'
import Changerequest from './views/Changerequest.vue'
import Join from './views/Join.vue'
import Signin from './views/Signin.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '/',
            name: 'home',
            component: Home
            //  https://router.vuejs.org/guide/advanced/navigation-guards.html
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
        },
        {   
            path: '/join',
            name: 'join',
            component: Join
        },
        {   
            path: '/signin',
            name: 'signin',
            component: Signin
        }

    ]
})