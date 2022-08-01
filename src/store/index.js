import Vue from 'vue'
import Vuex from 'vuex'
import constants from './modules/constants'
import auth from './modules/auth'
import config from './modules/config'
import track from "@/store/modules/track";
import devices from "@/store/modules/devices";
import packages from "@/store/modules/packages";
import extras from "@/store/modules/extras";
import Report from "@/store/modules/Report";
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
    Report,
    auth,
    config,
    extras,
    track,
    devices,
    packages
  }
})
