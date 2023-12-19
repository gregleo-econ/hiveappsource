<template>
    <CModal :visible="showErrors" @close="() => { showErrors = false }">
        <CModalHeader>
            <CModalTitle>{{ errorList.length }} Error(s)</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <div v-for="errorDescription in errorList">- {{ errorDescription }}</div>
        </CModalBody>
        <CModalFooter>
            <CButton color="primary" @click="() => { showErrors = false }">
                Close
            </CButton>
        </CModalFooter>
    </CModal>
    <CCard>

        <CCardBody>
            <CCardTitle>Basic Information</CCardTitle>
            <br />
            <CForm class="row g-3">
                <CCol v-if="!props.new" md="12">
                    <CFormLabel>Session ID</CFormLabel>
                    <CFormInput type="text" disabled v-model="session.session_id" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Internal Session Name</CFormLabel>
                    <CFormInput type="text" v-model="session.internal_session_name" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>External Session Name</CFormLabel>
                    <CFormInput type="text" v-model="session.external_session_name" />
                </CCol>
                <CCol md="6">
                    <CInputGroup>
                        <CInputGroupText>External Session Description</CInputGroupText>
                        <CFormTextarea v-model="session.external_description" aria-label="External Session Description">
                        </CFormTextarea>
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CInputGroup>
                        <CInputGroupText>Internal Session Description</CInputGroupText>
                        <CFormTextarea v-model="session.internal_description" aria-label="Internal Session Description">
                        </CFormTextarea>
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Session Quota</CFormLabel>
                    <CFormInput type="numeric" v-model="session.quota" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Estimated Duration</CFormLabel>
                    <CInputGroup>
                        <CFormInput type="numeric" v-model="session.session_duration" />
                        <CInputGroupText>Minutes</CInputGroupText>
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Participation Fee</CFormLabel>
                    <CInputGroup>
                        <CInputGroupText>$</CInputGroupText>
                        <CFormInput type="numeric" v-model="session.participation_fee" />
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Estimated Average Additional Payment</CFormLabel>
                    <CInputGroup>
                        <CInputGroupText>$</CInputGroupText>
                        <CFormInput type="numeric" v-model="session.average_pay" />
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Session URL</CFormLabel>
                    <CFormInput type="text" v-model="session.session_url" />
                </CCol>
                <CCol md="12">
                    <CFormLabel>Associated Project</CFormLabel>
                    <CFormSelect v-if="showProjects" aria-label="Project" v-model="session.project_id">
                        <option value=0>None</option>
                        <option v-for="project in projects" :value="project.project_id">{{ project.name }}</option>
                    </CFormSelect>
                </CCol>
            </CForm>
        </CCardBody>
    </CCard>
    <br />
    <CCard>

        <CCardBody>
            <CCardTitle>Eligibility</CCardTitle>
            <br />
            <CAccordion>
                <CAccordionItem :item-key="1">
                    <CAccordionHeader>
                        <h5>Instructions</h5>
                    </CAccordionHeader>
                    <CAccordionBody>
                        To be eligible for your session, a subject must meet <b>all of the conditions</b> in at least one of
                        the
                        groups for your session. <br /><br />
                        To add conditions to a group, click the group to make it active then select your condition in the
                        lower box
                        and click "Add Condition to Group #". You can remove the last condition added to a group, add
                        groups, and
                        remove groups using the buttons below.
                    </CAccordionBody>
                </CAccordionItem>
            </CAccordion>
            <br />
            <filterItem :key="componentKey" v-model="myValue" :startingFilter="startingFilter" :variables="variables"
                :variableOperators="variableOperators" :variableOptions="variableOptions" :types="types"
                @updateFilter="getSql"></filterItem>
                <br/>
                <h5>
                <CIcon icon="cilClipboard" size="xl" />&nbspSummary
            </h5>
            <CRow>
                <CCardGroup>
                    <CWidgetStatsC class="mb-3" :value="eligibleNumber"
                        :progress="{ color: 'info', value: 100 * eligibleNumber / totalNumber }" title="Visitors">
                        <template #icon>
                            <CIcon icon="cil-people" height="36" />
                        </template>
                        <template #title>Eligible Particpants</template>
                    </CWidgetStatsC>
                    <CCard text-color="black" class="mb-3">
                        <CCardBody>
                            <CCardTitle> SQL Filter</CCardTitle>
                            <CCardText>{{ sqlFilter }}</CCardText>
                        </CCardBody>
                    </CCard>
                </CCardGroup>
            </CRow>
            
        </CCardBody>
    </CCard>
    <br />
    <CCard cclass="mb-3">

        <CCardBody>
            <CCardTitle>Submit</CCardTitle>
            <CCardText>By submitting this session, you agree to abide by the HIVE researcher agreement. Please check the box
                below
                to continue.</CCardText>
            <CFormCheck id="agreeTerms" v-model="agreeTerms" label="I Agree to the Researcher Terms" />
            <br />
            <CButton v-if="props.new" type="button" v-on:click.native="submit_experiment(session)" color="primary">Click to
                Submit</CButton>
            <CButton v-else type="button" v-on:click.native="edit_experiment(session)" color="primary">Click to Submit Edits
            </CButton>
        </CCardBody>
    </CCard>
