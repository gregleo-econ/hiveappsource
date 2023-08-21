<template>
    <CModal :visible="showUploadErrors" @close="() => { showUploadErrors = false }">
        <CModalHeader>
            <CModalTitle>{{ uploadErrorList.length }} Error(s)</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div v-for="errorDescription in uploadErrorList">- {{ errorDescription }}</div>

        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="() => { showUploadErrors = false }">
                Close
            </CButton>
        </CModalFooter>
    </CModal>
    <CModal :visible="showUploadConfirm" @close="() => { showUploadConfirm = false }">
        <CModalHeader>
            <CModalTitle>Success</CModalTitle>
        </CModalHeader>
        <CModalBody>
            File uploaded successfully.

        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="() => { showUploadConfirm = false }">
                Close
            </CButton>
        </CModalFooter>
    </CModal>

    <CModal :visible="showConfirmation" @close="() => { showConfirmation = false }">
        <CModalHeader>
            <CModalTitle>Low Balance</CModalTitle>
        </CModalHeader>
        <CModalBody>
            Are you sure you want to confirm all payments for this study? <br /><br />
            For this study, you will need: ${{ neededFunds.toFixed(2) }}.<br /><br />
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

    <!-- Error modal for low balance on study start -->
    <CModal :visible="lowBalanceError" @close="() => { lowBalanceError = false }">
        <CModalHeader>
            <CModalTitle>Low Balance</CModalTitle>
        </CModalHeader>
        <CModalBody>
            Your research fund balance is too low to start this study. <br /><br />
            You must have at least 50% of the total expected study cost in research funds to start the study.<br /><br />
            For this study, you will need: ${{ neededFunds.toFixed(2) }}.<br /><br />
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


    <CNav variant="tabs" role="tablist">

        <CNavItem>
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 1" @click="() => { tabPaneActiveKey = 1 }">
                Studies Table
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 2" @click="() => { tabPaneActiveKey = 2 }">
                Detail for {{ info.internal_study_name }}
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 3" @click="() => { tabPaneActiveKey = 3 }">
                Participant Detail for {{ info.internal_study_name }}
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_edit">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 4" @click="() => { tabPaneActiveKey = 4 }">
                Edit {{ info.internal_study_name }}
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 5" @click="() => { tabPaneActiveKey = 5 }">
                Data for {{ info.internal_study_name }}
            </CNavLink>
        </CNavItem>

    </CNav>
    <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
            <CCard class="mb-4 border">

                <CCardBody>
                    <CRow>
                        <CCol :sm="10">
                            <CCardTitle> Studies Table </CCardTitle>

                            <template v-if="!show_detail">
                                Select a study for more detail.<br /><br />
                            </template>
                        </CCol>
                        <CCol :sm="2" style="text-align:right">
                            <CButton color="primary" size="sm" v-if="!showArchived" v-on:click='toggleArchived(true)'>Show
                                Archived</CButton>
                            <CButton color="primary" size="sm" v-if="showArchived" v-on:click='toggleArchived(false)'>Hide
                                Archived</CButton>
                        </CCol>
                    </CRow>
                    <CTable :key="componentKey" align="middle" class="mb-0 border" hover responsive>
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell class="text-center">Detail</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">ID #</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Internal Name</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">External Name</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Created</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Quota</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Completed</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Cost</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Status</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Edit</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Start/Stop</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Archive</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in shownItems" :key="item.name">
                                <CTableDataCell class="text-center">
                                    <CButton color="primary" size="sm" v-on:click='info_experiment(item)'>Detail
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell class="text-center">{{ item.id }}</CTableDataCell>
                                <CTableDataCell class="text-center">{{ item.internal_study_name }}</CTableDataCell>
                                <CTableDataCell class="text-center">{{ item.external_study_name }}</CTableDataCell>
                                <CTableDataCell class="text-center">{{ format_date(item.created * 1000) }}
                                </CTableDataCell>
                                <CTableDataCell class="text-center">{{ item.quota }}</CTableDataCell>
                                <CTableDataCell class="text-center">{{ item.completed }}</CTableDataCell>
                                <CTableDataCell class="text-center">${{ item.total_paid }}</CTableDataCell>
                                <CTableDataCell v-if="item.status == 'running'" class="text-center"><span
                                        class="text-success">running</span></CTableDataCell>
                                <CTableDataCell v-else-if="item.status == 'paused'" class="text-center"><span
                                        class="text-warning">paused</span></CTableDataCell>
                                <CTableDataCell v-else class="text-center"><span class="text-warning">{{ item.status
                                }}</span></CTableDataCell>
                                <CTableDataCell v-if="item.status == 'paused'" class="text-center">
                                    <CButton color="primary" size="sm" v-on:click='edit_experiment(item)'>
                                        Edit
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else-if="item.status == 'pending'" class="text-center">
                                    <CButton color="primary" size="sm" v-on:click='edit_experiment(item)'>
                                        Edit
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else class="text-center">
                                </CTableDataCell>
                                <CTableDataCell v-if="item.status == 'running'" class="text-center">
                                    <CButton color="warning" size="sm"
                                        v-on:click='change_experiment_status(item, "paused")'>
                                        Pause
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else-if="item.status == 'finished'" class="text-center">
                                </CTableDataCell>
                                <CTableDataCell v-else-if="item.status != 'archived'" class="text-center">
                                    <CButton color="success" size="sm"
                                        v-on:click='change_experiment_status(item, "running")'>Start
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else class="text-center">
                                </CTableDataCell>
                                <CTableDataCell v-if="item.status == 'paused'" class="text-center">
                                    <CButton color="danger" size="sm"
                                        v-on:click='change_experiment_status(item, "archived")'>Archive
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else-if="item.status == 'finished'" class="text-center">
                                    <CButton color="danger" size="sm"
                                        v-on:click='change_experiment_status(item, "archived")'>Archive
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else-if="item.status == 'pending'" animation="glow" class="text-center">
                                    <CButton color="danger" size="sm"
                                        v-on:click='change_experiment_status(item, "archived")'>Archive
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else-if="item.status == 'archived'" animation="glow" class="text-center">
                                    <CButton color="danger" size="sm" v-on:click='change_experiment_status(item, "paused")'>
                                        Unarchive
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else class="text-center">
                                </CTableDataCell>
                            </CTableRow>
                            <CTableRow> </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 2">
            <CCard>

                <CCardBody>
                    <CCardTitle>Detail for {{ info.internal_study_name }}</CCardTitle>

                    <CRow>
                        <CCol :sm="6">
                            <CCard>
                                <CCardHeader>Study ID</CCardHeader>
                                <CCardBody>
                                    <CCardTitle>{{ info.id }}</CCardTitle>
                                    <br />
                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol :sm="6">
                            <CCard>
                                <CCardHeader>Experiment Names</CCardHeader>
                                <CCardBody>
                                    <CCardTitle>{{ info.internal_study_name }} </CCardTitle>

                                    <b>External Study Name: </b>{{ info.external_study_name }}
                                </CCardBody>
                            </CCard>
                        </CCol>


                    </CRow>
                    <br />
                    <CRow>
                        <CCol :sm="12">

                            <CCard>
                                <CCardHeader>Progress</CCardHeader>
                                <CCardBody>
                                    <CCardTitle>{{ 100 * info.completed / info.quota }}% Completed</CCardTitle>
                                    <CProgress class="mb-3">
                                        <CProgressBar color="success" variant="striped" animated
                                            :value="100 * info.completed / info.quota">{{ 100 * info.completed /
                                                info.quota
                                            }}
                                        </CProgressBar>
                                    </CProgress>
                                    <CCardText>{{ info.completed }} out of {{ info.quota }} participants.</CCardText>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                    <br />
                    <CRow>
                        <CCol :sm="6">
                            <CCard>
                                <CCardHeader>Cost</CCardHeader>
                                <CCardBody>
                                    <CCardTitle>${{ info.total_paid }} Total</CCardTitle>
                                    {{ info.completed > 0 ? '$' + info.total_paid / info.completed : 'NA' }} average earned
                                    per
                                    participant.<br />
                                    <br />
                                </CCardBody>
                            </CCard>
                        </CCol>

                        <CCol :sm="6">
                            <CCard>
                                <CCardHeader>Estaimted Earnings</CCardHeader>
                                <CCardBody>
                                    <CCardTitle>Average per Participant: ${{ info.participation_fee + info.average_pay }}
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
                                <CCardHeader>Study Description</CCardHeader>
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
                                <CCardHeader>Eligibility Filter</CCardHeader>
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
                                <CCardHeader>API Integration</CCardHeader>
                                <CCardBody>
                                    <CCardText>
                                        <b>Use the command below to log participant completeion. </b>
                                        <br />
                                        <br />
                                        <pre
                                            style="white-space:pre-line;">curl -X POST "http://127.0.0.1:9985/api/experiment/finish_experiment?my_participant_id=[[ENTER PARTICIPANT ID HERE]]&study_id={{ info.id }}&payment=[ENTER PAYMENT HERE]" -H "accept: */*" -d ""</pre>
                                    </CCardText>
                                </CCardBody>
                            </CCard>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
        </CTabPane>

        <CTabPane role="tabpanel" aria-labelledby="contact-tab" :visible="tabPaneActiveKey === 3">
            <CCard class="mb-4 border">

                <CCardBody>
                    <CCardTitle> Subject Detail </CCardTitle>

                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                        <CButton color="success" align="right" v-on:click='confirm_all_confirmation(info, touches)'>Confirm
                            All</CButton>
                    </div>

                    <BR />
                    <CTable align="middle" class="mb-0 border" hover responsive>
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell class="text-center">ID #</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Start Time</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Duration</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Participation Fee</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Additional Pay</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Status</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Confirm?</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Reject?</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="participant in touches" :key="touches.participant_number">
                                <CTableDataCell class="text-center">{{ participant.participant_number }}
                                </CTableDataCell>
                                <CTableDataCell class="text-center">{{ format_date(participant.start_time * 1000) }}
                                </CTableDataCell>
                                <CTableDataCell v-if="participant.status != 'running'" class="text-center">{{
                                    Math.round((1 / 60) * (participant.end_time - participant.start_time)) }} Minute(s)
                                </CTableDataCell>
                                <CTableDataCell v-else class="text-center">NA</CTableDataCell>
                                <CTableDataCell class="text-center">${{ participant.participation_fee }}
                                </CTableDataCell>

                                <CTableDataCell class="text-center">${{ participant.payment }}
                                </CTableDataCell>



                                <CTableDataCell v-if="participant.status == 'confirmed'" class="text-center"><span
                                        class="badge text-bg-success">Confirmed</span></CTableDataCell>
                                <CTableDataCell v-else-if="participant.status == 'running'" class="text-center"><span
                                        class="badge text-bg-primary">Running</span></CTableDataCell>
                                <CTableDataCell v-else-if="participant.status == 'finished'" class="text-center"><span
                                        class="badge text-bg-warning">Finished</span></CTableDataCell>
                                <CTableDataCell v-else-if="participant.status == 'rejected'" class="text-center"><span
                                        class="badge text-bg-danger">Rejected</span></CTableDataCell>
                                <CTableDataCell v-else class="text-center"><span class="badge text-bg-danger">{{
                                    participant.status }}</span></CTableDataCell>
                                <CTableDataCell v-if="participant.status == 'finished'" class="text-center">
                                    <CButton color="success" v-on:click='confirm_subject(info, participant)'>Confirm
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else class="text-center"></CTableDataCell>
                                <CTableDataCell v-if="participant.status == 'finished'" class="text-center">
                                    <CButton color="danger" v-on:click='reject_subject(info, participant)'>Reject
                                    </CButton>
                                </CTableDataCell>
                                <CTableDataCell v-else class="text-center"></CTableDataCell>
                            </CTableRow>
                        </CTableBody>
                    </CTable>
                </CCardBody>
            </CCard>

            <CCard class="mb-4 border">
                <CCardHeader> Manual Payment Input </CCardHeader>
                <CCardBody>
                    <CFormTextarea v-model="csvInput" label="CSV Input of Payments" rows="3"
                        text="Each row should be of the form: subject_id, payment "></CFormTextarea>
                    <CButton color="success" v-on:click='manual_input()'>Submit
                    </CButton>



                </CCardBody>

            </CCard>


        </CTabPane>

        <CTabPane role="tabpanel" aria-labelledby="edit-tab" :visible="tabPaneActiveKey === 4">
            <br />
            <CCard>
                <CCardBody>
                    <CRow>
                        <CCol sm="10">
                            <CCardTitle>Edit {{ info.internal_study_name }}</CCardTitle>
                        </CCol>
                        <CCol sm="2" style="text-align:right">
                            <CButton color="primary" size="sm" v-on:click='resetPage'>Close this Form</CButton>
                        </CCol>
                    </CRow>
                </CCardBody>
            </CCard>
            <studyInfo :key="componentKey" v-if="show_edit" @editSubmit="resetPage" :studyData="info" :new="false">
            </studyInfo>
        </CTabPane>
    </CTabContent>
    <CTabPane role="tabpanel" aria-labelledby="upload-tab" :visible="tabPaneActiveKey === 5">
        <br />
        <CCard>
            <CCardBody>


                <CCardTitle>
                    Data for {{ info.internal_study_name }}</CCardTitle>

                <CRow>
                    <CCol>
                        <CCard>
                            <CCardBody>
                                <CCardTitle>
                                    <CIcon icon="cilCloudUpload" /> Upload Data
                                </CCardTitle>
                                <CCardText>Accepts csv files. Please ensure to name the hive participant id column
                                    "hive_id".
                                    <br /><br />
                                    <input type="file" :key="fileInputKey" ref="dataFile" accept=".csv" capture />
                                    <br /><br />
                                    <CInputGroup>
                                        <CInputGroupText>Comment</CInputGroupText>
                                        <CFormTextarea v-model="comment" aria-label="Comment"></CFormTextarea>
                                    </CInputGroup>
                                    <br />
                                    <CButton color="primary" v-on:click='uploadData'>Upload</CButton>
                                </CCardText>
                            </CCardBody>
                        </CCard>
                    </CCol>
                    <CCol>
                        <CCard class="mb-4 border">

                            <CCardBody>
                                <CCardTitle> Data File Versions for {{ info.internal_study_name }} </CCardTitle>

                                <div class="d-grid gap-2 d-md-flex justify-content-md-end">

                                </div>

                                <BR />
                                <CTable :key="fileTableKey" align="middle" class="mb-0 border" hover responsive>
                                    <CTableHead color="light">
                                        <CTableRow>
                                            <CTableHeaderCell class="text-center">Version</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Uploaded</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Comment</CTableHeaderCell>
                                            <CTableHeaderCell class="text-center">Download</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        <CTableRow v-for="file in data" :key="data.touches">
                                            <CTableDataCell class="text-center">{{ file.version }}
                                            </CTableDataCell>
                                            <CTableDataCell class="text-center">{{ format_date(file.uploaded * 1000) }}
                                            </CTableDataCell>
                                            <CTableDataCell class="text-center">{{ file.comment }}
                                            </CTableDataCell>
                                            <CTableDataCell class="text-center">
                                                <CButton color="success" v-on:click='download_file(info.id, file.version)'>
                                                    Download
                                                </CButton>
                                            </CTableDataCell>

                                        </CTableRow>
                                    </CTableBody>
                                </CTable>
                            </CCardBody>
                        </CCard>


                    </CCol>
                </CRow>


            </CCardBody>
        </CCard>
    </CTabPane>
    <loadingAnimation v-if="showLoading"></loadingAnimation>
