import Vue from 'vue'
import App from './App.vue'
import Vuetify from "vuetify"
import 'vuetify/dist/vuetify.min.css'
import Clipboard from 'v-clipboard'
import router from './router'
import store from './store'

var firebase = require('firebase/app');
require('firebase/auth');
require("firebase/firestore");

const config = {
    apiKey: "AIzaSyD6M6kvGgdlW5LP8yJtbMkpbplfWE-seik",
    authDomain: "soya-f03e7.firebaseapp.com",
    databaseURL: "https://soya-f03e7.firebaseio.com",
    projectId: "soya-f03e7",
    //storageBucket: "soya-f03e7.appspot.com",
    //messagingSenderId: "553226976892"
};

firebase.initializeApp(config);

Vue.use(Clipboard)
Vue.config.productionTip = false
Vue.use(Vuetify)

Vue.prototype.$firebase = firebase;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});