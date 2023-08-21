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
            <br/>
            <CForm class="row g-3">
                <CCol v-if="!props.new" md="12">
                    <CFormLabel>Study ID</CFormLabel>
                    <CFormInput type="text" disabled v-model="study.id" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Internal Study Name</CFormLabel>
                    <CFormInput type="text" v-model="study.internal_study_name" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>External Study Name</CFormLabel>
                    <CFormInput type="text" v-model="study.external_study_name" />
                </CCol>
                <CCol md="6">
                    <CInputGroup>
                        <CInputGroupText>External Study Description</CInputGroupText>
                        <CFormTextarea v-model="study.external_description" aria-label="External Study Description"></CFormTextarea>
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CInputGroup>
                        <CInputGroupText>Internal Study Description</CInputGroupText>
                        <CFormTextarea v-model="study.internal_description" aria-label="Internal Study Description"></CFormTextarea>
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Study Quota</CFormLabel>
                    <CFormInput type="numeric" v-model="study.quota" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Estimated Duration</CFormLabel>
                    <CInputGroup>
                        <CFormInput type="numeric" v-model="study.study_duration" />
                        <CInputGroupText>Minutes</CInputGroupText>
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Participation Fee</CFormLabel>
                    <CInputGroup>
                        <CInputGroupText>$</CInputGroupText>
                        <CFormInput type="numeric" v-model="study.participation_fee" />
                    </CInputGroup>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Estimated Average Additional Payment</CFormLabel>
                    <CInputGroup>
                        <CInputGroupText>$</CInputGroupText>
                        <CFormInput type="numeric" v-model="study.average_pay" />
                    </CInputGroup>
                </CCol>

                <CCol md="6">
                    <CFormLabel>Study URL</CFormLabel>
                    <CFormInput type="text" v-model="study.study_url" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Logo URL</CFormLabel>
                    <CFormInput type="text" v-model="study.logo_url" />
                </CCol>

            </CForm>
        </CCardBody>
    </CCard>

    <br />
    <CCard>
        
        <CCardBody>
            <CCardTitle>Eligibility</CCardTitle>
            <br/>
            <CAccordion>
                <CAccordionItem :item-key="1">
                    <CAccordionHeader>
                        <h5>Instructions</h5>
                    </CAccordionHeader>
                    <CAccordionBody>
                        To be eligible for your study, a subject must meet <b>all of the conditions</b> in at least one of
                        the
                        groups for your study. <br /><br />
                        To add conditions to a group, click the group to make it active then select your condition in the
                        lower box
                        and click "Add Condition to Group #". You can remove the last condition added to a group, add
                        groups, and
                        remove groups using the buttons below.
                    </CAccordionBody>
                </CAccordionItem>
            </CAccordion>
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
            <br/>
            <filterItem :key="componentKey" v-model="myValue" :startingFilter="startingFilter" :variables="variables"
                :variableOperators="variableOperators" :variableOptions="variableOptions" :types="types" @updateFilter="getSql"></filterItem>


        </CCardBody>
    </CCard>



    <br />
    <CCard cclass="mb-3">
        
        <CCardBody>
            <CCardTitle>Submit</CCardTitle>
            <CCardText>By submitting this study, you agree to abide by the HIVE researcher agreement. Please check the box
                below
                to continue.</CCardText>
            <CFormCheck id="agreeTerms" v-model="agreeTerms" label="I Agree to the Researcher Terms" />
            <br />
            <CButton v-if="props.new" type="button" v-on:click.native="submit_experiment(study)" color="primary">Click to
                Submit</CButton>
            <CButton v-else type="button" v-on:click.native="edit_experiment(study)" color="primary">Click to Submit
            </CButton>
        </CCardBody>
    </CCard>
</template>
  
  
<script setup>
import { ref } from 'vue';
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { CCardHeader, CCardTitle } from '@coreui/vue';

import filterItem from '@/components/FilterItem.vue'

const componentKey = ref(0)
const showErrors = ref(false)
const errorList = ref([])
const agreeTerms = ref(false)

const props = defineProps({
    studyData: Object,
    new: Boolean,
})

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


const getValues = function (variable) {
    axios
        .get('http://127.0.0.1:9985/researcher/get_values', { params: { variable: variable } })
        .then(res => {
            variableOptions[variable] = res.data
            return (res.data)
        })
        .catch(function (error) { return ([]) });
}


const variables = [{ id: 'gender', text: 'Gender' },
{ id: 'student', text: 'Student Status' },
{ id: 'education', text: 'Highest Degree' },
{ id: 'participated', text: 'Participated in Study' },
{ id: 'completed', text: 'Completed Study' },
{ id: 'country', text: 'Country of Residence' },
{ id: 'birthdate', text: 'Birthdate' },
]

const variableOptions = {}

variableOptions.education = getValues('education')
variableOptions.education = getValues('gender')
variableOptions.education = getValues('student')
variableOptions.education = getValues('country')

const variableOperators = {
    gender: ['IN', 'NOT IN'],
    student: ['IN', 'NOT IN'],
    education: ['IN', 'NOT IN'],
    participated: ['LIKE', 'NOT LIKE'],
    completed: ['LIKE', 'NOT LIKE'],
    country: ['IN', 'NOT IN'],
    birthdate: ['<=', '>=']
}