</template>

<div id="app">




</div>


<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useStore } from 'vuex'
import studyInfo from '@/components/StudyInfo.vue'
import { CCardBody } from '@coreui/vue';

const store = useStore()
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
const shownItems = ref({})
const showArchived = ref(false)
const data = ref({})
const showLoading = ref(true)
const dataFile = ref({})
const comment = ref("")
const fileInputKey = ref(0)
const fileTableKey = ref(0)
const uploadErrorList = ref([])
const showUploadErrors = ref(false)
const showUploadConfirm = ref(false)

const uploadData = function () {
    let formData = new FormData();
    formData.append("file", dataFile.value.files[0], "data.csv");

    uploadErrorList.value = checkUploadErrors()
    if (uploadErrorList.value.length > 0) {
        showUploadErrors.value = true
    }
    if (uploadErrorList.value.length == 0) {

        axios.post("http://127.0.0.1:9985/api/researcher/upload_data?study_id=" + info.value.id + "&comment=" + comment.value, formData)
            .then(res => {
                comment.value = ""
                fileInputKey.value += 1
                showUploadConfirm.value = true
                axios
                    .get("http://127.0.0.1:9985/api/researcher/get_data_for_study?study_id=" + info.value.id)
                    .then(res => {
                        data.value = res.data;
                        fileTableKey.value += 1
                    });



            });

    }

}



