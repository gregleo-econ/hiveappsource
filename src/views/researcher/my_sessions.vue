<template :v-if="redraw_table">
    <CModal :visible="showConfirmation" @close="() => { showConfirmation = false }">
        <CModalHeader>
            <CModalTitle>Low Balance</CModalTitle>
        </CModalHeader>
        <CModalBody>
            Are you sure you want to confirm all payments for this session? <br /><br />
            For this session, you will need: ${{ neededFunds.toFixed(2) }}.<br /><br />
            You have: ${{ balance.toFixed(2) }}
        </CModalBody>
        <CModalFooter>
            <CButton color="success" @click="confirm_all(info, touches)">
                Confirm
            </CButton>
            <CButton color="danger" @click="() => { showConfirmation = false }">
                Cancel
            </CButton>
        </CModalFooter>
    </CModal>
    <!-- Error modal for low balance on session start -->
    <CModal :visible="lowBalanceError" @close="() => { lowBalanceError = false }">
        <CModalHeader>
            <CModalTitle>Low Balance</CModalTitle>
        </CModalHeader>
        <CModalBody>
            Your research fund balance is too low to start this session. <br /><br />
            You must have at least 50% of the total expected session cost in research funds to start the
            session.<br /><br />
            For this session, you will need: ${{ neededFunds.toFixed(2) }}.<br /><br />
            You have: ${{ balance.toFixed(2) }}
        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="() => { lowBalanceError = false }">
                Close
            </CButton>
        </CModalFooter>
    </CModal>
    <!-- Error modal for low balance on payment confirmation -->
    <CModal :visible="insufficientFundsError" @close="() => { insufficientFundsError = false }">
        <CModalHeader>
            <CModalTitle>Low Balance</CModalTitle>
        </CModalHeader>
        <CModalBody>
            You do no have sufficient funds for this payment.
            <br /><br />
            Selected Payment: ${{ neededFunds.toFixed(2) }}.<br /><br />
            You have: ${{ balance.toFixed(2) }}
        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="() => { insufficientFundsError = false }">
                Close
            </CButton>
        </CModalFooter>
    </CModal>
    <CNav variant="tabs" role="tablist" style="border:0px;">
        <CNavItem>
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 1" @click="() => { tabPaneActiveKey = 1 }">
                Sessions Table
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 2" @click="() => { tabPaneActiveKey = 2 }">
                Detail for {{ info.internal_session_name }}
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 3" @click="() => { tabPaneActiveKey = 3 }">
                Participant Detail for {{ info.internal_session_name }}
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_edit">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 4" @click="() => { tabPaneActiveKey = 4 }">
                Edit {{ info.internal_session_name }}
            </CNavLink>
        </CNavItem>
    </CNav>
    <CTabContent>
        <CTabPane key="sessionTableKey" role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
            <CCard class="mb-4 border">
                <CCardBody>
                    <EasyDataTable v-if="showItems" alternating header-class-name="customize-table-header"
                        header-item-class-name="customize-table-header-item" table-class-name="customize-table"
                        header-text-direction="center" body-text-direction="center" :headers="headers" :items="items">
                        <template #item-status="item">
                            <span v-if="item.status == 'running'" class="text-success">running</span>
                            <span v-else-if="item.status == 'paused'" class="text-warning">paused</span>
                            <span v-else class="text-warning">{{ item.status }}</span>
                        </template>
                        <template #item-created="item">
                            {{ format_date(item.created * 1000) }}

                        </template>
                        <template #item-detail="item">
                            <CButton color="primary" size="sm" v-on:click='info_experiment(item)'>Detail
                            </CButton>
                        </template>

                    </EasyDataTable>


                </CCardBody>
            </CCard>
        </CTabPane>
        <CTabPane role="tabpanel" v-if="show_detail" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 2">
            <CCard>
                <CCardBody>
                    <CRow>
                        <CCol :sm="2">
                            <CCard color="dark" style="height:100%; color:white">
                                <CCardHeader style="font-weight:bold;">Actions</CCardHeader>

                                <CCardBody style="display:contents;">


                                    <CButton style="margin:10px;" color="primary" size="sm" v-on:click='closeDetail'>Close
                                        Detail</CButton>

                                    <CButton style="margin:10px;" v-if="info.status != 'running'" size="sm" color="primary"
                                        v-on:click='edit_experiment(info)'>
                                        Edit
                                    </CButton>

                                    <CButton style="margin:10px;" v-if="info.status == 'running'" size="sm" color="warning"
                                        v-on:click='change_experiment_status(info, "paused")'>
                                        Pause
                                    </CButton>

                                    <CButton style="margin:10px;" v-if="info.status == 'paused' | info.status == 'pending'"
                                        size="sm" color="success" v-on:click='change_experiment_status(info, "running")'>
                                        Start
                                    </CButton>

                                </CCardBody>
                            </CCard>


                        </CCol>
                        <CCol :sm="10">

                            <CRow>
                                <CCol :sm="4">
                                    <CCardTitle>
                                        <h1>{{ info.internal_session_name }}</h1>
                                    </CCardTitle>
                                </CCol>
                                <CCol :sm="3">

                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Project</CCardHeader>
                                        <CCardBody>
                                            <span v-if="info.project_id == 0">No Project</span>
                                            <span v-if="info.project_id > 0">Project #{{ info.project_id }}</span>
                                        </CCardBody>
                                    </CCard>


                                </CCol>

                                <CCol :sm="3">

                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Status</CCardHeader>
                                        <CCardBody>
                                            <span v-if="info.status == 'running'" class="text-success">running</span>
                                            <span v-else-if="info.status == 'paused'" class="text-warning">paused</span>
                                            <span v-else class="text-warning">{{ info.status
                                            }}</span>
                                        </CCardBody>
                                    </CCard>


                                </CCol>

                                <CCol :sm="2">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Session ID</CCardHeader>
                                        <CCardBody>
                                            <CCardText>{{ info.session_id }}</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <br />
                            <CRow>
                                <CCol :sm="4">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Experiment Names</CCardHeader>
                                        <CCardBody>
                                            <CCardTitle>{{ info.internal_session_name }} </CCardTitle>
                                            <b>External Session Name: </b>{{ info.external_session_name }}
                                        </CCardBody>
                                    </CCard>
                                </CCol>

                                <CCol :sm="8">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Progress</CCardHeader>
                                        <CCardBody>
                                            <CCardTitle>{{ 100 * info.completed / info.quota }}% Completed</CCardTitle>
                                            <CProgress class="mb-3">
                                                <CProgressBar color="success" variant="striped" animated
                                                    :value="100 * info.completed / info.quota">{{ 100 * info.completed /
                                                        info.quota
                                                    }}
                                                </CProgressBar>
                                            </CProgress>
                                            <CCardText>{{ info.completed }} out of {{ info.quota }} participants.
                                            </CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <br />
                            <CRow>
                                <CCol :sm="6">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Cost</CCardHeader>
                                        <CCardBody>
                                            <CCardTitle>${{ info.total_paid }} Total</CCardTitle>
                                            {{ info.completed > 0 ? '$' + info.total_paid / info.completed : 'NA' }} average
                                            earned
                                            per
                                            participant.<br />
                                            <br />
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                <CCol :sm="6">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Estaimted Earnings</CCardHeader>
                                        <CCardBody>
                                            <CCardTitle>Average per Participant: ${{ info.participation_fee +
                                                info.average_pay }}
                                            </CCardTitle>
                                            <b>Participation Fee:</b> ${{ info.participation_fee }}<br />
                                            <b>Estimated Additional Earnings:</b> ${{ info.average_pay }}
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <BR />
                            <CRow>
                                <CCol>
                                    <CCard text-color="dark" class="mb-4 border">
                                        <CCardHeader style="font-weight:bold;">Session Description</CCardHeader>
                                        <CCardBody>
                                            <CCardText>
                                                {{ info.external_description }}
                                            </CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol>
                                    <CCard text-color="dark" class="mb-4 border">
                                        <CCardHeader style="font-weight:bold;">Eligibility Filter</CCardHeader>
                                        <CCardBody>
                                            <CCardText>
                                                {{ info.pool_filter }}
                                            </CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <CRow>
                                <CCol>
                                    <CCard text-color="dark" class="mb-4 border">
                                        <CCardHeader style="font-weight:bold;">API Integration</CCardHeader>
                                        <CCardBody>
                                            <CCardText>
                                                <b>Use the command below to log participant completeion. </b>
                                                <br />
                                                <br />
                                                <pre
                                                    style="white-space:pre-line;">curl -X POST "https://127.0.0.1:9685/experiment/finish_experiment?my_participant_id=[[ENTER PARTICIPANT ID HERE]]&session_id={{ info.session_id }}&payment=[ENTER PAYMENT HERE]" -H "accept: */*" -d ""</pre>
                                            </CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </CTabPane>
        <CTabPane role="tabpanel" v-if="show_detail" aria-labelledby="contact-tab" :visible="tabPaneActiveKey === 3">
            <CCard class="mb-4 border">
                <CCardBody>
                    <CCardTitle> Subject Detail </CCardTitle>

                    <CRow>
                        <CCol :sm="10">
                            <div style="width:200px; margin-bottom:10px;">
                        <span>Search by Participant ID #: </span>
                        <input type="text" v-model="participant_id_search_value">
                    </div>

                        </CCol>
                        <CCol :sm="2">
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="success" align="right" v-on:click='confirm_all_confirmation(info, touches)'>Confirm
                            All</CButton>
                    </div>

                        </CCol>
                    </CRow>
                    <EasyDataTable alternating header-class-name="customize-table-header"
                        header-item-class-name="customize-table-header-item" table-class-name="customize-table"
                        header-text-direction="center" body-text-direction="center" :headers="headers_touches" 
                        :items="touches" search-field="participant_id" :search-value="participant_id_search_value">

                        <template #item-duration="item">
                            <span v-if="item.status != 'started' & item.end_time>0" class="text-center">
                                {{Math.round(100 * (1 / 60) * (item.end_time - item.start_time)) / 100 }} Minutes
                            </span>
                            <span v-if="item.status != 'started' & item.end_time==0" class="text-center">
                                Unknown
                            </span>
                            <span v-if="item.status == 'started'" class="text-center">
                                NA
                            </span>
                        </template>
                        <template #item-confirm="item">
                            <CButton v-if="item.status == 'finished'" color="success"
                                v-on:click='confirm_subject(info, item)'>
                                Confirm
                            </CButton>
                        </template>
                        <template #item-reject="item">
                            <CButton v-if="item.status == 'finished'" color="danger"
                                v-on:click='reject_subject(info, item)'>
                                Reject
                            </CButton>
                        </template>
                        <template #item-status="item">
                            <span class="text-bg-dark text-success" style="padding:3px; border-radius: 3px;" v-if="item.status == 'confirmed'">Confirmed</span>
                            <span class="text-bg-dark text-primary" style="padding:3px; border-radius: 3px;" v-else-if="item.status == 'running'">Running</span>
                            <span class="text-bg-dark text-primary" style="padding:3px; border-radius: 3px;" v-else-if="item.status == 'finished'">Finished</span>
                            <span class="text-bg-dark text-danger" style="padding:3px; border-radius: 3px;" v-else-if="item.status == 'rejected'">Rejected</span>
                            <span class="text-bg-dark text-primary" style="padding:3px; border-radius: 3px;" v-else>{{ item.status }}</span>
                        </template>
                    </EasyDataTable>
                    <BR />
                    
                    <CButton color="primary" v-on:click='get_receipt()'>Get Receipt</CButton>
                </CCardBody>
            </CCard>
            <CCard class="mb-4 border">
                <CCardHeader style="font-weight:bold;"> Manual Payment Input </CCardHeader>
                <CCardBody>
                    <CFormTextarea v-model="csvInput" label="CSV Input of Payments" rows="3"
                        text="Each row should be of the form: subject_id, payment "></CFormTextarea>
                    <CButton color="success" v-on:click='manual_input()'>Submit
                    </CButton>
                </CCardBody>
            </CCard>
        </CTabPane>
        <CTabPane role="tabpanel" v-if="show_edit" aria-labelledby="edit-tab" :visible="tabPaneActiveKey === 4">
            <CCard>
                <CCardBody>
                    <CRow>
                        <CCol sm="10">
                            <CCardTitle>Edit {{ info.internal_session_name }}</CCardTitle>
                        </CCol>
                        <CCol sm="2" style="text-align:right">
                            <CButton color="primary" size="sm" v-on:click='closeDetail'>Close this Form</CButton>
                        </CCol>
                    </CRow>
                    <BR />

                    <sessionInfo :key="componentKey" v-if="show_edit" @editSubmit="update_session_table"
                        :sessionData="info" :new="false">
                    </sessionInfo>
                </CCardBody>
            </CCard>
        </CTabPane>
    </CTabContent>
    <loadingAnimation v-if="showLoading"></loadingAnimation>
