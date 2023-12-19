<template>
  <CSidebar position="fixed" :visible="store.state.sidebarVisible" @visible-change="(event) =>
      $store.commit({
        type: 'updateSidebarVisible',
        value: event,
      })
    ">
    <!-- <CSidebarBrand>Main Menu</CSidebarBrand> -->
    <CSidebarNav v-if="store.state.user.role == ''">
      <li class="nav-title">Main Menu</li>
      <CNavGroup>
        <template #togglerContent>
          <CIcon customClassName="nav-icon" icon="cilViewQuilt" /> Community
        </template>
        <hiveNavLink link='/community/projects' icon="cilObjectGroup" name="Public Projects" />
      </CNavGroup>
      <CNavItem href='http://econhive.com'>
        <CIcon customClassName="nav-icon" icon="cil-check" />
        About
      </CNavItem>
      <li class="nav-title">Connect</li>
      <CNavItem href='mailto:contact@econhive.com'>
        <CIcon customClassName="nav-icon" icon="cil-envelope-closed" />
        Contact Us
      </CNavItem>
      <CNavItem href='https://twitter.com/hiveecon'>
        <CIcon customClassName="nav-icon" icon="cib-twitter" /> HIVE Twitter
      </CNavItem>
    </CSidebarNav>
    <CSidebarNav v-else-if="store.state.user.role == 'participant'">
      <li class="nav-title">Participant</li>
      <hiveNavLink icon="cil-check" link="/participant/eligible_sessions" name="Eligible Sessions" />
      <hiveNavLink link='/participant/past_sessions' icon="cil-clipboard" name="Past Sessions" />
      <hiveNavLink link='/participant/profile' icon="cil-contact" name="Profile / Preferences" />
      <li class="nav-title">Connect</li>
      <CNavItem href='mailto:contact@econhive.com'>
        <CIcon customClassName="nav-icon" icon="cil-envelope-closed" />
        Contact Us
      </CNavItem>
      <CNavItem href='https://twitter.com/hiveecon'>
        <CIcon customClassName="nav-icon" icon="cib-twitter" /> HIVE Twitter
      </CNavItem>
    </CSidebarNav>
    <CSidebarNav v-else-if="store.state.user.role == 'researcher'">
      <li class="nav-title">Research</li>
      <CNavGroup>
        <template #togglerContent>
          <CIcon customClassName="nav-icon" icon="cilViewQuilt" /> Projects
        </template>
        <hiveNavLink link='/researcher/new_project' icon="cilNoteAdd" name="New Project" disabled />
        <hiveNavLink link='/researcher/my_projects' icon="cilNotes" name="My Projects" disabled />
      </CNavGroup>
      <CNavGroup>
        <template #togglerContent>
          <CIcon customClassName="nav-icon" icon="cilClipboard" /> Sessions
        </template>
        <hiveNavLink link='/researcher/new_session' icon="cilNoteAdd" name="New Session" />
        <hiveNavLink link='/researcher/my_sessions' icon="cilNotes" name="My Sessions" />
      </CNavGroup>
      <CNavGroup>
        <template #togglerContent>
          <CIcon customClassName="nav-icon" icon="cilViewQuilt" /> Community
        </template>
        <hiveNavLink link='/community/projects' icon="cilObjectGroup" name="Public Projects" />
      </CNavGroup>
      <hiveNavLink link='/researcher/manage_funds' icon="cilDollar" name="Research Funds" />
      <hiveNavLink link='/researcher/profile' icon="cilFace" name="My Profile" />
      <li class="nav-title">Connect</li>
      <CNavItem href='mailto:contact@econhive.com'>
        <CIcon customClassName="nav-icon" icon="cil-envelope-closed" />
        Contact Us
      </CNavItem>
      <CNavItem href='https://twitter.com/hiveecon'>
        <CIcon customClassName="nav-icon" icon="cib-twitter" /> HIVE Twitter
      </CNavItem>
    </CSidebarNav>
    <CSidebarNav v-else-if="store.state.user.role == 'new'">
      <li class="nav-title">New User</li>
      <hiveNavLink link='/new_user/new_participant' icon="cil-check" name="Register as Participant" />
      <CNavItem href='mailto:contact@econhive.com'>
        <CIcon customClassName="nav-icon" icon="cil-check" />
        Register as Researcher
      </CNavItem>
    </CSidebarNav>
  </CSidebar>
</template>
<script setup>

import { useStore } from 'vuex'
import hiveNavLink from '@/components/HiveNavLink.vue'
const store = useStore();


</script>
