import router from './router'
import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import * as icons from '@coreui/icons'
import { auth0 } from '@/auth/auth' 
import loadingAnimation from '@/components/Loading.vue'
import Select2 from 'vue3-select2-component'
import VueDatePicker from '@vuepic/vue-datepicker'
import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';
import '@vuepic/vue-datepicker/dist/main.css';




const app = createApp(App)
app.use(store)
app.use(CoreuiVue)
app.use(router)
app.use(auth0)


app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('Select2', Select2);
app.component('VueDatePicker', VueDatePicker);
app.component('loadingAnimation',loadingAnimation)
app.component('EasyDataTable', Vue3EasyDataTable);
//turn off errors
// app.config.errorHandler = () => null;
// app.config.warnHandler = () => null;


router.beforeEach((to, from) => {
  if (to.meta.requiresAuth) {
    if (store.state.user.auth) {
      return true
    } else {
      return '/'
    }
  }
})


app.mount('#app')
