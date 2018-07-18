import axios from 'axios'
export default {
  state: {
    user: null,
    email: '',
    state: ''
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user || null
    },
    SET_EMAIL (state, email) {
      state.email = email || ''
    },
    SET_STATE (st, state) {
      st.state = state || ''
    }
  },
  actions: {
    init ({ commit }) {
      let user = sessionStorage.getItem('user')
      let email = sessionStorage.getItem('email')
      let state = sessionStorage.getItem('state')
      commit('SET_USER', user)
      commit('SET_EMAIL', email)
      commit('SET_STATE', state)
      if (!user) sessionStorage.clear()
    },
    update ({ commit }, { user, state, email }) {
      if (user) {
        commit('SET_USER', user)
        sessionStorage.setItem('user', user)
      }
      if (state) {
        commit('SET_STATE', state)
        sessionStorage.setItem('state', state)
      }
      if (email) {
        commit('SET_EMAIL', email)
        sessionStorage.setItem('email', email)
      }
    },
    login ({ commit }, { user, pass }) {
      return axios.post('/api/user/info', { user, pass })
        .then(data => {
          data = data.data
          commit('SET_USER', data.user)
          commit('SET_STATE', data.state)
          commit('SET_EMAIL', data.email)
          sessionStorage.setItem('user', data.user)
          sessionStorage.setItem('email', data.email)
          sessionStorage.setItem('state', data.state)
        })
    },
    logout ({ commit }) {
      return axios.post('/api/user/logout')
        .then(data => {
          commit('SET_USER', null)
          commit('SET_STATE', '')
          commit('SET_EMAIL', '')
          sessionStorage.clear()
        })
    }
  }
}
