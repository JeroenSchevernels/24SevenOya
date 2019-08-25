import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import clipboard from 'v-clipboard'
import store from './store'
import router from './router'

Vue.use(clipboard)
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
