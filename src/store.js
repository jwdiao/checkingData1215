import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    baseUrl: 'http://10.19.7.69:8083' //测试环境----首页路径
    // baseUrl: 'http://10.19.7.70:8083' //生产环境---首页路径
  },
  mutations: {

  },
  actions: {
  }
})