</template>
  
  
<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import filterItem from '@/components/FilterItem.vue'
import * as DataFunctions from '@/services/GetData.js'
import * as Values from '@/values.js'

const componentKey = ref(0)
const showErrors = ref(false)
const errorList = ref([])
const agreeTerms = ref(false)
const showProjects = ref(false)
const projects = ref({})

const props = defineProps({
    sessionData: Object,
    new: Boolean,
})


const getProjects = async function () {
    projects.value = await DataFunctions.ResearcherGetProjects().then(res => res.data)
    showProjects.value = true
}

getProjects()


let emit = defineEmits(['newSubmit', 'editSubmit']);
const select2Settings = {
    single: {
        allowClear: true,
        closeOnClear: false,
        multiple: false,
        width: '90%',
        placeholder: 'Select'
    },
    multiple: {
        allowClear: true,
        closeOnClear: false,
        multiple: true,
        width: '90%',
        placeholder: 'Select Multiple'
    },
}

const variables = [
    { id: 'campus', text: 'Campus' },
    { id: 'gender', text: 'Gender' },
    { id: 'student', text: 'Student Status' },
    { id: 'education', text: 'Highest Degree' },
    { id: 'participated', text: 'Participated in Session' },
    { id: 'completed', text: 'Completed Session' },
    { id: 'country', text: 'Country of Residence' },
    { id: 'birthdate', text: 'Birthdate' },

]

const variableOptions = {}
variableOptions.education = Values.education
variableOptions.gender = Values.gender
variableOptions.student = Values.student
variableOptions.country = Values.country
variableOptions.campus = Values.campus


const variableOperators = {
    gender: ['IN', 'NOT IN'],
    student: ['IN', 'NOT IN'],
    education: ['IN', 'NOT IN'],
    participated: ['LIKE', 'NOT LIKE'],
    completed: ['LIKE', 'NOT LIKE'],
    country: ['IN', 'NOT IN'],
    birthdate: ['<=', '>='],
    campus: ['IN', 'NOT IN'],
}
const types = {
    NA: 'single',
    gender: 'multi',
    student: 'single',
    education: 'multi',
    participated: 'open',
    country: 'multi',
    completed: 'open',
    birthdate: 'date',
    campus: 'multi',
}
const router = useRouter()
const store = useStore()
const sqlFilter = ref(null)
const eligibleNumber = ref(0)
const totalNumber = ref(0)

const session = ref({})
session.value = props.sessionData
const startingFilter = ref(JSON.parse(props.sessionData.pool_filter_json))
const myValue = ref({
    filter: ['TRUE'],
})
DataFunctions.ResearcherQueryPool("TRUE")
    .then(res => {
        totalNumber.value = res.data[0].n;
    });


const getSql = async function (event) {
    sqlFilter.value = makeFullFilter(myValue._value.filter)
    eligibleNumber.value = await DataFunctions.ResearcherQueryPool(sqlFilter.value).then(res => res.data[0].n)

}

