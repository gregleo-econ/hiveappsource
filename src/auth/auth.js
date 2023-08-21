// utils/useAuth0.js
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios'
import { ref, onMounted, onUnmounted } from 'vue'

// by convention, composable function names start with "use"
export function getRole() {
  // state encapsulated and managed by the composable
  const {user, isAuthenticated} = useAuth0()
  console.log(user)
  axios


  return { role }
}

