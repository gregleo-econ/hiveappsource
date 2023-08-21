<template>
  <CHeader position="sticky" color-scheme="dark">
    <CContainer fluid v-if="!isLoading">
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cilMenu" style="color: var(--cui-primary)" size="lg" />
      </CHeaderToggler>
      <img v-bind:src="require('@/assets/brand/hive_logo.svg')"
        style="width: 75px; filter: invert(94%) sepia(62%) saturate(658%) hue-rotate(334deg) brightness(99%) contrast(105%);" />
      <!-- <img :src="SVGLogo" style="width: 50px" /> -->
      <CHeaderBrand class="mx-auto d-lg-none" to="/">
      </CHeaderBrand>
      <CHeaderNav class="d-none d-md-flex me-auto">

        <!-- <CNavItem>
          <CNavLink href="/dashboard"> Dashboard </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">Users</CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">Settings</CNavLink>
        </CNavItem> -->
      </CHeaderNav>
      <CHeaderNav>
        <!-- <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-bell" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-list" size="lg" />
          </CNavLink>
        </CNavItem>
        <CNavItem>
          <CNavLink href="#">
            <CIcon class="mx-2" icon="cil-envelope-open" size="lg" />
          </CNavLink>
        </CNavItem> -->
        <template v-if=!store.state.user.auth>
          <SignupButton style="margin-left:10px;" />
          <div> </div>
          <LoginButton style="margin-left:10px;" />
          <!-- <h1>{{ role }}</h1> -->
        </template>
        <template v-if=store.state.user.auth>
          <LogoutButton />
        </template>
        <template v-if=store.state.user.auth>
          <CDropdown variant="dropdown">
            <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
              <CAvatar size="md" :src="user.picture" />
            </CDropdownToggle>
            <CDropdownMenu class="pt-0">
              <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
                Settings
              </CDropdownHeader>
              <CDropdownItem>
                <CIcon icon="cil-user" /> Profile
              </CDropdownItem>
              <CDropdownDivider />
            </CDropdownMenu>
          </CDropdown>
        </template>
      </CHeaderNav>
    </CContainer>
    <!-- <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer> -->
  </CHeader>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useStore } from 'vuex'
import LoginButton from "@/components/login-button.vue";
import LogoutButton from "@/components/logout-button.vue";
import SignupButton from "@/components/signup-button.vue";
import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { useAuth0 } from '@auth0/auth0-vue';
import axios from 'axios'
const store = useStore();

const { isLoading, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

const getToken = async function (){
  let token = await getAccessTokenSilently()
  store.commit('jwt',token)
}

watch(isLoading, () => {
  if (!isLoading.value & isAuthenticated.value) {
    store.commit('email', user.value.email)
    store.commit('auth', true)    
    getToken()
    axios
      .get(`http://127.0.0.1:9985/users/get_role?my_email=${user.value.email}`)
      .then(res => {
        store.commit('role', res.data[0])
      }).then(res => {
        console.log(userData.value)
        console.log(store.state)

      })
      .catch(function (error) { });
    console.log(store.state.user)
  }

}, { immediate: true })


watch(isAuthenticated, () => {
  if (!isLoading.value & isAuthenticated.value) {
    store.commit('email', user.value.email)
    store.commit('auth', true)
    getToken()
    axios
      .get(`http://127.0.0.1:9985/users/get_role?my_email=${user.value.email}`)
      .then(res => {
        store.commit('role', res.data[0])
      })
      .catch(function (error) { store.commit('role', 'new') });
  }
  console.log(store.state.user)
}, { immediate: true })

const name = 'AppHeader'
const components = {
  AppBreadcrumb,
  AppHeaderDropdownAccnt,
}




</script>