</template>
<div id="app">
</div>
<script setup>
import { ref } from 'vue'
import { marked } from 'marked';
import sessionInfo from '@/components/SessionInfo.vue'
import { CCardBody } from '@coreui/vue';
import * as DataFunctions from '@/services/GetData.js'
import html2pdf from "html2pdf.js";


const info = ref({})
const items = ref({})
const show_detail = ref(false)
const show_edit = ref(false)
const touches = ref({})
const tabPaneActiveKey = ref(1)
const balance = ref(0)
const lowBalanceError = ref(false)
const insufficientFundsError = ref(false)
const showConfirmation = ref(false)
const neededFunds = ref(0)
const csvInput = ref("")
const componentKey = ref(0)
const showLoading = ref(true)
const showItems = ref(false)
const participant_id_search_value = ref()

const sessionTableKey = ref(1)


const headers = [
    { text: "Detail", value: "detail", sortable: false },
    { text: "Session Id", value: "session_id", sortable: true },
    { text: "Internal Name", value: "internal_session_name", sortable: true },
    { text: "External Name", value: "external_session_name", sortable: true },
    { text: "Date Created", value: "created", sortable: true },
    { text: "Quota", value: "quota", sortable: true },
    { text: "# Completed", value: "completed", sortable: true },
    { text: "Total $ Paid", value: "total_paid", sortable: true },
    { text: "Status", value: "status", sortable: true },
]

