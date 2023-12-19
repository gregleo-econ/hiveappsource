<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100" style="background-color:#636363; color:black;">
      <AppHeader style="margin-bottom:30px"/>
      <div class="body flex-grow-1">
        <!-- <div style="color:white; width:50%; min-width:200px; max-width:600px; margin-left:auto; margin-right:auto; margin-bottom:30px; display:grid"><CBadge color="danger">BETA</CBadge><h6><center>This is a public sandbox beta version of HIVE. The data and sessions here are simulated.</center></h6></div> -->
        <CContainer lg class="main-container" style="margin-left: auto; margin-right:auto; margin-top:10px">
          <router-view />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
<script>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
export default {
  name: 'DefaultLayout',
  components: {
    AppFooter,
    AppHeader,
    AppSidebar,
    CContainer,
  },
}
</script>
<style scoped>
.body {
background-image: url("~@/assets/brand/hex_background.svg");
    background-size: 100vw;
    background-repeat: no-repeat;
    background-attachment: fixed;
}
</style>