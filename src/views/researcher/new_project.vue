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
  description: "",
  jel: [],
  keywords: "",
  abstract: "",
  citation: "",
  owner: store.state.user.email,
  collaborators: [],
  linked_experiments: []
})


</script>