const headers_touches = [

    { value: "participant_id", text: "Participant ID #", sortable: true },
    { value: "duration", text: "Duration", sortable: true },
    { value: "participation_fee", text: "Participation Fee", sortable: true },
    { value: "payment", text: "Additional Pay", sortable: true },
    { value: "status", text: "Status", sortable: true },
    { value: "confirm", text: "Confirm?", sortable: true },
    { value: "reject", text: "Reject?", sortable: true },

]



const format_date = function (date_string) {
    var date = new Date(date_string);
    return date.toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
}


const info_experiment = async function (item) {
    show_edit.value = false;
    info.value = item;
    touches.value = await DataFunctions.ResearcherGetTouchesForSession(item.session_id).then(res => res.data)
    show_detail.value = true;
    componentKey.value += 1;
    tabPaneActiveKey.value = 2
}

const edit_experiment = function (item) {
    show_detail.value = false;
    show_edit.value = true;
    info.value = item;
    componentKey.value += 1;
    tabPaneActiveKey.value = 4;
}

const update_session_table = async function () {
    show_detail.value = false;
    tabPaneActiveKey.value = 1;
    
    showLoading.value = true
    items.value = await DataFunctions.ResearcherGetHistoryResearcher().then(res => res.data)
    showItems.value = true
    sessionTableKey.value += 1;
    showLoading.value = false
}

