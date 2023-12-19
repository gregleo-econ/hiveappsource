import { createStore } from "vuex";
import { useStorage } from "@vueuse/core";
export default createStore({
  state: {
    sidebarVisible: useStorage("sidebarVisible", true),
    sidebarUnfoldable: useStorage("sidebarUnfoldable", true),
    user: useStorage("user", {
      auth: false,
      email: "",
      role: "",
      picture: ""
    }),
  },
  mutations: {
    toggleSidebar(state) {
      state.sidebarVisible = !state.sidebarVisible;
    },
    toggleUnfoldable(state) {
      state.sidebarUnfoldable = !state.sidebarUnfoldable;
    },
    updateSidebarVisible(state, payload) {
      state.sidebarVisible = payload.value;
    },
    auth(state, payload) {
      state.user.auth = payload;
    },
    email(state, payload) {
      state.user.email = payload;
    },
    picture(state, payload) {
      state.user.picture = payload;
    },
    role(state, payload) {
      state.user.role = payload;
    },
    route(state, payload) {
      state.user.route = payload;
    },
    user(state, payload) {
      state.user = payload;
    },
  },
  actions: {},
  modules: {},
});
