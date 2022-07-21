import Vue from 'vue'
import Vuex from 'vuex'
import constants from './modules/constants'
import auth from './modules/auth'
import config from './modules/config'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    constants,
    auth,
    config
  }
})
