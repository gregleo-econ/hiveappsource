<template>
  <CHeader position="sticky" color-scheme="dark">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cilMenu" style="color: var(--cui-primary)" size="lg" />
      </CHeaderToggler>
      <img v-bind:src="require('@/assets/brand/hive_logo.svg')"
        style="width: 75px; filter: invert(94%) sepia(62%) saturate(658%) hue-rotate(334deg) brightness(99%) contrast(105%);" />
      <CHeaderBrand class="mx-auto d-lg-none" to="/">
      </CHeaderBrand>
      <CHeaderNav class="d-none d-md-flex me-auto">
      </CHeaderNav>
      <CHeaderNav>
        <template v-if=!store.state.user.auth>
          <SignupButton style="margin-left:10px;" />
          <div> </div>
          <LoginButton style="margin-left:10px;" />
        </template>
        <template v-else=store.state.user.auth>
          <LogoutButton />
          <CDropdown variant="dropdown">
            <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
              <CAvatar size="md" :src="store.state.user.picture" />
            </CDropdownToggle>
            <CDropdownMenu class="pt-0">
              <CDropdownHeader>
                <CIcon icon="cil-user" /> {{ store.state.user.role }}: {{ store.state.user.email }}
              </CDropdownHeader>
            </CDropdownMenu>
          </CDropdown>
        </template>
      </CHeaderNav>
    </CContainer>
  </CHeader>
</template>
<script setup>
import { watch } from 'vue'
import { useStore } from 'vuex'
import LoginButton from "@/components/auth/LoginButton.vue";
import LogoutButton from "@/components/auth/LogoutButton.vue";
import SignupButton from "@/components/auth/SignupButton.vue";
import { useAuth0 } from '@auth0/auth0-vue';
import { useRouter } from 'vue-router'
import * as DataFunctions from '@/services/GetData.js'

const store = useStore();
const router = useRouter();

const { isLoading, user, isAuthenticated} = useAuth0();

const authenticate = function () {
  store.commit('email', user.value.email)
  store.commit('auth', true)
  store.commit('picture', user.value.picture)
  
  DataFunctions.UsersGetRole()
    .then(res => {
      store.commit('role', res.data[0])
      if (res.data[0] == "researcher") {
      }
      else if (res.data[0] == "participant") {
      }
      else {
        router.push('/new_user/new')
      }
    })
    .catch(function (error) { });
}

// if (store.state.user.auth == true) {
//   router.push(store.state.user.route)
// }


  watch(isLoading, () => {
    if (isLoading._value == false & isAuthenticated._value == true) {
      authenticate();
    }
  }, { immediate: true })

</script>