const toggleArchived = function (show) {
    showArchived.value = show
    update_study_table()
    show_detail.value = false
    show_edit.value = false
}

const format_date = function (date_string) {
    var date = new Date(date_string);
    return date.toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
}

const info_experiment = function (item) {
    show_edit.value = false;
    info.value = item;
    axios
        .get("http://127.0.0.1:9985/api/researcher/get_touches_for_study?study_id=" + item.id)
        .then(res => {
            touches.value = res.data;
            axios
                .get("http://127.0.0.1:9985/api/researcher/get_data_for_study?study_id=" + item.id)
                .then(res => {
                    data.value = res.data;
                    show_detail.value = true;
                    tabPaneActiveKey.value = 2
                });



        });

}

const edit_experiment = function (item) {
    show_detail.value = false;
    show_edit.value = true;
    info.value = item;
    componentKey.value += 1;
    tabPaneActiveKey.value = 4;
}

const update_study_table = function () {


    axios
        .post("http://127.0.0.1:9985/api/researcher/get_history_researcher", {

                jwt:store.state.user.jwt,
            my_email:store.state.user.email
        })
        .then(res => {
            items.value = {};
            items.value = res.data;
            if (showArchived.value == true) {
                shownItems.value = items.value
                showLoading.value = false
            }
            else {
                shownItems.value = items.value.filter(function (el) {
                    return el.status != "archived"
                })
                showLoading.value = false

            }
        });
}



