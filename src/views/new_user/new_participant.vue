<template>
    <profileForm :profile="myProfile" @submitProfile="submittedProfile" :new="true"></profileForm>
  </template>
  
  <script setup>
  
  import { ref } from 'vue';
  import axios from 'axios'
  import { useStore } from 'vuex'
  import profileForm from '@/components/Profile.vue'
  const store = useStore()
  import { useRouter } from 'vue-router'
  const router = useRouter()
  
  const myProfile = ref({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: store.state.user.email,
    payment_email: "",
    education: "",
    student: "",
    country: "",
    campus: "",
    gender: "",
    birthdate: "",
    participated: "",
    completed: ""
})
      
  const submittedProfile = function(){
  
        router.push('/participant/')

      }
  
  </script>
<!--   
  
  


<template>
    <CForm class="row g-3" :validated="isFormValid" @submit="handleSubmit">

        <CCard>
            <CCardHeader>Basic Information</CCardHeader>
            <CCardBody>

                <CRow>
                    <CCol md="4">
                        <CFormLabel>First Name</CFormLabel>
                        <CFormInput feedbackValid="Looks good!" type="text" v-model="profile.first_name" required />
                    </CCol>
                    <CCol md="4">
                        <CFormLabel>Middle Name</CFormLabel>
                        <CFormInput type="text" v-model="profile.middle_name" required />
                    </CCol>
                    <CCol md="4">
                        <CFormLabel>Last Name</CFormLabel>
                        <CFormInput type="text" v-model="profile.last_name" />
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
                        <CFormInput type="text" v-model="profile.country" />
                    </CCol>
                    <CCol md="6">
                        <CFormLabel>Gender</CFormLabel>
                        <CFormSelect aria-label="Default select example" v-model="profile.gender" :options="[
                            'Open this select menu',
                            { label: 'Male', value: 'male' },
                            { label: 'Female', value: 'female' },
                            { label: 'Transgender', value: 'transgender' },
                            { label: 'Other', value: 'other' },
                        ]">
                        </CFormSelect>
                    </CCol>
                </CRow>
                <Vspace />
                <CRow>
                    <CFormLabel>Birthdate</CFormLabel>
                    <VueDatePicker v-model="profile.birthdate" :enable-time-picker="false" format="yyyy-MM-dd"
                        model-type="yyyy-MM-dd" text-input="true" />
                </CRow>

            </CCardBody>
        </CCard>
        <br />
        <CCard >
            <CCardHeader>Education</CCardHeader>
            <CCardBody>

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
                            { label: 'Current Undergraduate Studnet', value: 'student' },
                            { label: 'Not Current Undergraduate Studnet', value: 'nonstudent' },
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

            </CCardBody>
        </CCard>
        <br />
        <CCard>
            <CCardHeader color="primary">Submit</CCardHeader>
            <CCardBody>
                <CCardTitle>Submit Profile</CCardTitle>
                <CCardText>Click below to submit your profile.</CCardText>
                <br />
                <CButton type="submit" color="primary">Click to Submit</CButton>


            </CCardBody>
        </CCard>
        <CModal :visible="updatedNotification" @close="() => { updatedNotification = false }">
            <CModalHeader>
                <CModalTitle>Profile Submitted</CModalTitle>
            </CModalHeader>
            <CModalBody>You profile has been submitted.</CModalBody>
            <CModalFooter>
                <CButton color="secondary" @click="() => { updatedNotification = false }">
                    Close
                </CButton>
            </CModalFooter>
        </CModal>
    </CForm>
</template>
    
    
<script setup>
import { ref } from 'vue';
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useStore()
const isFormValid = ref(false)
const profile = ref({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: store.state.user.email,
    payment_email: "",
    education: "",
    student: "",
    country: "",
    campus: "",
    gender: "",
    birthdate: "",
    participated: "",
    completed: ""
})

const updatedNotification = ref(false)

const handleSubmit = function (event) {
    const form = event.currentTarget
    if (form.checkValidity() === false) {
        event.preventDefault()
        event.stopPropagation()
    }
    else {
        event.preventDefault()
        event.stopPropagation()
        axios
            .post('http://127.0.0.1:9985/api/subject/submit_profile', profile.value)
            .then(res => {
                updatedNotification.value = true
                store.commit('role', 'participant')
                router.push('/participant/eligible_studies')
            })
    }
}

// const submit_profile = function (profile) {

//     axios
//         .post('http://127.0.0.1:9985/api/subject/submit_profile?profile_json=' + JSON.stringify(profile))
//         .then(res => {

//             updatedNotification.value = true

//             router.push('/participant/eligible_studies')


//         })

// }

</script>
 -->
