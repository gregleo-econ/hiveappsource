<template>
  <sessionInfo :sessionData="newSessionData" :new="true"></sessionInfo>
</template>
<script setup>
const newSessionData = ref({
  internal_session_name: "Test Session",
  external_session_name: "Test Session External",
  external_description: "External description goes here.",
  internal_description: "Internal description goes here.",
  participation_fee: "5",
  average_pay: "5",
  session_duration: "5",
  quota: "100",
  session_url: "http://www.mysession.com",
  pool_filter: [],
  pool_filter_json: '[[]]',
  project_id: 0,
})
import { ref } from 'vue';
import sessionInfo from '@/components/SessionInfo.vue'
</script>