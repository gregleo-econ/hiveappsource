<template>
<loadingAnimation v-if="showLoading"></loadingAnimation>
    <CRow :md="{ cols: 1, gutter: 6 }" :lg="{ cols: 2 }">

        <CCol xs v-for="item in items">
            <CCard text-color="dark" class="mb-3 border">
                <CCardHeader component="h5">{{ item.external_study_name }}</CCardHeader>
                <CCardBody>
                    <CRow>

                        <CCol sm="4" style="text-align: center;">
                            <img :src="item.logo_url" style="width: 80%; max-width: 150px; margin-bottom: 5px">
                        </CCol>
                        <CCol sm="8" style="text-align: center;">
                            <CCard color="dark" text-color="white">
                                <CCardBody>
                                    <h5>
                                        <CIcon icon="cilClock" size="xxl" />
                                        {{ item.study_duration }} minute(s)
                                    </h5>
                                    <h5>
                                        <strong>${{ item.participation_fee }}</strong> for
                                        participating
                                    </h5>
                                    <h5>
                                        <strong>${{ item.average_pay }}</strong> average
                                        additional
                                        earnings.
                                    </h5>
                                </CCardBody>
                            </CCard>
                        </CCol>

                    </CRow>
                    <br />
                    <CAccordion>
                        <CAccordionItem :item-key="1">
                            <CAccordionHeader>
                                <h5>Study Description</h5>
                            </CAccordionHeader>
                            <CAccordionBody>
                                {{ item.external_description }}
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>

                    <hr class="border opacity-100">
                    <CButton color="primary" v-on:click='start_experiment(item)'>Start Study</CButton>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>




<script setup>
import { CCardBody, CCardTitle } from '@coreui/vue';
import axios from 'axios'
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore();
const items = ref(null)
const info = ref(null)
const showLoading = ref(true)


axios
    .get('http://127.0.0.1:9985/api/subject/get_experiment_info_for_eligible_sessions?my_email=' + store.state.user.email)
    .then(res => {
        items.value = res.data;
        showLoading.value = false
    })


const start_experiment = function (item) {
    axios
        .post('http://127.0.0.1:9985/api/subject/start_experiment?my_experiment_id=' + item.id + '&my_email=' + store.state.user.email),
        window.open(item.study_url);

    axios
        .get('http://127.0.0.1:9985/api/subject/get_experiment_info_for_eligible_sessions?my_email=' + store.state.user.email)
        .then(res => {
            items.value = res.data;
        })

}



</script>