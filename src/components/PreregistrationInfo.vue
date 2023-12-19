<template>
    <CButton color="primary" size="sm" v-on:click='new_registration()'>New Preregistration
    </CButton>
    <br />
    <br />

    <CTable v-if="showTable" align="middle" class="mb-0 border" hover responsive>
        <CTableHead color="light">
            <CTableRow>
                <CTableHeaderCell class="text-center">Version</CTableHeaderCell>
                <CTableHeaderCell class="text-center">Date</CTableHeaderCell>
                <CTableHeaderCell class="text-center">View</CTableHeaderCell>

            </CTableRow>
        </CTableHead>
        <CTableBody>
            <CTableRow v-for="registration in registrations" :key="registration.date">
                <CTableDataCell class="text-center">{{ registration.version }}</CTableDataCell>
                <CTableDataCell class="text-center">{{ format_date(registration.date * 1000) }}</CTableDataCell>

                <CTableDataCell class="text-center">
                    <CButton color="primary" size="sm" v-on:click='show_registration(registration)'>Show
                    </CButton>
                </CTableDataCell>



            </CTableRow>
            <CTableRow> </CTableRow>
        </CTableBody>
    </CTable>
    <br />

    <CRow v-if="showEdit">


        <CCardGroup style="heigt:200px;">
            <CCard>
                <CCardHeader style="font-weight:bold;">Questions</CCardHeader>
                <CCardBody>
                    <!-- A form with seven text area fields-->
                    <CForm class="row g-3">
                        <CRow style="margin-bottom: 10px;">
                            <CCol md="12">
                                <CFormLabel>Experiment Design Overview</CFormLabel>
                                <CFormTextarea :placeholder="placeholderText.experiment_design" rows="3"
                                    v-model="preregistrationData.experiment_design" />
                            </CCol>
                        </CRow>
                        <CRow style="margin-bottom: 10px;">
                            <CCol md="12">
                                <CFormLabel>Hypothesis</CFormLabel>
                                <CFormTextarea :placeholder="placeholderText.hypothesis" rows="3"
                                    v-model="preregistrationData.hypothesis" />
                            </CCol>
                        </CRow>
                        <br />
                        <br />
                        <CRow style="margin-bottom: 10px;">
                            <CCol md="12">
                                <CFormLabel>Analyses</CFormLabel>
                                <CFormTextarea :placeholder="placeholderText.analyses" rows="3"
                                    v-model="preregistrationData.analyses" />
                            </CCol>
                        </CRow>
                        <br />
                        <br />
                        <CRow style="margin-bottom: 10px;">
                            <CCol md="12">
                                <CFormLabel>Outliers</CFormLabel>
                                <CFormTextarea :placeholder="placeholderText.outliers" rows="3"
                                    v-model="preregistrationData.outliers" />

                            </CCol>
                        </CRow>
                        <br />
                        <br />
                        <CRow style="margin-bottom: 10px;">
                            <CCol md="12">
                                <CFormLabel>Sample</CFormLabel>
                                <CFormTextarea :placeholder="placeholderText.sample" rows="3"
                                    v-model="preregistrationData.sample" />
                            </CCol>
                        </CRow>
                        <br />
                        <br />
                        <CRow style="margin-bottom: 10px;">
                            <CCol md="12">
                                <CFormLabel>Other</CFormLabel>
                                <CFormTextarea :placeholder="placeholderText.other" rows="3"
                                    v-model="preregistrationData.other" />
                            </CCol>
                        </CRow>
                        <br />
                        <br />
                    </CForm>
                </CCardBody>
                <CCardFooter>
                    <CButton style="width:99%;" color="primary" size="sm" v-on:click='submit()'>Submit New Version
                    </CButton>
                </CCardFooter>

            </CCard>
            <CCard color="dark" style="color:white">
                <CCardHeader style="font-weight:bold;">Preview</CCardHeader>
                <CCardBody>
                    <div style="height:100%; overflow-y:auto;" :key="previewKey" v-html="markdownToHtml"></div>
                </CCardBody>
                <CCardFooter>
                    <CButton style="width:99%;" color="primary" size="sm" v-on:click='getPdf()'>Download PDF
                    </CButton>
                </CCardFooter>
            </CCard>

        </CCardGroup>

        <center>


        </center>

    </CRow>

    <CRow v-if="showPreview">
        <h1>Preview of {{ markdownTitle }}</h1>

        <CCardGroup style="heigt:200px;">
            <CCard color="dark" style="color:white">
                <CCardHeader style="font-weight:bold;">Preview</CCardHeader>
                <CCardBody>
                    <div style="height:400px; overflow-y:auto;" :key="previewKey" v-html="markdownToHtml"></div>
                </CCardBody>
                <CCardFooter>
                    <CButton style="width:99%;" color="primary" size="sm" v-on:click='getPdf()'>Download PDF
                    </CButton>
                </CCardFooter>
            </CCard>

        </CCardGroup>


    </CRow>
