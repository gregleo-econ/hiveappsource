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
    <CNav variant="tabs" role="tablist" style="border:0px;">
        <CNavItem>
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 1" @click="() => { tabPaneActiveKey = 1 }">
                Projects Table
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 2" @click="() => { tabPaneActiveKey = 2 }">
                Detail for {{ info.name }}
            </CNavLink>
        </CNavItem>
    </CNav>
    <CTabContent>
        <CTabPane role="tabpanel" aria-labelledby="home-tab" :visible="tabPaneActiveKey === 1">
            <CCard class="mb-4 border">
                <CCardBody>
                    <CRow>
                        <CCol :sm="12">

                            <CCardTitle> Projects Table </CCardTitle>
                            <template v-if="!show_detail">
                                Select a project for more detail.<br /><br />
                            </template>
                        </CCol>
                    </CRow>
                    <div style="width:200px; margin-bottom:5px;">
                        <span>Search Field:</span>
                        <CFormSelect v-model="searchField">
                            <option value="name">Project Name</option>
                            <option value="project_id">Project Id #</option>
                            <option value="authors">Authors</option>
                            <option value="keywords">Keywords</option>
                            <option value="jel">JEL Codes</option>
                        </CFormSelect>
                    </div>
                    <div style="width:200px; margin-bottom:10px;">
                        <span>Search Value: </span>
                        <input type="text" v-model="searchValue">
                    </div>
                    <EasyDataTable v-if="show_projects" alternating header-class-name="customize-table-header"
                        header-item-class-name="customize-table-header-item" table-class-name="customize-table"
                        header-text-direction="center" body-text-direction="center" :headers="headers" :items="projects"
                        :search-field="searchField" :search-value="searchValue">
                        <template #item-updated="item">
                            {{ format_date(item.updated * 1000) }}
                        </template>
                        <template #item-detail="item">
                            <CButton color="primary" size="sm" v-on:click='info_project(item)'>Detail
                            </CButton>
                        </template>
                        <template #item-preregistered="item">
                            <h5 v-if="item.preregistered == 'true'">
                                <CBadge color="success" shape="rounded-pill">preregistered</CBadge>
                            </h5>
                            <h5 v-else>
                                <CBadge color="danger" shape="rounded-pill">not preregistered</CBadge>
                            </h5>
                        </template>
                    </EasyDataTable>
                </CCardBody>
            </CCard>
        </CTabPane>
        <CTabPane role="tabpanel" aria-labelledby="profile-tab" :visible="tabPaneActiveKey === 2">
            <CCard>
                <CCardBody>

                    <CRow>
                        <CCol :sm="2">

                            <CCard color="dark" style="height:100%; color:white;">
                                <CCardHeader style="font-weight:bold;">Actions</CCardHeader>
                                <CCardBody style="display:contents;">

                                    <CButton style="margin:10px;" color="primary" size="sm" v-on:click='resetPage'>Close
                                        Detail</CButton>




                                </CCardBody>
                            </CCard>
                        </CCol>
                        <CCol :sm="10">
                            <CRow>
                                <CCol :sm="8">
                                    <CCardTitle>
                                        <h1>{{ info.name }}</h1>
                                    </CCardTitle>
                                </CCol>
                                <CCol :sm="2">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">ID</CCardHeader>
                                        <CCardBody>
                                            <CCardText>#{{ info.project_id }}</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>

                                <CCol :sm="2">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Updated</CCardHeader>
                                        <CCardBody>
                                            <CCardText>{{ format_date(info.updated * 1000) }}</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>

                            </CRow>
                            <br />
                            <CRow>
                                <CCol :sm="6">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Authors</CCardHeader>
                                        <CCardBody>
                                            <CCardText>
                                                <div v-for='author in splitString(info.authors)'>{{ author }}</div>
                                            </CCardText>
                                            <br />
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                <CCol :sm="6">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Project Keywords/JEL</CCardHeader>
                                        <CCardBody>

                                            <b>Keywords: </b>{{ info.keywords }}<br />
                                            <b>JEL: </b>{{ info.jel }}
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <br />
                            <CRow>
                                <CCol :sm="12">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Abstract/Description</CCardHeader>
                                        <CCardBody>
                                            <CCardText>{{ info.abstract }} </CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <br />
                            <CRow>
                                <CCol :sm="6">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Citation</CCardHeader>
                                        <CCardBody>

                                            <CCardText v-if="info.citation != undefined">{{ info.citation }} </CCardText>
                                            <CCardText v-else>No Citation Added</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                                <CCol :sm="6">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Paper Link</CCardHeader>
                                        <CCardBody>
                                            <CCardText v-if="info.paper_url != undefined"><a :href="info.paper_url"
                                                    style="color:blue;">{{ info.name }}</a> </CCardText>
                                            <CCardText v-else>No Paper URL Added</CCardText>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <br />
                            <CRow>
                                <CCol :sm="12">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Preregistration</CCardHeader>
                                        <CCardBody>


                                            <EasyDataTable v-if="show_detail" alternating
                                                header-class-name="customize-table-header"
                                                header-item-class-name="customize-table-header-item"
                                                table-class-name="customize-table" header-text-direction="center"
                                                body-text-direction="center" :headers="preregistration_headers"
                                                :items="preregistrations">
                                                <template #item-date="item">
                                                    {{ format_date(item.date * 1000) }}
                                                </template>
                                                <template #item-getpdf="item">
                                                    <CButton color="success"
                                                        v-on:click='getPdf(item)'>
                                                        Get PDF
                                                    </CButton>
                                                    
                                                </template>
                                            </EasyDataTable>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>
                            <br />
                            <CRow>
                                <CCol :sm="12">
                                    <CCard>
                                        <CCardHeader style="font-weight:bold;">Data</CCardHeader>
                                        <CCardBody>
                                            <EasyDataTable v-if="show_detail" alternating
                                                header-class-name="customize-table-header"
                                                header-item-class-name="customize-table-header-item"
                                                table-class-name="customize-table" header-text-direction="center"
                                                body-text-direction="center" :headers="data_headers" :items="data">
                                                <template #item-uploaded="item">
                                                    {{ format_date(item.uploaded * 1000) }}
                                                </template>
                                                <template #item-download="item">
                                                    <CButton color="success"
                                                        v-on:click='download_file(item.project_id, item.version)'>
                                                        Download
                                                    </CButton>
                                                </template>
                                            </EasyDataTable>
                                        </CCardBody>
                                    </CCard>
                                </CCol>
                            </CRow>


                            <br />



                        </CCol>
                    </CRow>
                    <BR />
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
import * as DataFunctions from '@/services/GetData.js'
import { marked } from 'marked';
import html2pdf from "html2pdf.js";

