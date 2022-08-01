import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import store from './store'
import router from './router'
import vuetify from './plugins/vuetify'
import LDrawToolbar from 'vue2-leaflet-draw-toolbar';
import VueExcelXlsx from "vue-excel-xlsx";

Vue.component('l-draw-toolbar',LDrawToolbar)
Vue.use(VueExcelXlsx)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
