<template>
  <CHeader position="sticky" class="mb-4">
    <CContainer fluid>
      <CHeaderToggler class="ps-1" @click="$store.commit('toggleSidebar')">
        <CIcon icon="cil-menu" size="lg" />
      </CHeaderToggler>
      <img v-bind:src="require('@/assets/brand/hive_logo.svg')" style="width: 50px"/> 
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
        <template v-if=!isAuthenticated>
          <SignupButton />
          <LoginButton />
        </template>
        <template v-if=isAuthenticated>
          <LogoutButton />
        </template>
        <template v-if=isAuthenticated>
          <CDropdown variant="dropdown">
            <CDropdownToggle placement="bottom-end" class="py-0" :caret="false">
            <CAvatar size="md" :src="user.picture"  />
            </CDropdownToggle>
            <CDropdownMenu class="pt-0">
            <CDropdownHeader component="h6" class="bg-light fw-semibold py-2">
            Settings
            </CDropdownHeader>
            <CDropdownItem> <CIcon icon="cil-user" /> Profile </CDropdownItem>
            <CDropdownDivider />
            </CDropdownMenu>
          </CDropdown>
        </template>
      </CHeaderNav>
    </CContainer>
    <CHeaderDivider />
    <CContainer fluid>
      <AppBreadcrumb />
    </CContainer>
  </CHeader>
</template>

<script setup>
import LoginButton from "@/components/login-button.vue";
import LogoutButton from "@/components/logout-button.vue";
import SignupButton from "@/components/signup-button.vue";

import AppBreadcrumb from './AppBreadcrumb'
import AppHeaderDropdownAccnt from './AppHeaderDropdownAccnt'
import { useAuth0 } from '@auth0/auth0-vue';
const { user, isAuthenticated } = useAuth0();
const name = 'AppHeader'
const components = {
    AppBreadcrumb,
    AppHeaderDropdownAccnt,
  }
</script>
