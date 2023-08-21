<template>
  <profileForm :key="formKey" :profile="myProfile" @submitProfile="submittedProfile" :new="false"></profileForm>
</template>

<script setup>

import { ref } from 'vue';
import axios from 'axios'
import { useStore } from 'vuex'
import profileForm from '@/components/Profile.vue'
const store = useStore()
import { useRouter } from 'vue-router'
const router = useRouter()
const formKey = ref(0)

const myProfile = ref({})
  
axios
    .get("http://127.0.0.1:9985/subject/get_profile?my_email=" + store.state.user.email)
    .then(res => {
      myProfile.value = res.data[0];
      console.log(myProfile.value)
      formKey.value += 1;      
    });

    
    const submittedProfile = function(){

      router.push('/participant/')


    }

</script>