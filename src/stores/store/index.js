ßimport Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    studentinfo: '',
    liuchenginfo: '',
    loadIFshow: true
  },
  mutations: {
    addstudentinfo (state, info) {
      info = JSON.parse(info)
      state.studentinfo = info
    },
    changeload (state, info) {
      state.loadIFshow = info
    }
  }
})

export default store
