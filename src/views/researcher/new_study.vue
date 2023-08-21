<template>
  <studyInfo :studyData="newStudyData" :new="true"></studyInfo>
</template>

<script setup>

const newStudyData = ref({
  internal_study_name: "Test Study",
  external_study_name: "Test Study External",
  external_description: "External description goes here.",
  internal_description: "Internal description goes here.",
  participation_fee: "5",
  average_pay: "5",
  study_duration: "5",
  quota: "100",
  study_url: "http://www.mystudy.com",
  pool_filter: [],
  pool_filter_json: '[[]]'
})



import { ref } from 'vue';
import studyInfo from '@/components/StudyInfo.vue'




</script>