const submit_experiment = async function () {

    sqlFilter.value = makeFullFilter(myValue._value.filter)

    eligibleNumber.value = await DataFunctions.ResearcherQueryPool(sqlFilter.value).then(res => res.data[0].n)
    errorList.value = checkErrors()

    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {
        session.value.pool_filter = makeFullFilter(myValue._value.filter)
        let sessionData = session.value
        sessionData.pool_filter_json = JSON.stringify(myValue._value.filter)

        DataFunctions.ResearcherNewExperiment(sessionData)
            .then(res => {
                router.push('/researcher/my_sessions')
            })
    }
}
const edit_experiment = async function () {

    sqlFilter.value = makeFullFilter(myValue._value.filter)

    eligibleNumber.value = await DataFunctions.ResearcherQueryPool(sqlFilter.value).then(res => res.data[0].n)


    errorList.value = checkErrors()

    if (errorList.value.length > 0) {
        showErrors.value = true
    }

    if (errorList.value.length == 0) {
        session.value.pool_filter = makeFullFilter(myValue._value.filter)
        let sessionData = session.value
        sessionData.pool_filter_json = JSON.stringify(myValue._value.filter)

        DataFunctions.ResearcherEditExperiment(sessionData)
            .then(res => {
                emit('editSubmit')
            })
    }
}
const makeFullFilter = function (filterArray) {
    let fullFilter = []
    for (let i = 0; i < filterArray.length; i++) {
        if (filterArray[i].length == 0) { fullFilter.push("TRUE") }
        else {
            fullFilter.push(filterArray[i].join(" AND "))
        }
        fullFilter[i] = addParentheses(fullFilter[i])
    }
    return (fullFilter.join(" OR "))
}
const updateOptions = function () {
    componentKey.value += 1;
}
const addParentheses = function (str) {
    return `(${str})`;
}
const checkErrors = function () {
    let errors = [];
    if (session.value.internal_session_name.length < 5) { errors.push("Internal session name must be 6 or more characters") }
    if (session.value.external_session_name.length < 5) { errors.push("External session name must be 6 or more characters") }
    if (session.value.external_description.length < 24) { errors.push("Session description must be 24 or more characters") }
    if (session.value.internal_description.length < 24) { errors.push("Session description must be 24 or more characters") }
    if (currencyValidate(session.value.participation_fee)) { errors.push("Participation fee must be a numeric with no more than two decimal digits.") }
    if (currencyValidate(session.value.average_pay)) { errors.push("Estimated average additional payment must be a numeric with no more than two decimal digits.") }
    if (integerValidate(session.value.session_duration)) { errors.push("Estimated duration must an integer.") }
    if (integerValidate(session.value.quota)) { errors.push("Quota must an integer.") }
    if (urlValidate(session.value.session_url)) { errors.push("Session URL must be a valid URL.") }
    if (Number(session.value.session_duration) < 0) { errors.push("Duration must be positive.") }
    if ((Number(session.value.participation_fee) + Number(session.value.average_pay)) / (Number(session.value.session_duration) / 60) < 15) { errors.push("Average hourly pay (including participation fee) must be at least $15.") }
    if (eligibleNumber.value == "ERROR") { errors.push("There is an error in your filter.") }
    if (eligibleNumber.value == 0) { errors.push("There is an error in your filter. No participants will be eligible for your session.") }
    if (agreeTerms.value == false) { errors.push("You must agree to the researcher terms.") }
    return (errors)
}
const currencyValidate = function (value) {
    //var value= $("#field1").val();
    var regex = /^\d*.?\d{0,2}$/;
    if (regex.test(value)) { return (false) }
    else { return (true) }
};
const integerValidate = function (value) {
    //var value= $("#field1").val();
    var regex = /^\d*$/;
    if (regex.test(value)) { return (false) }
    else { return (true) }
};
const urlValidate = function (value) {
    var regex = /^(http(s)?:\/\/.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/
    if (regex.test(value)) { return (false) }
    else { return (true) }
}
const imgValidate = function (value) {
    var regex = /^https?:\/\/(?:[a-z0-9\-]+\.)+[a-z]{2,6}(?:\/[^/#?]+)+\.(?:jpg|gif|png)$/
    if (regex.test(value)) { return (false) }
    else { return (true) }
}
sqlFilter.value = makeFullFilter(startingFilter.value)
DataFunctions.ResearcherQueryPool(sqlFilter.value)
    .then(res => {
        eligibleNumber.value = res.data[0].n;

    });
</script>
  
  