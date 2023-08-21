<template>
    <CButton color="primary" variant="outline"  @click="handleSignUp"> Sign Up </CButton>
  
</template>

<script setup>
import { useAuth0 } from "@auth0/auth0-vue";

const { loginWithRedirect } = useAuth0();

const handleSignUp = () => {
  loginWithRedirect({
    appState: {
      target: "/",
    },
    authorizationParams: {
      screen_hint: "signup",
    }
  });
};
</script>