<template>
  <projectInfo :projectData="newProjectData" :new="true"></projectInfo>
</template>
<script setup>
import { ref } from 'vue';
import projectInfo from '@/components/ProjectInfo.vue'
import { useStore } from 'vuex';
const store = useStore()
const newProjectData = ref({
  name: "",
  authors: "",
  jel: "",
  keywords: "",
  abstract: "",
  citation: "",
})
</script>