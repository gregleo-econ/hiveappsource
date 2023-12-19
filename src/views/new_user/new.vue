<template>
    <div class="splash-page">
        <div class="splash-content">
        <CRow>
            <CCol>
<CCard class="text-center" >
<CCardBody>
    <CCardTitle>New Participant</CCardTitle>
Click below to register. 
<br/><br/>
<CButton component="a" color="primary" href='/app/new_user/new_participant'>New Participant</CButton>
</CCardBody>
</CCard>
</CCol>
<CCol>
    <CCard class="text-center" >
<CCardBody>
    <CCardTitle>New Researcher</CCardTitle>
    E-mail us at <a style="color:blue" href="mailto:contact@econhive.com">contact@econhive.com</a> requesting access. 
    <br/><br/>
    <CButton component="a" color="primary" href='mailto:contact@econhive.com'>E-Mail US</CButton>
</CCardBody>
</CCard>
</CCol>
</CRow>    
               
        </div>
        
    </div>
    
</template>
  
<script setup>
import LoginButton from "@/components/auth/LoginButton.vue";
import LogoutButton from "@/components/auth/LogoutButton.vue";
import SignupButton from "@/components/auth/SignupButton.vue";
</script>
  
<style scoped>
.splash-page {
    display: flex;
    justify-content: center;
    align-items: center;
}
.logo {
    width: 100%;
    max-width: 400px;
    height: auto;
}
.white-text {
    color: white;
}
.splash-content {
    text-align: center;
    padding: 20px;
    width: 100%;
    
}
.description {
    font-size: 1.2em;
    margin-bottom: 20px;
    margin: auto;
    max-width: 1000px;
}
.feature-columns {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
}
.feature-column {
    flex: 1;
    padding: 0 20px;
}
.feature-title {
    font-size: 1.5em;
    margin-bottom: 10px;
}
.feature-list,
.feature-list-light {
    width: 100%;
    border-collapse: collapse;
    margin: 10px
}
.feature-list td {
    padding: 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.feature-list-light td {
    padding: 8px;
    border-bottom: 1px solid rgba(0, 0, 0, 1);
}
.feature-list td:first-child {
    width: 30%;
    font-weight: bold;
}
.cta-button {
    display: inline-block;
    margin-top: 30px;
    padding: 10px 20px;
    font-size: 1.2em;
    color: #fff;
    background-color: #0056b3;
    border: none;
    border-radius: 5px;
    text-decoration: none;
}
.cta-button:hover {
    background-color: #003a80;
}
</style>
  