import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    files: []
  },
  mutations: {
    setFiles(state, file) {
      state.files.unshift(file)
    }
  },
  actions: {
    async convert(store, { address, format }) {
      const response = await axios({
        url: 'http://localhost:3000/convert',
        method: 'POST',
        data: {
          address,
          format
        }
      })
      store.commit('setFiles', response.data)
    }
  }
})
