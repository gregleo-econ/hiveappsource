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
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 3" @click="() => { tabPaneActiveKey = 3 }">
                Preregistration
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 4" @click="() => { tabPaneActiveKey = 4 }">
                Data
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_detail">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 5" @click="() => { tabPaneActiveKey = 5 }">
                Code
            </CNavLink>
        </CNavItem>
        <CNavItem v-if="show_edit">
            <CNavLink href="javascript:void(0);" :active="tabPaneActiveKey === 6" @click="() => { tabPaneActiveKey = 6 }">
                Edit {{ info.name }}
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
                    <EasyDataTable v-if="show_projects" alternating header-class-name="customize-table-header"
                        header-item-class-name="customize-table-header-item" table-class-name="customize-table"
                        header-text-direction="center" body-text-direction="center" :headers="headers" :items="projects">
                        <template #item-updated="item">
                            {{ format_date(item.updated * 1000) }}
                        </template>
                        <template #item-detail="item">
                            <CButton color="primary" size="sm" v-on:click='info_project(item)'>Detail
                            </CButton>
                        </template>
                        <template #item-preregistered="item">
                            <span v-if="item.preregistered == 'true'" class="text-bg-dark text-success" style="font-weight:bold; padding:5px; border-radius: 3px;" >preregistered</span>
                            
                            <span v-else class="text-bg-dark text-danger" style="font-weight:bold; padding:5px; border-radius: 3px;" >not preregistered</span>
                            
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

                                    <CButton style="margin:10px;" color="primary" size="sm" v-on:click='edit_project(info)'>
                                        Edit
                                    </CButton>


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
                        </CCol>
                    </CRow>
                    <BR />
                </CCardBody>
            </CCard>
        </CTabPane>
        <CTabPane role="tabpanel" v-if="show_detail" aria-labelledby="upload-tab" :visible="tabPaneActiveKey === 3">
            <CCard>
                <CCardBody>
                    <preregistrationComponent :project="info" new="false" v-if="show_detail"></preregistrationComponent>
                </CCardBody>
            </CCard>
        </CTabPane>

        <CTabPane role="tabpanel" v-if="show_detail" aria-labelledby="upload-tab" :visible="tabPaneActiveKey === 4">
            <dataComponent v-if="show_detail" :project_id="info.project_id"></dataComponent>
        </CTabPane>
        <CTabPane role="tabpanel" v-if="show_detail" aria-labelledby="upload-tab" :visible="tabPaneActiveKey === 5">
            <CCard>
                <CCardBody>
                    <h3>Coming Soon</h3>
                </CCardBody>
            </CCard>
        </CTabPane>

        <CTabPane role="tabpanel" v-if="show_edit" aria-labelledby="edit-tab" :visible="tabPaneActiveKey === 6">
            <CCard>
                <CCardBody>
                    <CRow>
                        <CCol sm="10">
                            <CCardTitle>Edit {{ info.name }}</CCardTitle>
                        </CCol>
                        <CCol sm="2" style="text-align:right">
                            <CButton color="primary" size="sm" v-on:click='resetPage'>Close this Form</CButton>
                        </CCol>
                    </CRow>
                    <BR />

                    <projectInfo :key="componentKey" @editSubmitProject="resetPage" v-if="show_edit" @editSubmit="resetPage"
                        :projectData="info" :new="false">
                    </projectInfo>
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
import dataComponent from '@/components/Data.vue'
import preregistrationComponent from '@/components/PreregistrationInfo.vue'
import { useStore } from 'vuex'
import projectInfo from '@/components/ProjectInfo.vue'
import * as DataFunctions from '@/services/GetData.js'
const projects = ref({})
const info = ref({})
const tabPaneActiveKey = ref(1)
const show_edit = ref(false)
const show_detail = ref(false)
const componentKey = ref(0)
const show_projects = ref(false)

const headers = [
    { text: "Detail", value: "detail", sortable: true },
    { text: "ID #", value: "project_id", sortable: true },
    { text: "Project Name", value: "name", sortable: true },
    { text: "Authors", value: "authors", sortable: true },
    { text: "Preregistered?", value: "preregistered", sortable: true },
    { text: "Last Updated", value: "updated", sortable: true }
]

// console.log(DataFunctions.QueryDB("SELECT * FROM projects"))

const update_project_table = async function () {
    projects.value = await DataFunctions.ResearcherGetProjects().then(res => res.data)
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
    show_edit.value = false;
    info.value = item;
    show_detail.value = true;
    tabPaneActiveKey.value = 2

}

const edit_project = function (item) {
    show_detail.value = false;
    show_edit.value = true;
    info.value = item;
    componentKey.value += 1;
    tabPaneActiveKey.value = 6;
}

const resetPage = async function () {
    show_projects.value = false
    info.value = {}
    projects.value = {}
    show_detail.value = false
    show_edit.value = false
    tabPaneActiveKey.value = 1
    projects.value = await DataFunctions.ResearcherGetProjects().then(res => res.data)
    show_projects.value = true
}




update_project_table();



</script>
