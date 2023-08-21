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
        <CCardHeader>Basic Information</CCardHeader>
        <CCardBody>
            <CForm class="row g-3">
                <CRow>
                    <CCol md="4">
                        <CFormLabel>First Name</CFormLabel>
                        <CFormInput type="text" v-model="profile.first_name" :disabled="!props.new" />
                    </CCol>
                    <CCol md="4">
                        <CFormLabel>Middle Name</CFormLabel>
                        <CFormInput type="text" v-model="profile.middle_name" :disabled="!props.new" />
                    </CCol>
                    <CCol md="4">
                        <CFormLabel>Last Name</CFormLabel>
                        <CFormInput type="text" v-model="profile.last_name" :disabled="!props.new" />
                    </CCol>
                </CRow>
                <Vspace />
                <CRow>
                    <CCol md="6">
                        <CFormLabel>E-mail Address</CFormLabel>
                        <CFormInput type="text" v-model="profile.email" disabled />
                    </CCol>
                    <CCol md="6">
                        <CFormLabel>E-mail Address for Paypal Payment </CFormLabel>
                        <CFormInput type="text" v-model="profile.payment_email" />
                    </CCol>
                </CRow>
                <Vspace />
                <CRow>
                    <CCol md="6">
                        <CFormLabel>Country</CFormLabel>
                        <CFormSelect aria-label="Country" v-model="profile.country"  :options="countries"></CFormSelect>
                    </CCol>
                    <CCol md="6">
                        <CFormLabel>Gender</CFormLabel>
                        <CFormSelect aria-label="Default select example" v-model="profile.gender" :options="[
                            { label: 'Open this select menu', value: 'Empty' },
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' },
                            { label: 'Transgender', value: 'Transgender' },
                            { label: 'Other', value: 'Other' },
                        ]">
                        </CFormSelect>
                    </CCol>
                </CRow>
                <Vspace />
                <CRow>
                    <CFormLabel>Birthdate</CFormLabel>
                    <VueDatePicker v-model="profile.birthdate" :enable-time-picker="false" format="yyyy-MM-dd"
                        model-type="yyyy-MM-dd" text-input="false" />
                </CRow>
            </CForm>
        </CCardBody>
    </CCard>
    <br />
    <CCard>
        <CCardHeader>Education</CCardHeader>
        <CCardBody>
            <CForm class="row g-3">
                <CRow>
                    <CCol md="6">
                        <CFormLabel>Highest Degree Achieved</CFormLabel>
                        <CFormSelect aria-label="Default select example" v-model="profile.education" :options="[
                            'Open this select menu',
                            { label: 'Some Highschool', value: 'some highschool' },
                            { label: 'Highschool Diploma or Equivalent', value: 'highschool' },
                            { label: 'Associates Degree', value: 'associates' },
                            { label: 'Bachelors Degree', value: 'bachelors' },
                            { label: 'Masters Degree', value: 'masters' },
                            { label: 'PhD Degree', value: 'phd' },
                        ]">
                        </CFormSelect>
                    </CCol>
                </CRow>
                <Vspace />
                <CRow>
                    <CCol md="6">
                        <CFormLabel>Current University Student?</CFormLabel>
                        <CFormSelect aria-label="University Student" v-model="profile.student" :options="[
                            'Open this select menu',
                            { label: 'Current Undergraduate Student', value: 'student' },
                            { label: 'Not Current Undergraduate Student', value: 'nonstudent' },
                        ]">
                        </CFormSelect>
                    </CCol>
                    <CCol md="6">
                        <CFormLabel>Campus</CFormLabel>
                        <CFormSelect aria-label="Default select example" v-model="profile.campus" :options="[
                            'Open this select menu',
                            { label: 'NA', value: 'na' },
                            { label: 'Vanderbilt', value: 'vanderbilt' },
                            { label: 'UC Santa Barbara', value: 'uc santa barbara' },
                            { label: 'UC Irvine', value: 'uc irvine' },
                            { label: 'UC Davis', value: 'uc davis' },
                        ]">
                        </CFormSelect>
                    </CCol>
                </CRow>
            </CForm>
        </CCardBody>
    </CCard>
    <br />
    <CCard>
        <CCardHeader color="primary">Submit</CCardHeader>
        <CCardBody>
            <CCardTitle>Update Profile</CCardTitle>
            <CCardText>Click below to update your profile.</CCardText>
            <br />
            <CForm class="row g-3">
                <CButton type="button" v-on:click="update_profile(profile)" color="primary">Click to Update</CButton>
            </CForm>
        </CCardBody>
    </CCard>
    <CModal :visible="updatedNotification" @close="$emit('submitProfile')">
        <CModalHeader>
            <CModalTitle>Profile Updated</CModalTitle>
        </CModalHeader>
        <CModalBody>You profile has been sucsessfully updated.</CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="$emit('submitProfile')">
                Close
            </CButton>
        </CModalFooter>
    </CModal>
</template>
    
    
<script setup>
import { ref } from 'vue';
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const errorList = ref([])
const props = defineProps({
    profile: Object,
    new: Boolean,
})

