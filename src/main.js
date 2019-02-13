import Vue from 'vue'
import App from './App.vue'
import Vuetify from "vuetify";
import 'vuetify/dist/vuetify.min.css'
import Clipboard from 'v-clipboard'

Vue.use(Clipboard)
Vue.config.productionTip = false
Vue.use(Vuetify)

new Vue({
  el: '#app',
  render: h => h(App),
});
