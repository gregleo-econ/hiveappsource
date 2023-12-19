<template>
    <div class="splash-page">
        <div class="splash-content">
            <CCard color="primary" style="width:500px">
                <CCardBody>
                    <CCardTitle>
                        <h1 style="color:black">Welcome To:</h1>
                    </CCardTitle>
                    <img src='@/assets/brand/hive_logo_white_fill.svg' alt="Hive Logo" class="logo" style="width:250px" />
                    <template v-if="!store.state.user.auth">
                        <br />
                        <br />
                        <CCardFooter>
                            <CCol>
                                <SignupButton variant="outline"
                                    style="width:100px; font-size:20px; color:black; margin:10px; background-color:white; border: 2px solid black;" />
                                <LoginButton variant="outline"
                                    style="width:100px; font-size:20px; color:black; margin:10px; background-color:white; border: 2px solid black;" />
                            </CCol>
                        </CCardFooter>
                    </template>
                    <template v-if="store.state.user.auth">
                        <br />
                        <br />
                        <CCardFooter>
                            <CCardText>
                                <h5>Logged in as {{ store.state.user.email }}</h5>
                            </CCardText>
                            <CAvatar :src='store.state.user.picture' size="xl" />
                            <LogoutButton variant="outline"
                                style="width:100px; font-size:20px; color:black; margin:10px; background-color:white; border: 2px solid black;" />
                        </CCardFooter>
                    </template>
                </CCardBody>
            </CCard>
        </div>
    </div>
</template>
<script setup>
import LoginButton from "@/components/auth/LoginButton.vue";
import LogoutButton from "@/components/auth/LogoutButton.vue";
import SignupButton from "@/components/auth/SignupButton.vue";
import { CCardTitle } from "@coreui/vue";
import { useStore } from "vuex";
const store = useStore();

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
    display: contents
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
}</style>
  