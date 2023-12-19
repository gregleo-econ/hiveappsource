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
        <CCardHeader style="font-weight:bold;">Basic Information</CCardHeader>
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
                        <CFormSelect aria-label="Country" v-model="profile.country" :options="Values.country"></CFormSelect>
                    </CCol>
                    <CCol md="6">
                        <CFormLabel>Gender</CFormLabel>
                        <CFormSelect aria-label="Default select example" v-model="profile.gender" :options="Values.gender">
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
        <CCardHeader style="font-weight:bold;">Education</CCardHeader>
        <CCardBody>
            <CForm class="row g-3">
                <CRow>
                    <CCol md="6">
                        <CFormLabel>Highest Degree Achieved</CFormLabel>
                        <CFormSelect aria-label="Default select example" v-model="profile.education" :options="Values.education">
                        </CFormSelect>
                    </CCol>
                </CRow>
                <Vspace />
                <CRow>
                    <CCol md="6">
                        <CFormLabel>Current University Student?</CFormLabel>
                        <CFormSelect aria-label="University Student" v-model="profile.student" :options="Values.student">
                        </CFormSelect>
                    </CCol>
                    <CCol md="6">
                        <CFormLabel>Campus</CFormLabel>
                        <CFormSelect aria-label="Default select example" v-model="profile.campus" :options="Values.campus">
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
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import * as Values from '@/values.js'
import * as DataFunctions from '@/services/GetData.js'
const errorList = ref([])
const props = defineProps({
    profile: Object,
    new: Boolean,
})

let emit = defineEmits(['submitProfile']);
const router = useRouter()
const store = useStore()
const showErrors = ref(false)
const profile = ref({})
profile.value = props.profile
const updatedNotification = ref(false)

const update_profile = function (profile) {
    
    errorList.value = checkErrors()
    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {
        if (props.new == false) {
            DataFunctions.SubjectUpdateProfile(profile)
                .then(res => {
                    updatedNotification.value = true
                })
        }
        else {
            DataFunctions.SubjectSubmitProfile(profile)
                .then(res => {
                    updatedNotification.value = true
                    store.commit('role', 'participant')
                })
        }
    }
}
const checkErrors = function () {
    let errors = [];
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