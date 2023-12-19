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
                    <CFormLabel>Project ID</CFormLabel>
                    <CFormInput type="text" disabled v-model="project.project_id" />
                </CCol>
                <CCol md="2">
                    <CFormLabel>Make Public?</CFormLabel>

                    <CFormSelect v-model="project.public" :options="[ { label: 'Hidden' , value: 'false' }, { label: 'Pubilic' ,
                        value: 'true' } ]" />
                </CCol>
                <CCol md="5">
                    <CFormLabel>Project Name</CFormLabel>
                    <CFormInput type="text" v-model="project.name" />
                </CCol>
                <CCol md="5">
                    <CFormLabel>Authors</CFormLabel>
                    <CFormInput type="text" v-model="project.authors" />
                </CCol>
                <CCol md="12">
                    <CInputGroup>
                        <CInputGroupText>Project Description / Abstract</CInputGroupText>
                        <CFormTextarea type="text" v-model="project.abstract" />
                    </CInputGroup>
                </CCol>
                <CCol md="12">
                    <CFormLabel>Citation</CFormLabel>
                    <CFormInput type="text" v-model="project.citation" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Keywords - Comma Separated</CFormLabel>
                    <CFormInput type="text" v-model="project.keywords" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>JEL Codes - Comma Separated</CFormLabel>
                    <CFormInput type="text" v-model="project.jel" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Paper URL</CFormLabel>
                    <CFormInput type="text" v-model="project.paper_url" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Logo URL</CFormLabel>
                    <CFormInput type="text" v-model="project.logo_url" />
                </CCol>
            </CForm>
        </CCardBody>
    </CCard>
    <br />
    <br />
    <CCard cclass="mb-3">

        <CCardBody>
            <CCardTitle>Submit</CCardTitle>
            <CCardText>Click below to submit or update this project.</CCardText>
            <CButton v-if="props.new" type="button" v-on:click.native="submit_project(project)" color="primary">Click to
                Submit</CButton>
            <CButton v-else type="button" v-on:click.native="edit_project(project)" color="primary">Click to Submit
            </CButton>
        </CCardBody>
    </CCard>
</template>
  
  
<script setup>
import { ref } from 'vue';
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import * as Values from '@/values.js'
import * as DataFunctions from '@/services/GetData.js'


const showErrors = ref(false)
const errorList = ref([])

const props = defineProps({
    projectData: Object,
    new: Boolean,
})
let emit = defineEmits(['editSubmitProject']);

const router = useRouter()
const project = ref({})
project.value = props.projectData


const submit_project = async function () {


    errorList.value = checkErrors()

    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {

        DataFunctions.ResearcherNewProject(project.value)
            .then(res => {
                router.push('/researcher/my_projects')
            })
    }
}

const edit_project = async function () {
    
    errorList.value = checkErrors()

    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {

        DataFunctions.ResearcherEditProject(project.value)
            .then(res => {
                emit('editSubmitProject')
            })
    }
}

const checkErrors = function () {
    let errors = [];
    if (project.value.name.length < 5) { errors.push("Project name must be 6 or more characters.") }
    if (project.value.authors.length < 1) { errors.push("Author(s) are required.") }
    if (project.value.abstract.length < 10) { errors.push("Project description must be 10 or more characters") }
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

project.value.public = false

</script>
  
  