const download_file = function (study_id, version) {

    axios
        .get("http://127.0.0.1:9985/api/researcher/download_data?study_id=" + study_id + "&version=" + version)
        .then(res => {
            var fileURL = window.URL.createObjectURL(new Blob([res.data]));
            var fileLink = document.createElement('a');
            fileLink.href = fileURL;
            fileLink.setAttribute('download', 'hive_' + study_id + "_v" + version + ".csv");
            document.body.appendChild(fileLink);
            fileLink.click();
        });


}


const update_info_experiment = function (item) {
    info.value = item;
    axios
        .get("http://127.0.0.1:9985/api/researcher/get_touches_for_study?study_id=" + item.id)
        .then(res => {
            touches.value = res.data;
        });
}

const change_experiment_status = async function (study, status) {
    balance.value = await checkBalance()
    const expectedCost = (study.average_pay + study.participation_fee) * (study.quota - study.completed)
    neededFunds.value = expectedCost * 0.5
    if (neededFunds.value >= balance.value + 0.01 && status == "running") {

        lowBalanceError.value = true
    }
    else {
        axios
            .post("http://127.0.0.1:9985/api/researcher/change_experiment_status?experiment_id=" + study.id + "&status=" + status)
            .then(res => {
                update_study_table()
            });
    }
}