</template>

<script setup>
import { marked } from 'marked';
import { ref, watch } from 'vue'
import * as DataFunctions from '@/services/GetData.js'
import html2pdf from "html2pdf.js";
const registrations = ref({})
const showEdit = ref(false)
const showPreview = ref(false)
const showTable = ref(false)
const preregistrationData = ref({
    experiment_design: "",
    hypothesis: "",
    dependent_variable: "",
    conditions: "",
    analyses: "",
    outliers: "",
    sample: "",
    other: "",
})



const placeholderText = {
    experiment_design: "Enter a description of your experimental design here. This should include as much detail as needed to describe your hypotheses and analysis.",
    hypothesis: "Enter all of the hypotheses you will test.",
    analyses: "Enter all of the analyses you will run to test your hypotheses.",
    outliers: "Enter any information about how you exclude data from your analyses. If you will not exclude any data, please write 'None'.",
    sample: "Enter all information about your sample including who will be elibible, the number of participants per treatment, etc.",
    other: "Enter any other information you want to include in the preregistration.",
}


const updatePage = async function () {
    showTable.value = false
    registrations.value = await DataFunctions.ResearcherGetPreregistrations(props.project.project_id).then(res => res.data)
    const numberRegistration = registrations.value.length
    if (numberRegistration > 0) {
        showTable.value = true
        show_registration(registrations.value[numberRegistration - 1])
    }
    else {
        markdownTitle.value = "New Preregistration"
        showPreview.value = false
        showEdit.value = true
    }
}



const props = defineProps({
    project: Object,
    new: Boolean,
})

const markdown = ref("")
const markdownToHtml = ref("")
const previewKey = ref(0)
const markdownTitle = ref("New Registration")

const getPdf = function () {
    html2pdf(marked.parse(markdown.value), {
        margin: 10,
        filename: "hive_prereg_id" + props.project.project_id + ".pdf",
    });

}

const new_registration = function () {
    preregistrationData.value = {
        experiment_design: "",
        hypothesis: "",
        dependent_variable: "",
        conditions: "",
        analyses: "",
        outliers: "",
        sample: "",
        other: "",
    }
    markdownTitle.value = "New Registration"
    showPreview.value = false
    showEdit.value = true
}

// const edit_registration = function (registration) {

//     markdown.value = registration.markdown
//     markdownTitle.value = "Working from Version " + registration.version
//     showPreview.value = false
//     showEdit.value = true
// }


const show_registration = function (registration) {

    markdown.value = registration.markdown
    markdownToHtml.value = marked.parse(markdown.value)
    markdownTitle.value = "Version " + registration.version
    showEdit.value = false
    showPreview.value = true


}

const submit = async function () {

    await DataFunctions.ResearcherNewPreregistration(props.project.project_id, markdown.value)
    updatePage();



}

markdownToHtml.value = marked.parse(markdown.value)

watch(preregistrationData, (newPreregistrationData) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;

    markdown.value = "# Preregistration for *" + props.project.name + "*\n\n" +
        "Authors: *" + props.project.authors + "*\n\n" +
        "```HIVE Project Id #" + props.project.project_id + "``` \n\n" +
        "```Submitted " + today + "``` \n\n" +
        "## Experiment Design \n" + newPreregistrationData.experiment_design + "\n\n" +
        "## Hypotheses \n" + newPreregistrationData.hypothesis + "\n\n" +
        "## Analyses \n" + newPreregistrationData.analyses + "\n\n" +
        "## Outliers \n" + newPreregistrationData.outliers + "\n\n" +
        "## Sample \n" + newPreregistrationData.sample + "\n\n" +
        "## Other \n" + newPreregistrationData.other + "\n\n"
    markdownToHtml.value = marked.parse(markdown.value)
    previewKey.value += 1;
},
    { deep: true })

const format_date = function (date_string) {
    var date = new Date(date_string);
    return date.toLocaleDateString("en-US", { year: "2-digit", month: "2-digit", day: "2-digit" });
}

updatePage()

</script>