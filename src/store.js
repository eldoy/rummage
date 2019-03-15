import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const BASE = 'http://localhost:3000'

export default new Vuex.Store({
  state: {
    files: [],
    polling: false
  },
  mutations: {
    addFile(state, file) {
      state.files.unshift(file)
    },
    setFiles(state, files) {
      state.files = files
    },
    setFile(state, file) {
      state.files = state.files.map(f => {
        return f.id === file.id ? file : f
      })
    }
  },
  actions: {
    async files(store) {
      const files = (await axios({
        url: `${BASE}/files`,
        method: 'GET'
      })).data
      console.log(files)
      store.commit('setFiles', files)
      return files
    },
    async download(store, { address, format }) {
      const file = (await axios({
        url: `${BASE}/download`,
        method: 'POST',
        data: {
          address,
          format
        }
      })).data
      if (!file.error) {
        store.commit('addFile', file)
      }
      console.log(file)
      return file
    },
    async status(store, id) {
      console.log('IN STORE STATUS ID:', id)
      const status = (await axios({
        url: `${BASE}/status`,
        method: 'GET',
        params: { id }
      })).data
      console.log('STATUS RECEIVED:', status)
      store.commit('setFile', status)
      return status
    }
  }
})