const countries = [
{ label: 'Open this select menu', value: '' },
"United States",
"United Kingdom",
"Afghanistan",
"Albania",
"Algeria",
"Andorra",
"Angola",
"Antigua & Deps",
"Argentina",
"Armenia",
"Australia",
"Austria",
"Azerbaijan",
"Bahamas",
"Bahrain",
"Bangladesh",
"Barbados",
"Belarus",
"Belgium",
"Belize",
"Benin",
"Bhutan",
"Bolivia",
"Bosnia Herzegovina",
"Botswana",
"Brazil",
"Brunei",
"Bulgaria",
"Burkina",
"Burundi",
"Cambodia",
"Cameroon",
"Canada",
"Cape Verde",
"Central African Rep",
"Chad",
"Chile",
"China",
"Colombia",
"Comoros",
"Congo,",
"Congo {Democratic Rep}",
"Costa Rica",
"Croatia",
"Cuba",
"Cyprus",
"Czech Republic",
"Denmark",
"Djibouti",
"Dominica",
"Dominican Republic",
"East Timor",
"Ecuador",
"Egypt",
"El Salvador",
"Equatorial Guinea",
"Eritrea",
"Estonia",
"Ethiopia",
"Fiji",
"Finland",
"France",
"Gabon",
"Gambia",
"Georgia",
"Germany",
"Ghana",
"Greece",
"Grenada",
"Guatemala",
"Guinea",
"Guinea-Bissau",
"Guyana",
"Haiti",
"Honduras",
"Hungary",
"Iceland",
"India",
"Indonesia",
"Iran",
"Iraq",
"Ireland {Republic}",
"Israel",
"Italy",
"Ivory Coast",
"Jamaica",
"Japan",
"Jordan",
"Kazakhstan",
"Kenya",
"Kiribati",
"Korea North",
"Korea South",
"Kosovo",
"Kuwait",
"Kyrgyzstan",
"Laos",
"Latvia",
"Lebanon",
"Lesotho",
"Liberia",
"Libya",
"Liechtenstein",
"Lithuania",
"Luxembourg",
"Macedonia",
"Madagascar",
"Malawi",
"Malaysia",
"Maldives",
"Mali",
"Malta",
"Marshall Islands",
"Mauritania",
"Mauritius",
"Mexico",
"Micronesia",
"Moldova",
"Monaco",
"Mongolia",
"Montenegro",
"Morocco",
"Mozambique",
"Myanmar, {Burma}",
"Namibia",
"Nauru",
"Nepal",
"Netherlands",
"New Zealand",
"Nicaragua",
"Niger",
"Nigeria",
"Norway",
"Oman",
"Pakistan",
"Palau",
"Panama",
"Papua New Guinea",
"Paraguay",
"Peru",
"Philippines",
"Poland",
"Portugal",
"Qatar",
"Romania",
"Russian Federation",
"Rwanda",
"St Kitts & Nevis",
"St Lucia",
"Saint Vincent & the Grenadines",
"Samoa",
"San Marino",
"Sao Tome & Principe",
"Saudi Arabia",
"Senegal",
"Serbia",
"Seychelles",
"Sierra Leone",
"Singapore",
"Slovakia",
"Slovenia",
"Solomon Islands",
"Somalia",
"South Africa",
"South Sudan",
"Spain",
"Sri Lanka",
"Sudan",
"Suriname",
"Swaziland",
"Sweden",
"Switzerland",
"Syria",
"Taiwan",
"Tajikistan",
"Tanzania",
"Thailand",
"Togo",
"Tonga",
"Trinidad & Tobago",
"Tunisia",
"Turkey",
"Turkmenistan",
"Tuvalu",
"Uganda",
"Ukraine",
"United Arab Emirates",
"Uruguay",
"Uzbekistan",
"Vanuatu",
"Vatican City",
"Venezuela",
"Vietnam",
"Yemen",
"Zambia",
"Zimbabwe"]

let emit = defineEmits(['submitProfile']);

const router = useRouter()
const store = useStore()
const showErrors = ref(false)
const profile = ref({})
profile.value = props.profile

console.log(profile.value)


const updatedNotification = ref(false)



const update_profile = function (profile) {
    errorList.value = checkErrors()
    console.log(errorList.value)
    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {

        if (props.new == false) {
            axios
                .post('http://econhive.com/api/subject/update_profile', profile)
                .then(res => {
                    updatedNotification.value = true
                })
        }
        else {
            axios
                .post('http://econhive.com/api/subject/submit_profile', profile)
                .then(res => {
                    updatedNotification.value = true
                    store.commit('role', 'participant')
                })
        }
    }
}

const checkErrors = function () {
    let errors = [];
console.log(profile)
    if (profile.value.first_name.length <= 1) { errors.push("Enter a Valid First Name") }
    if (profile.value.middle_name.length <= 1) { errors.push("Enter a Valid Middle Name") }
    if (profile.value.last_name.length <= 1) { errors.push("Enter a Valid Last Name") }
    if (emailValidate(profile.value.payment_email)) { errors.push("Paypal E-mail address must be a vaild email.") }
    if (profile.value.country == "") { errors.push("Please Select a Country") }
    if (profile.value.gender == "Empty") { errors.push("Please Select a Gender") }
    if (profile.value.gender == "") { errors.push("Please Select a Gender") }
    if (profile.value.student == "") { errors.push("Please Select a Student Status") }
    if (profile.value.campus == "") { errors.push("Please Select a Campus (or NA)") }
    if (profile.value.education == "") { errors.push("Please Select a Highest Degree Achieved") }
    if (dateValidate(profile.value.birthdate)) { errors.push("Please Select a Valid Birthdate") }
    return (errors)
}

const dateValidate = function (value) {
    var regex = /^[0-9]{4}\-[0-9]{2}-[0-9]{2}$/;
    if (regex.test(value)) { return (false) }
    else { return (true) }
}


const emailValidate = function (value) {
    var regex = /^\S+@\S+\.\S+$/;
    if (regex.test(value)) { return (false) }
    else { return (true) }
}


</script>