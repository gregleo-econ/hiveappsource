<template>
  <CButton color="primary" variant="outline" @click="handleLogout"> Log Out </CButton>
</template>

<script setup>
import { useAuth0 } from "@auth0/auth0-vue";
import { useStore } from 'vuex'
const { logout } = useAuth0();
const store = useStore();


const handleLogout = () => {
  logout({
    logoutParams: {
      returnTo: 'http://econhive.com/app/',
    }
  });
  localStorage.setItem('user', {
    auth: "false",
    email: "",
    role: "",
    jwt: "",
    picture: "",
    location: "/"
  })
  store.commit('user', {
    auth: false,
    email: "",
    role: "",
    jwt: "",
    picture: "",
    route: "/",
  })
}
</script>