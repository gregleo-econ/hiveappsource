<template>
  <profileForm :key="formKey" :profile="myProfile" @submitProfile="submittedProfile" :new="false"></profileForm>
</template>
<script setup>
import { ref } from 'vue';
import profileForm from '@/components/Profile.vue'
import * as DataFunctions from '@/services/GetData.js'
import { useRouter } from 'vue-router'
const router = useRouter()
const formKey = ref(0)
const myProfile = ref({})
DataFunctions.SubjectGetProfile()
  .then(res => {
    myProfile.value = res.data[0];

    formKey.value += 1;
  });

const submittedProfile = function () {
  router.push('/participant/')
}
</script>