import { query, firestore, collection } from 'firebase/firestore';
import {fireDb} from '@/firebase.js';

console.log(query(collection(fireDb,"users")))




const projects = ref({})
const info = ref({})
const tabPaneActiveKey = ref(1)
const show_detail = ref(false)
const componentKey = ref(0)
const show_projects = ref(false)
const data = ref({})
const preregistrations = ref({})
const searchField = ref("name");
const searchValue = ref();

const headers = [
    { text: "Detail", value: "detail", sortable: true },
    { text: "ID #", value: "project_id", sortable: true },
    { text: "Project Name", value: "name", sortable: true },
    { text: "Authors", value: "authors", sortable: true },
    { text: "Preregistered?", value: "preregistered", sortable: true },
    { text: "Last Updated", value: "updated", sortable: true }
]

const preregistration_headers = [
    { text: "Get PDF", value: "getpdf", sortable: false },
    { text: "Version", value: "version", sortable: true },
    { text: "Date", value: "date", sortable: true }
]

const data_headers = [
    { text: "Download", value: "download", sortable: false },
    { text: "Version", value: "version", sortable: true },
    { text: "Date", value: "uploaded", sortable: true },
    { text: "Comment", value: "comment", sortable: true }
]

const update_project_table = async function () {
    projects.value = await DataFunctions.GetPublicProjects().then(res => res.data)
    show_projects.value = true
}

update_project_table();

const splitString = function (string) {
    if (string == undefined) { return (string) }
    else { return (string.split(",")) }
}

const format_date = function (date_string) {
    if (date_string == undefined) { return (date_string) }
    var date = new Date(date_string);
    return date.toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
}


const info_project = async function (item) {
    info.value = item;
    data.value = await DataFunctions.GetPublicDataForProject(item.project_id).then(res => res.data)
    preregistrations.value = await DataFunctions.GetPublicPreregistrationsForProject(item.project_id).then(res => res.data)
    show_detail.value = true;
    tabPaneActiveKey.value = 2
}



const resetPage = async function () {
    info.value = {}
    show_detail.value = false
    tabPaneActiveKey.value = 1
    projects.value = await DataFunctions.GetPublicProjects().then(res => res.data)

}

const download_file = async function (project_id, version) {
    const downloadFile = await DataFunctions.PublicDownloadData(project_id, version).then(res => res.data)
    var fileURL = window.URL.createObjectURL(new Blob([downloadFile]));
    var fileLink = document.createElement('a');
    fileLink.href = fileURL;
    fileLink.setAttribute('download', 'hive_' + project_id + "_v" + version + ".csv");
    document.body.appendChild(fileLink);
    fileLink.click();
}

const getPdf = function (item) {
    html2pdf(marked.parse(item.markdown), {
        margin: 10,
        filename: "hive_prereg_id" + item.project_id + ".pdf",
    });
}


update_project_table();



</script>
