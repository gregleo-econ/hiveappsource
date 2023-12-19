<template>
    <profileForm :profile="myProfile" @submitProfile="submittedProfile" :new="true"></profileForm>
  </template>
  
  <script setup>
  
  import { ref } from 'vue';
  import { useStore } from 'vuex'
  import profileForm from '@/components/Profile.vue'
  const store = useStore()
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const myProfile = ref({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: store.state.user.email,
    payment_email: "",
    education: "",
    student: "",
    country: "",
    campus: "",
    gender: "",
    birthdate: "",
    participated: "",
    completed: ""
})
      
  const submittedProfile = function(){
  
        router.push('/participant/')
      }
  
  </script>
