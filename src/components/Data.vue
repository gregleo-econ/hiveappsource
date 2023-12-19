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
    <CCard>
        <CCardBody>
            <CCardTitle>
                Download/Upload Data </CCardTitle>
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
                            <CCardTitle> Available Data </CCardTitle>
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
                                            <CButton color="success" v-on:click='download_file(props.project_id, file.version)'>
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
</template>

<script setup>
import { ref } from 'vue'
import * as DataFunctions from '@/services/GetData.js'



const data = ref({})
const showLoading = ref(true)
const dataFile = ref({})
const comment = ref("")
const fileInputKey = ref(0)
const fileTableKey = ref(0)
const uploadErrorList = ref([])
const showUploadErrors = ref(false)
const showUploadConfirm = ref(false)




const props = defineProps({
    project_id: String
})


const uploadData = function () {
    uploadErrorList.value = checkUploadErrors()
    if (uploadErrorList.value.length > 0) {
        showUploadErrors.value = true
    }
    if (uploadErrorList.value.length == 0) {
        
        DataFunctions.ResearcherUploadData(dataFile.value.files[0],comment.value,props.project_id)
            .then(res => {
                comment.value = ""
                fileInputKey.value += 1
                showUploadConfirm.value = true
                DataFunctions.ResearcherGetDataForSession(props.project_id)
                    .then(res => {
                        data.value = res.data;
                        fileTableKey.value += 1
                    });
            });
    }
}


const download_file = async function (project_id, version) {
    const downloadFile = await DataFunctions.ResearcherDownloadData(project_id, version).then(res => res.data)
    var fileURL = window.URL.createObjectURL(new Blob([downloadFile]));
    var fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.setAttribute('download', 'hive_' + project_id + "_v" + version + ".csv");
    document.body.appendChild(fileLink);
    fileLink.click();
}

const checkUploadErrors = function () {
    
    let errors = [];
    if (comment.value.length < 1) { errors.push("Comment must be non-empty.") }
    if (dataFile.value.files[0]==undefined){ errors.push("Upload must be a CSV file.") }
    else if (dataFile.value.files[0].type!="text/csv") { errors.push("Upload must be a CSV file.") }
    return (errors)
}

const format_date = function (date_string) {
    
    if (date_string == undefined) { return (date_string) }
    var date = new Date(date_string);
    return date.toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
}


const updateData = async function () {
    data.value = await DataFunctions.ResearcherGetDataForSession(props.project_id).then(res => res.data)
}

updateData()
</script>