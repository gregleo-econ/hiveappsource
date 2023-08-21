<template>
  <CButton color="primary" variant="outline" @click="handleLogin">Log In</CButton>
</template>

<script setup>
import { useAuth0 } from "@auth0/auth0-vue";

const { loginWithRedirect } = useAuth0();

const handleLogin = () => {
    loginWithRedirect({
  });
};
</script>