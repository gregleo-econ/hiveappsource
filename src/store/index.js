import { createStore } from 'vuex'

export default createStore({
  state: {
    sidebarVisible: '',
    sidebarUnfoldable: false,
    user: {auth:false,email:"",role:"",jwt:""}
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value
    },
    auth(state,payload) {
      state.user.auth = payload
    },
    email(state,payload) {
      state.user.email = payload
    },
    role(state,payload) {
      state.user.role = payload
    },
    jwt(state,payload) {
      state.user.jwt = payload
    },
  },
  actions: {},
  modules: {},
})