const confirm_subject = async function (study, participant) {
    balance.value = await checkBalance()
    if (participant.participation_fee + participant.payment <= balance.value) {
        axios
            .post("http://127.0.0.1:9985/api/researcher/confirm_participant?experiment_id=" + study.id + "&participant_id=" + participant.participant_number)
            .then(res => {
                update_info_experiment(study)
            });
    }
    else {
        neededFunds.value = participant.participation_fee + participant.payment
        insufficientFundsError.value = true
    }
}

const confirm_all_confirmation = async function (study, participants) {
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



const confirm_all = async function (study, participants) {
    showConfirmation.value = false
    console.log(study)
    console.log(participants)
    balance.value = await checkBalance()
    let cost = 0
    for (let i = 0; i < participants.length; i++) {
        let participant = participants[i]
        if (participant.status == "finished") {
            cost = cost + participant.participation_fee + participant.payment
        }
    }
    if (cost <= balance.value) {
        axios
            .post("http://127.0.0.1:9985/api/researcher/confirm_all?my_experiment_id=" + study.id)
            .then(res => {
                update_info_experiment(study)
            });
    }
    else {
        neededFunds.value = cost
        insufficientFundsError.value = true
    }

}

const manual_input = function () {

    axios
        .post("http://127.0.0.1:9985/api/researcher/manually_confirm", { experiment_id: info.value.id, csv: csvInput.value })
        .then(res => {
            update_info_experiment(info.value)
        });

}

const reject_subject = function (study, participant) {

    axios
        .post("http://127.0.0.1:9985/api/researcher/reject_participant?experiment_id=" + study.id + "&participant_id=" + participant.participant_number)
        .then(res => {
            update_info_experiment(study)
        });

}

axios
    .get(
        'http://127.0.0.1:9985/api/users/get_funds?my_email=' +
        store.state.user.email,
    )
    .then((res) => {
        balance.value = res.data[0]
    })



update_study_table();


const checkBalance = async function (filter) {
    return new Promise((balance) => {
        axios
            .get(
                'http://127.0.0.1:9985/api/users/get_funds?my_email=' +
                store.state.user.email,
            )
            .then(res => {
                balance(res.data[0]);
            });
    })
}
balance.value = checkBalance()

const resetPage = function () {

    info.value = {}
    items.value = {}
    show_detail.value = false
    show_edit.value = false
    touches.value = {}
    tabPaneActiveKey.value = 1
    balance.value = 0
    lowBalanceError.value = false
    insufficientFundsError.value = false
    showConfirmation.value = false
    neededFunds.value = 0
    csvInput.value = ""

    axios
        .get("http://127.0.0.1:9985/api/researcher/get_history_researcher",
            {
                headers: {
                    jwt: store.state.user.jwt
                },
                params: { my_mail: store.state.user.email }
            })
        .then(res => {
            items.value = res.data;
        });

}

const checkUploadErrors = function () {
    let errors = [];
    if (comment.value.length < 1) { errors.push("Comment must be non-empty.") }
    return (errors)
}


console.log(store.state.user.jwt)
// axios
//     .post("http://127.0.0.1:9985/api/researcher/auth_test", {

//         headers: {
//             jwt: store.state.user.jwt
//         },

//         params: { filter: "TRUE" }

//     })
//     .then(res => {

//     });





</script>

