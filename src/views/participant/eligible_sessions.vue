<template>
    <loadingAnimation v-if="showLoading"></loadingAnimation>
    <CRow :md="{ cols: 1, gutter: 6 }" :lg="{ cols: 2 }">
        <CCol xs v-for="item in items">
            <CCard text-color="dark" class="mb-3 border">
                <CCardHeader component="h5">{{ item.external_session_name }}</CCardHeader>
                <CCardBody>
                    <CRow>
                        <CCol sm="12" style="text-align: center;">
                            <CCard color="dark" text-color="white">
                                <CCardBody>
                                    <h5>
                                        <CIcon icon="cilClock" size="xxl" />
                                        {{ item.session_duration }} minute(s)
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
                                <h5>Session Description</h5>
                            </CAccordionHeader>
                            <CAccordionBody>
                                {{ item.external_description }}
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>
                    <hr class="border opacity-100">
                    <CButton color="primary" v-on:click='start_experiment(item)'>Start Session</CButton>
                </CCardBody>
            </CCard>
        </CCol>
    </CRow>
</template>
<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore();
const items = ref(null)
const showLoading = ref(true)
import * as DataFunctions from '@/services/GetData.js'

const get_eligible_experiments = async function () {
    DataFunctions.SubjectGetExperimentInfoForEligibleSessions()
        .then(res => {
            
            items.value = res.data;
            showLoading.value = false
        })
}

get_eligible_experiments()

const start_experiment = async function (item) {
    const id = await DataFunctions.GetId(item.session_id).then(res => res.data)
    await DataFunctions.SubjectStartExperiment(item.session_id)
    window.open(item.session_url+"?participant_id="+id)
    get_eligible_experiments()
}
</script>