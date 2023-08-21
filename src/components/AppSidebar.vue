<template>
  <CSidebar
    position="fixed"
    :unfoldable="sidebarUnfoldable"
    :visible="sidebarVisible"
    @visible-change="
      (event) =>
        $store.commit({
          type: 'updateSidebarVisible',
          value: event,
        })
    "
  >
  
  <!-- <CSidebarBrand>Main Menu</CSidebarBrand> -->
  <CSidebarNav v-if="store.state.user.role==''">
    <li class="nav-title">Main Menu</li> 
    <CNavItem href='#/participant/eligible_studies'>
      <CIcon  customClassName="nav-icon" icon="cil-check"/>
      About
    </CNavItem>
    <li class="nav-title">Connect</li>
    <CNavItem href='#/researcher/preferences'>
        <CIcon  customClassName="nav-icon" icon="cil-envelope-closed"/>
        Contact Us
    </CNavItem>
    <CNavItem href='https://twitter.com/hiveecon'>
      <CIcon customClassName="nav-icon" icon="cib-twitter"/> HIVE Twitter

    </CNavItem>
    
  </CSidebarNav>

  
  <CSidebarNav v-else-if="store.state.user.role=='participant'">
    <li class="nav-title">Participant</li> 
    <CNavItem href='#/participant/eligible_studies'>
      <CIcon  customClassName="nav-icon" icon="cil-check"/>
      Eligible Studies
    </CNavItem>
    <CNavItem href='#/participant/past_studies'>
        <CIcon  customClassName="nav-icon" icon="cil-clipboard"/>
        Past Studies
    </CNavItem>
    <CNavItem href='#/participant/profile'>
        <CIcon  customClassName="nav-icon" icon="cil-contact"/>
        Profile / Preferences
    </CNavItem>

    <li class="nav-title">Connect</li>
    <CNavItem href='#/researcher/preferences'>
        <CIcon  customClassName="nav-icon" icon="cil-envelope-closed"/>
        Contact Us
    </CNavItem>
    <CNavItem href='https://twitter.com/hiveecon'>

      <CIcon customClassName="nav-icon" icon="cib-twitter"/> HIVE Twitter
      

    </CNavItem>
    
  </CSidebarNav>

  <CSidebarNav v-else-if="store.state.user.role=='researcher'">
    <li class="nav-title">Research</li>
    
    <CNavGroup>
      <template #togglerContent>
        <CIcon  customClassName="nav-icon" icon="cilViewQuilt"/> Projects
      </template>
      <CNavItem href='#/researcher/new_project'>
      <CIcon  customClassName="nav-icon" icon="cilNoteAdd"/>
      New Project
    </CNavItem>
    <CNavItem href='#/researcher/my_studies'>
        <CIcon  customClassName="nav-icon" icon="cilNotes"/>
        My Projects
      </CNavItem>    </CNavGroup>
      <CNavGroup>
      <template #togglerContent>
        <CIcon  customClassName="nav-icon" icon="cilClipboard"/> Studies
      </template>
    <CNavItem href='#/researcher/new_study'>
      <CIcon  customClassName="nav-icon" icon="cilNoteAdd"/>
      New Study
    </CNavItem>
    <CNavItem href='#/researcher/my_studies'>
        <CIcon  customClassName="nav-icon" icon="cilNotes"/>
        My Studies
    </CNavItem> 
      </CNavGroup>
      <CNavGroup>
      <template #togglerContent>
        <CIcon  customClassName="nav-icon" icon="cilViewQuilt"/> Community
      </template>
    
      <CNavItem href='#/researcher/new_study'>
      <CIcon  customClassName="nav-icon" icon="cilCheck"/>
      Pre-Registration
    </CNavItem>
      <CNavItem href='#/researcher/new_study'>
      <CIcon  customClassName="nav-icon" icon="cilBarChart"/>
      Data
      <CBadge color="success ms-auto">NEW</CBadge>
    </CNavItem>
    <CNavItem href='#/researcher/new_study'>
      <CIcon  customClassName="nav-icon" icon="cilCode"/>
      Code 
      <CBadge color="success ms-auto">NEW</CBadge>
    </CNavItem>
    </CNavGroup>
    <CNavItem href='#/researcher/manage_funds'>
        <CIcon  customClassName="nav-icon" icon="cilDollar"/>
        Research Funds
    </CNavItem>
    <CNavItem href='#/researcher/preferences'>
        <CIcon  customClassName="nav-icon" icon="cilFace"/>
        My Profile
    </CNavItem>
    <li class="nav-title">Connect</li>
    <CNavItem href='#/researcher/preferences'>
        <CIcon  customClassName="nav-icon" icon="cil-envelope-closed"/>
        Contact Us
    </CNavItem>
    <CNavItem href='https://twitter.com/hiveecon'>
      <CIcon customClassName="nav-icon" icon="cib-twitter"/> HIVE Twitter

    </CNavItem>
    
   </CSidebarNav>

   <CSidebarNav v-else-if="store.state.user.role=='new'">
    <li class="nav-title">New User</li> 
    <CNavItem href='#/new_user/new_participant'>
      <CIcon  customClassName="nav-icon" icon="cil-check"/>
      Sign Up as Participant
    </CNavItem>

  </CSidebarNav>

  

</CSidebar>

  
</template>


<script setup>
import { watch, computed, ref } from 'vue';
import { useStore } from 'vuex'
const store = useStore();
import {
  CBadge,
  CSidebarNav,
  CNavItem,
  CNavGroup,
  CNavTitle,
} from '@coreui/vue'

const SVGLogo = require('@/assets/brand/hive_logo.svg');

const sidebarUnfoldable = computed(() => store.state.sidebarUnfoldable);
const sidebarVisible = computed(() => store.state.sidebarVisible);


</script>
