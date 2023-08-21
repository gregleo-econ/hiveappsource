<template>
    <loadingAnimation v-if="showLoading"></loadingAnimation>
    <template v-if="!showLoading">

        <CCard>
            <CCardHeader color="primary">Summary</CCardHeader>
            <CCardBody>
                <CRow>
                    <CCol :sm="4">
                        <div class="border-start border-start-4 border-start-primary py-1 px-3 mb-3">
                            <div class="text-medium-emphasis small">Total Earned</div>
                            <div class="fs-5 fw-semibold">${{ history.total }}</div>
                        </div>
                    </CCol>
                    <CCol :sm="4">
                        <div class="border-start border-start-4 border-start-primary py-1 px-3 mb-3">
                            <div class="text-medium-emphasis small">
                                Total Earned Last 90 Days
                            </div>
                            <div class="fs-5 fw-semibold">${{ history.total_90 }}</div>
                        </div>
                    </CCol>

                    <CCol :sm="4">
                        <div class="border-start border-start-4 border-start-primary py-1 px-3 mb-3">
                            <div class="text-medium-emphasis small">
                                Experiments Completed
                            </div>
                            <div class="fs-5 fw-semibold">{{ history.completed }}</div>
                        </div>
                    </CCol>
                </CRow>


            </CCardBody>
        </CCard>
        <BR />

        <CNav variant="tabs" role="tablist">
            <CNavItem>
                <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 1"
                    @click="() => { tabPaneActiveKey = 1 }">
                    Past Studies Table
                </CNavLink>
            </CNavItem>
            <CNavItem v-if="show_detail">
                <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 2"
                    @click="() => { tabPaneActiveKey = 2 }">
                    Detail for {{ info.external_study_name }}
                </CNavLink>
            </CNavItem>
        </CNav>

        <CTabContent>
            <CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
                <CRow>
                    <CCol :md="12">
                        <CCard class="mb-4 border">
                            <CCardHeader> Past Studies </CCardHeader>
                            <CCardBody>
                                <CTable align="middle" class="mb-0 border" hover responsive>
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell class="text-center">More Info</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">ID #</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Title</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Participation Fee</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Additional Payment</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Status</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Date</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Duration</CTableHeaderCell>

                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        <CTableRow v-for="item in items" :key="item.name">
                                            <CTableDataCell class="text-center">
                                                <CButton color="primary" size="sm" v-on:click="info_experiment(item)">
                                                    Info
                                                </CButton>
                                            </CTableDataCell>
                                            <CTableDataCell class="text-center">{{
                                                item.experiment_id
                                            }}</CTableDataCell>
                                            <CTableDataCell class="text-center"><strong>{{
                                                item.external_study_name
                                            }}</strong></CTableDataCell>
                                            <CTableDataCell class="text-center">${{ item.payment }}</CTableDataCell>
                                            <CTableDataCell class="text-center">${{ item.participation_fee_participant }}
                                            </CTableDataCell>
                                            <CTableDataCell v-if="item.status_participant == 'confirmed'"
                                                class="text-center">
                                                <span class="text-success">confirmed</span>
                                            </CTableDataCell>
                                            <CTableDataCell v-else-if="item.status_participant == 'started'"
                                                class="text-center"><span class="text--primary">started</span>
                                            </CTableDataCell>
                                            <CTableDataCell v-else class="text-center"><span class="text-warning">{{
                                                item.status_participant
                                            }}</span></CTableDataCell>
                                            <CTableDataCell class="text-center">{{
                                                format_date(item.start_time * 1000)
                                            }}</CTableDataCell>
                                            <CTableDataCell
                                                v-if="item.status_participant == 'confirmed' || item.status_participant == 'finished'"
                                                class="text-center">{{
                                                    ((item.end_time - item.start_time) * (1 / 60)).toFixed(2)
                                                }}
                                                minute(s)</CTableDataCell>
                                            <CTableDataCell v-else class="text-center">NA</CTableDataCell>

                                        </CTableRow>
                                        <CTableRow> </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CTabPane>
            <CTabPane role="tabpanel" aria-labelledby="detail-tab" :visible="tabPaneActiveKey === 2">
                <CRow>
                    <CCol :md="12">
                        <CCard v-show="show_detail" text-color="dark" class="mb-4 border">
                            <CCardHeader>Detail for {{ info.external_study_name }}</CCardHeader>
                            <CCardBody>
                                <CCardText>
                                    <strong>Study Description:</strong><br />
                                    {{ info.external_description }}
                                </CCardText>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CTabPane>
        </CTabContent>
    </template>
</template>

<div id="app">




</div>

<script setup>
import { CButton, CCard, CTabPane } from '@coreui/vue';
import axios from 'axios'
import { ref } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const items = ref({})
const history = ref({})
const info = ref({})
const show_detail = ref(false)
const tabPaneActiveKey = ref(1)
const showLoading = ref(true)

axios
    .get(
        'http://econhive.com/api/subject/get_history?my_email=' +
        store.state.user.email,
    )
    .then((res) => {
        items.value = res.data

        axios
            .get(
                'http://econhive.com/api/subject/get_history_summary?my_email=' +
                store.state.user.email,
            )
            .then((res) => {
                history.value = res.data[0]
                showLoading.value = false
            })
    })


const format_date = function (date_string) {
    var date = new Date(date_string)
    return date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    })
}

const info_experiment = function (item) {
    console.log(item)
    axios
        .get(
            'http://econhive.com/api/subject/get_experiment_info?my_experiment_id=' +
            item.experiment_id,
        )
        .then((res) => {
            info.value = res.data[0]
            show_detail.value = true;
            tabPaneActiveKey.value = 2
        })
}
</script>
