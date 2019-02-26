import Vue from 'vue'
import App from './App.vue'
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css'
import Clipboard from 'v-clipboard'
import router from './router'
import store from './store'

Vue.use(Clipboard)
Vue.config.productionTip = false
Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});
