<template>
    <div class="splash-page">
        <div class="splash-content">
            <h1 class="logo-heading">

            </h1>
            <CRow>
                <CCol sm="4">
                    <img :src="logoSrc" alt="Hive Logo" class="logo" style="filter: invert(1)" />
                </CCol>
                <CCol style="color:whtie; display: flex; justify-content: center; align-items: center; " sm="8" >
                    <div style="font-size:24px; font-style:italic; margin: 10px; color:white;">Highly Integrated Virtual Environment for Experimental Social Science</div>

                    <!-- <p style="color:white; margin-top:30px"><i>{{ appDescription }}</i></p> -->


                </CCol>


<h2 style="color:white">Researcher Benefits 2</h2>
                <CRow :md="{ cols: 1, gutter: 6 }" :lg="{ cols: 3 }" style="margin-top: 10px; margin-bottom:20px;">

                    <CCol xs v-for="feature in researcherFeatures" :key="feature.title" style="margin-bottom:10px;">
                        <CCard color="dark" text-color="white" style="height:100%; margin-bottom: 10px;">
                            <CCardBody>
                                <CCardTitle>{{ feature.title }}</CCardTitle>
                                <CCardText>{{ feature.description }}</CCardText>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>


                <h2 style="color:white">Participant Benefits</h2>
                <CRow :md="{ cols: 1, gutter: 6 }" :lg="{ cols: 3 }" style="margin-top: 10px;">

                    <CCol xs v-for="feature in participantFeatures" :key="feature.title" style="margin-bottom:10px;">
                        <CCard color="white" text-color="dark" style="height:100%; margin-bottom: 10px;">
                            <CCardBody>
                                <CCardTitle>{{ feature.title }}</CCardTitle>
                                <CCardText>{{ feature.description }}</CCardText>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>



            </CRow>


            
        </div>
    </div>
</template>
  
<script>
import { CCardImage, CCardText } from '@coreui/vue';

export default {
    name: 'SplashPage',
    data() {
        return {
            appDescription: "HIVE offers an integrated and secure space for online experimental social science research. For researchers, Hive provides an innovative environment to create, extend, and manage research studies, with access to a diverse pool of participants. Participants can earn money while contributing to meaningful scientific studies while maintaining their privacy. Join Hive to be part of the future of collaborative social science research and make a real research impact.",
            researcherFeatures: [
                {
                    title: "Quick Launch",
                    description: "Quickly create and launch research studies."
                },
                {
                    title: "Student Participants",
                    description: "Access to thousands of student participants."
                },
                {
                    title: "Minimal Fees",
                    description: "Zero or minimal fees for eligible academic research studies."
                },
                {
                    title: "No Deception",
                    description: "Deception is never allowed on HIVE."
                },
                {
                    title: "Participant Data",
                    description: "Access basic participant data on demographics and standard preference batteries."
                },
                {
                    title: "Extend Studies",
                    description: "Extend previous studies using individually-linkable data."
                },
                {
                    title: "Automatic Payments",
                    description: "Automatically and easily assign participant payments."
                },
                {
                    title: "Secure Payments",
                    description: "Pay participants automatically and securely."
                },
            ],
            participantFeatures: [
                {
                    title: "Earn Money",
                    description: "Earn money participating in online research studies."
                },
                {
                    title: "Instant Payout",
                    description: "Funds Transfered via Paypal, Zelle, or Venmo after study completion."
                },
                {
                    title: "Privacy",
                    description: "Your name and identity are never revealed to researchers."
                },
                {
                    title: "Engaging",
                    description: "Intersting and engaging research studies run by professional academics."
                },
                {
                    title: "Safe",
                    description: "All studies are reviewed by relevant institutional review boards."
                },
                {
                    title: "Contribute",
                    description: "Contribute to science."
                },
            ],
            logoSrc: require('@/assets/brand/hive_logo.svg'),
        };
    },
    components: { CCardText, CCardImage }
}
</script>
  
<style scoped>
.splash-page {
    display: flex;
    justify-content: center;
    align-items: center;
}

.logo {
    width: 100%;
    max-width: 300px;
    height: auto;
}

.white-text {
    color: white;
}

.splash-content {
    text-align: center;
    padding: 20px;
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
  