import router from './router'
import { createAuth0 } from '@auth0/auth0-vue'
import { createApp } from 'vue'
import App from './App.vue'

import store from './store'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import * as icons from '@coreui/icons'

import DocsExample from '@/components/DocsExample'
import { useAuth0 } from '@auth0/auth0-vue'
import { useStore } from 'vuex'
import loadingAnimation from '@/components/Loading.vue'

// Multi-select
import Select2 from 'vue3-select2-component';

// Date Picker
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';




const app = createApp(App)
app.use(store)
app.use(CoreuiVue)
app.use(router)


app.use(
  createAuth0({
    domain: 'dev-z1ij1wuhd8l6lh8g.us.auth0.com',
    clientId: 'xFdDPR6WE0ILMo8AD85i7MBL7FEKXbYJ',
    authorizationParams: {
      redirect_uri: 'http://www.econhive.com',
      screen_hint: 'signup',
      audience: "http://137.184.10.117/oso/"
    },
  }),
)

app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('Select2', Select2);
app.component('VueDatePicker', VueDatePicker);
app.component('loadingAnimation',loadingAnimation)

//turn off errors
// app.config.errorHandler = () => null;
// app.config.warnHandler = () => null;

router.beforeEach((to, from) => {
  if (to.meta.requiresAuth) {
    if (useAuth0().isAuthenticated.value) {
      return true
    } else {
      return '/'
    }
  }
})

app.mount('#app')