const types = {
    NA: 'single',
    gender: 'multi',
    student: 'single',
    education: 'multi',
    participated: 'open',
    country: 'multi',
    completed: 'open',
    birthdate: 'date'
}

const router = useRouter()
const store = useStore()
const querybuilder = ref(null)
const sqlFilter = ref(null)
const selected = ref(null)
const options = ['list', 'of', 'options']
const eligibleNumber = ref(0)
const totalNumber = ref(0)
const educationValues = ["highschool", "undergraduate", "masters", "phd"]
const studentValues = ["student", "nonstudent"]

const study = ref({})

study.value = props.studyData

const startingFilter = ref(JSON.parse(props.studyData.pool_filter_json))

const myValue = ref({
    filter: ['TRUE'],
})




axios
    .get("http://127.0.0.1:9985/researcher/query_pool", { params: { filter: "TRUE" } })
    .then(res => {
        totalNumber.value = res.data[0].n;
    });






const check_eligible_number = async function (filter) {
    return new Promise((eligibleNum) => {
        axios
            .get('http://127.0.0.1:9985/researcher/query_pool', { params: { filter: filter } })
            .then(res => {
                eligibleNum(res.data[0].n)
            })
            .catch(function (error) {
                eligibleNum("ERROR")
            });;
    });
}



const getSql = async function (event) {
    sqlFilter.value = makeFullFilter(myValue._value.filter)
    eligibleNumber.value = await check_eligible_number(sqlFilter.value)
}


const submit_experiment = async function () {

    sqlFilter.value = makeFullFilter(myValue._value.filter)
    eligibleNumber.value = await check_eligible_number(sqlFilter.value)

    errorList.value = checkErrors()
    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {

        study.value.pool_filter = makeFullFilter(myValue._value.filter)
        let studyData = {
            researcher: store.state.user.email,
            internal_study_name: study.value.internal_study_name,
            external_study_name: study.value.external_study_name,
            external_description: study.value.external_description,
            study_duration: study.value.study_duration,
            participation_fee: study.value.participation_fee,
            average_pay: study.value.average_pay,
            quota: study.value.quota,
            pool_filter: study.value.pool_filter,
            pool_filter_json: JSON.stringify(myValue._value.filter),
            study_url: study.value.study_url,
            logo_url: study.value.logo_url
        }
        console.log(studyData)
        axios
            .post('http://127.0.0.1:9985/researcher/new_experiment', studyData)
            .then(res => {
                router.push('/researcher/my_studies')

            })
    }


}


const edit_experiment = async function () {

    sqlFilter.value = makeFullFilter(myValue._value.filter)
    eligibleNumber.value = await check_eligible_number(sqlFilter.value)

    errorList.value = checkErrors()
    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {

        study.value.pool_filter = makeFullFilter(myValue._value.filter)
        let studyData = {
            researcher: store.state.user.email,
            id: study.value.id,
            internal_study_name: study.value.internal_study_name,
            external_study_name: study.value.external_study_name,
            created: study.value.created,
            external_description: study.value.external_description,
            study_duration: study.value.study_duration,
            participation_fee: study.value.participation_fee,
            average_pay: study.value.average_pay,
            quota: study.value.quota,
            pool_filter: study.value.pool_filter,
            pool_filter_json: JSON.stringify(myValue._value.filter),
            study_url: study.value.study_url,
            logo_url: study.value.logo_url
        }
        console.log(studyData)
        axios
            .post('http://127.0.0.1:9985/researcher/edit_experiment', studyData)
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

    if (study.value.internal_study_name.length < 5) { errors.push("Internal study name must be 6 or more characters") }
    if (study.value.external_study_name.length < 5) { errors.push("External study name must be 6 or more characters") }
    if (study.value.external_description.length < 24) { errors.push("Study description must be 24 or more characters") }
    if (study.value.internal_description.length < 24) { errors.push("Study description must be 24 or more characters") }
    if (currencyValidate(study.value.participation_fee)) { errors.push("Participation fee must be a numeric with no more than two decimal digits.") }
    if (currencyValidate(study.value.average_pay)) { errors.push("Estimated average additional payment must be a numeric with no more than two decimal digits.") }
    if (integerValidate(study.value.study_duration)) { errors.push("Estimated duration must an integer.") }
    if (integerValidate(study.value.quota)) { errors.push("Quota must an integer.") }
    if (urlValidate(study.value.study_url)) { errors.push("Study URL must be a valid URL.") }
    if (imgValidate(study.value.logo_url)) { errors.push("Logo URL must be a valid link to a png, gif, or jpg image.") }
    if (Number(study.value.study_duration) < 0) { errors.push("Duration must be positive.") }
    if ((Number(study.value.participation_fee) + Number(study.value.average_pay)) / (Number(study.value.study_duration) / 60) < 15) { errors.push("Average hourly pay (including participation fee) must be at least $15.") }
    if (eligibleNumber.value == "ERROR") { errors.push("There is an error in your filter.") }
    if (eligibleNumber.value == 0) { errors.push("There is an error in your filter. No participants will be eligible for your study.") }
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
axios
    .get("http://127.0.0.1:9985/researcher/query_pool", { params: { filter: sqlFilter.value } })
    .then(res => {
        eligibleNumber.value = res.data[0].n;
       
    });




</script>
  
  