const update_info_experiment = async function (item) {
    info.value = item;
    touches.value = await DataFunctions.ResearcherGetTouchesForSession(item.session_id).then(res => res.data)
}

const change_experiment_status = async function (session, status) {
    balance.value = await checkBalance()
    const expectedCost = (session.average_pay + session.participation_fee) * (session.quota - session.completed)
    neededFunds.value = expectedCost * 0.5
    if (neededFunds.value >= balance.value + 0.01 && status == "running") {
        lowBalanceError.value = true
    }
    else {
        await DataFunctions.ResearcherChangeExperimentStatus(session.session_id, status)
        update_session_table()
    }
}

const confirm_subject = async function (session, participant) {
    balance.value = await checkBalance()
    if (participant.participation_fee + participant.payment <= balance.value) {
        await DataFunctions.ResearcherChangeTouchStatus(session.session_id, participant.participant_id, "confirmed")
        update_info_experiment(session)
    }
    else {
        neededFunds.value = participant.participation_fee + participant.payment
        insufficientFundsError.value = true
    }
}

const confirm_all_confirmation = async function (session, participants) {
    balance.value = await checkBalance()
    let cost = 0
    for (let i = 0; i < participants.length; i++) {
        let participant = participants[i]
        if (participant.status == "finished") {
            cost = cost + participant.participation_fee + participant.payment
        }
    }
    if (cost <= balance.value) {
        neededFunds.value = cost
        showConfirmation.value = true
    }
    else {
        neededFunds.value = cost
        insufficientFundsError.value = true
    }
}

const confirm_all = async function (session, participants) {
    showConfirmation.value = false
    balance.value = await checkBalance()
    let cost = 0
    for (let i = 0; i < participants.length; i++) {
        let participant = participants[i]
        if (participant.status == "finished") {
            cost = cost + participant.participation_fee + participant.payment
        }
    }
    if (cost <= balance.value) {
        await DataFunctions.ResearcherConfirmAll(session.session_id)
        update_info_experiment(session)
    }
    else {
        neededFunds.value = cost
        insufficientFundsError.value = true
    }
}
const manual_input = async function () {
    await DataFunctions.ResearcherManuallyConfirm(info.value.session_id, csvInput.value)
    update_info_experiment(info.value)
}

const reject_subject = async function (session, participant) {
    await DataFunctions.ResearcherChangeTouchStatus(session.session_id, participant.participant_id, "rejected")
    update_info_experiment(session)
}

const getPdf = function () {
    html2pdf(marked.parse(markdown.value), {
        margin: 10,
        filename: "hive_prereg_id" + props.project.project_id + ".pdf",
    });

}

const get_receipt = async function(){
    
    const receipt = await DataFunctions.ResearcherGetReceipt(info.value.session_id).then(res => res.data)
    
    html2pdf(marked.parse(receipt[0]), {
        margin: 10,
        filename: "hive_receipt_session_" + info.value.session_id + ".pdf",
    });
}

update_session_table();

const checkBalance = async function (filter) {
    return new Promise((balance) => {
        DataFunctions.UsersGetFunds()
            .then(res => {
                balance(res.data[0]);
            });
    })
}
balance.value = checkBalance()


const closeDetail = async function () {
    info.value = {}
    show_detail.value = false
    show_edit.value = false
    tabPaneActiveKey.value = 1
}


</script>
