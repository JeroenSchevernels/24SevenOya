import Vue from 'vue'
import Router from 'vue-router'

var firebase = require('firebase/app');
require('firebase/auth');

// Views
import Home from './views/Home.vue'
import Changelog from './views/Changelog.vue'
import Changerequest from './views/Changerequest.vue'
import Join from './views/Join.vue'
import Signin from './views/Signin.vue'
import ReportCallLog from './views/ReportCallLog.vue'
import ReportCustomers from './views/ReportCustomers.vue'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
            path: '*',
            redirect: '/signin'
        },
        {
            path: '/',
            redirect: '/signin'
        },
        {
            path: '/home',
            name: 'home',
            component: Home,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/changelog',
            name: 'changelog',
            component: Changelog,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/wishlist',
            name: 'changerequest',
            component: Changerequest,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/reportcalllog',
            name: 'reportcalllog',
            component: ReportCallLog,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/reportcustomers',
            name: 'reportcustomers',
            component: ReportCustomers,
            meta: {
                requiresAuth: true
            }
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

router.beforeEach((to, from, next) => {
    const currentUser = firebase.auth().currentUser;
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

    if (requiresAuth && !currentUser) next('signin');
    // else if (!requiresAuth && currentUser) next('join'); 
    else next();
})

export default router