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
                    <CFormInput type="text" disabled v-model="project.id" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Project Name</CFormLabel>
                    <CFormInput type="text" v-model="project.name" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Owner</CFormLabel>
                    <CFormInput type="text" v-model="project.owner" disabled />
                </CCol>
                <CCol md="6">
                    <CFormLabel>Project Description</CFormLabel>

                    <CFormTextarea v-model="project.description" aria-label="External Study Description"></CFormTextarea>
                </CCol>
                <CCol md="6">
                    <CFormLabel>Abstract</CFormLabel>

                    <CFormTextarea v-model="project.abstract" aria-label="External Study Description"></CFormTextarea>

                </CCol>
                <CCol md="6">
                    <CFormLabel>Keywords (Comma Separated)</CFormLabel>
                    <CFormInput type="text" v-model="project.keywords" />
                </CCol>
                <CCol md="6">
                    <CFormLabel>JEL Codes</CFormLabel>
                    <Select2 v-model="project.jel" :settings="select2Settings.multiple" :options="jelCodes" />
                </CCol>
                <CCol md="12">
                    <CFormLabel>Paper Citation (If Available)</CFormLabel>
                    <CFormInput type="text" v-model="project.citation" />
                </CCol>
                <CCol md="12">
                    <CFormLabel>Linked Experiments</CFormLabel>
                    <Select2 v-model="project.linked_experiments" :settings="select2Settings.multiple"
                        :options="experimentList" />
                </CCol>
                <CCol md="12">
                    <CFormLabel>Collaborators</CFormLabel>
                    <Select2 v-model="project.collaborators" :settings="select2Settings.multiple"
                        :options="researcherList" />
                </CCol>

            </CForm>
        </CCardBody>
    </CCard>



    <br />
    <CCard cclass="mb-3">

        <CCardBody>
            <CCardTitle>Submit</CCardTitle>
            <CCardText>Click below to submit this project.</CCardText>            
            <CButton v-if="props.new" type="button" v-on:click.native="submit_project()" color="primary">Click to
                Submit</CButton>
            <CButton v-else type="button" v-on:click.native="edit_project()" color="primary">Click to Submit
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
const experimentList = ref()
const researcherList = ref()

const props = defineProps({
    projectData: Object,
    new: Boolean,
})
const project = ref({})
project.value = props.projectData


axios
    .get('http://127.0.0.1:9985/researcher/get_experiment_list')
    .then(res => {

        experimentList.value = res.data
        experimentList.value.forEach(function (data) {
            data['text'] = data['internal_study_name'];
            delete data['internal_study_name'];
        });


    })
    .catch(function (error) { return ([]) });;


axios
    .get('http://127.0.0.1:9985/researcher/get_researcher_list')
    .then(res => {

        researcherList.value = res.data
        researcherList.value.forEach(function (data) {
            data['id'] = data['email']
            data['text'] = data['first_name'] + " " + data['last_name'] + " at " + data['institution'];
            // delete data['fist_name'];
            // delete data['last_name'];
            // delete data['institution'];
            // delete data['email'];
        });


    })
    .catch(function (error) { return ([]) });;



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
        .catch(function (error) { return ([]) });;
}

const router = useRouter()
const store = useStore()



const submit_project = function () {


    errorList.value = checkErrors()

    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {

        let projectDataForSubmit = {
            name : project.value.name,
            description : project.value.description,
            jel : project.value.jel.join(","),
            keywords : project.value.keywords,
            abstract : project.value.abstract,
            citation : project.value.citation,
            owner : project.value.owner,
            linked_experiments : project.value.linked_experiments.join(","),
            collaborators : project.value.collaborators.join(",")
        }

        axios
            .post('http://127.0.0.1:9985/researcher/new_project', projectDataForSubmit)
            .then(res => {
                router.push('/researcher/my_projects')

            })
    }






}


const edit_project = async function () {

    sqlFilter.value = makeFullFilter(myValue._value.filter)
    eligibleNumber.value = await check_eligible_number(sqlFilter.value)

    errorList.value = checkErrors()
    if (errorList.value.length > 0) {
        showErrors.value = true
    }
    if (errorList.value.length == 0) {

        project.value.pool_filter = makeFullFilter(myValue._value.filter)
        let studyData = {
            researcher: store.state.user.email,
            id: project.value.id,
            internal_study_name: project.value.internal_study_name,
            external_study_name: project.value.external_study_name,
            created: project.value.created,
            external_description: project.value.external_description,
            study_duration: project.value.study_duration,
            participation_fee: project.value.participation_fee,
            average_pay: project.value.average_pay,
            quota: project.value.quota,
            pool_filter: project.value.pool_filter,
            pool_filter_json: JSON.stringify(myValue._value.filter),
            study_url: project.value.study_url,
            logo_url: project.value.logo_url
        }
        console.log(studyData)
        axios
            .post('http://127.0.0.1:9985/researcher/edit_experiment', studyData)
            .then(res => {
                emit('editSubmit')


            })
    }


}

const checkErrors = function () {
    let errors = [];

    if (project.value.name.length < 5) { errors.push("Project Name must be 6 or more characters") }
    if (project.value.description.length < 5) { errors.push("Project Description must be 6 or more characters") }
    
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



const jelCodes = [{ id: 'A', text: 'A - General Economics and Teaching' },
{ id: 'A1', text: 'A1 - General Economics' },
{ id: 'A10', text: 'A10 - General' },
{ id: 'A11', text: 'A11 - Role of Economics; Role of Economists; Market for Economists' },
{ id: 'A12', text: 'A12 - Relation of Economists to Other Disciplines' },
{ id: 'A13', text: 'A13 - Relation of Economics to Social Values' },
{ id: 'A14', text: 'A14 - Sociology of Economics' },
{ id: 'A19', text: 'A19 - Other' },
{ id: 'A2 ', text: 'A20 - General' },
{ id: 'A21', text: 'A21 - Pre-college' },
{ id: 'A22', text: 'A22 - Undergraduate' },
{ id: 'A23', text: 'A23 - Graduate' },
{ id: 'A29', text: 'A29 - Other' },
{ id: 'B', text: 'B0 - General' },
{ id: 'B3', text: 'B3 - History of Thought: Individuals' },
{ id: 'B30', text: 'B30 - General' },
{ id: 'B31', text: 'B31 - Individuals' },
{ id: 'B00', text: 'B00 - General' },
{ id: 'B1', text: 'B1 - History of Economic Thought trough 1925' },
{ id: 'B10', text: 'B10 - General' },
{ id: 'B11', text: 'B11 - Preclassical' },
{ id: 'B12', text: 'B12 - Classical' },
{ id: 'B13', text: 'B13 - Neoclassical through 1925' },
{ id: 'B14', text: 'B14 - Socialist; Marxist' },
{ id: 'B15', text: 'B15 - Historical; Institutional' },
{ id: 'B16', text: 'B16 - Quantitative' },
{ id: 'B19', text: 'B19 - Other' },
{ id: 'B2', text: 'B2 - History of Economic Thought since 1925' },
{ id: 'B20', text: 'B20 - General' },
{ id: 'B21', text: 'B21 - Microeconomics' },
{ id: 'B22', text: 'B22 - Macroeconomics' },
{ id: 'B23', text: 'B23 - Econometrics, Quantitative Studies' },
{ id: 'B24', text: 'B24 - Socialist; Marxist' },
{ id: 'B25', text: 'B25 - Historical; Institutional; Evolutionary; Austrian' },
{ id: 'B29', text: 'B29 - Other' },
{ id: 'B4', text: 'B4 - Economic Methodology' },
{ id: 'B40', text: 'B40 - General' },
{ id: 'B41', text: 'B41 - Economic Methodology' },
{ id: 'B49', text: 'B49 - Other' },
{ id: 'B50', text: 'B50 - General' },
{ id: 'B51', text: 'B51 - Socialist; Marxian; Sraffian' },
{ id: 'B52', text: 'B52 - Institutional; Evolutionary' },
{ id: 'B53', text: 'B53 - Austrian' },
{ id: 'B59', text: 'B59 - Other' },
{ id: 'C', text: 'C - Mathematical and Quantitative Methods' },
{ id: 'C0', text: 'C0 - General' },
{ id: 'C00', text: 'C00 - General' },
{ id: 'C1', text: 'C1 - Econometric ans Statistical Methods : General' },
{ id: 'C10', text: 'C10 - General' },
{ id: 'C11', text: 'C11 - Bayesian Analysis' },
{ id: 'C12', text: 'C12 - Hypothesis ' },
{ id: 'C14', text: 'C14 - Semiparametric and Nonparametric Methods' },
{ id: 'C15', text: 'C15 - Statistical Simulation Methods: Single Equation Models; Monte Carlo Methods; Boostrap Methods' },
{ id: 'C16', text: 'C16 - Specific Distributions' },
{ id: 'C19', text: 'C19 - Other' },
{ id: 'C2', text: 'C2 - Econometric Methods: Single Equation Models; Singles Variables' },
{ id: 'C20', text: 'C20 - General' },
{ id: 'C21', text: 'C21 - Cross-Sectional Models; Spatial Models; Treatment Effect Models' },
{ id: 'C22', text: 'C22 - Time-Series Models' },
{ id: 'C23', text: 'C23 - Models with Panel Data' },
{ id: 'C24', text: 'C24 - Truncated and Censored Models' },
{ id: 'C25', text: 'C25 - Discrete Regression and Qualitative Choice Models' },
{ id: 'C29', text: 'C29 - Other' },
{ id: 'C3', text: 'C3 - Econometric Methods - Multiple/Simultaneous Equation Models; Multiple Variables' },
{ id: 'C30', text: 'C30 - General' },
{ id: 'C31', text: 'C31 - Cross-Sectional Models; Spatial Models; Treatment Effect Models' },
{ id: 'C32', text: 'C32 - Time-Series Models' },
{ id: 'C34', text: 'C34 - Truncated and Censored Models' },
{ id: 'C35', text: 'C35 - Discrete Regression and Qualitative Choice Models' },
{ id: 'C39', text: 'C39 - Other' },
{ id: 'C4', text: 'C4 - Econometric and Statistical Methods: Special Topics' },
{ id: 'C40', text: 'C40 - General' },
{ id: 'C41', text: 'C41 - Duration Analysis' },
{ id: 'C42', text: 'C42 - Survey Methods' },
{ id: 'C43', text: 'C43 - Index Numbers and Aggregation' },
{ id: 'C44', text: 'C44 - Statistical Decision Theory; Operations Research' },
{ id: 'C45', text: 'C45 - Neural Network and Related Topics' },
{ id: 'C49', text: 'C49 - Other' },
{ id: 'C5', text: 'C5 - Econometric Modeling' },
{ id: 'C50', text: 'C50 - General' },
{ id: 'C51', text: 'C51 - Model Construction and Estimation' },
{ id: 'C52', text: 'C52 - Model Evaluation and Testing' },
{ id: 'C53', text: 'C53 - Forecasting and Other Model Applications' },
{ id: 'C59', text: 'C59 - Other' },
{ id: 'C6', text: 'C6 - Mathematical Methods and Programming' },
{ id: 'C60', text: 'C60 - General' },
{ id: 'C61', text: 'C61 - OPtimization Techniques; Programming Models; Dynamic Analysis' },
{ id: 'C62', text: 'C62 - Existence and Stability Condition of Equilibrium' },
{ id: 'C63', text: 'C63 - Computational Techniques' },
{ id: 'C65', text: 'C65 - Miscellaneous Mathematical Tools' },
{ id: 'C67', text: 'C67 - Input-Output Models' },
{ id: 'C68', text: 'C68 - Computable General Equilibrium Models' },
{ id: 'C69', text: 'C69 - Other' },
{ id: 'C7', text: 'C7 - Game Theory and Bargaining Theory' },
{ id: 'C70', text: 'C70 - General' },
{ id: 'C71', text: 'C71 - Cooperative Games' },
{ id: 'C72', text: 'C72 - Noncooperative Games' },
{ id: 'C73', text: 'C73 - Stochastic and Dynamic Games; Evolutionary Games' },
{ id: 'C78', text: 'C78 - Bargaining Theory; Matching Theory' },
{ id: 'C79', text: 'C79 - Other' },
{ id: 'C8', text: 'C8 - Data Collection and Data Estimation Methodology; Computer Programs' },
{ id: 'C80', text: 'C80 - General' },
{ id: 'C81', text: 'C81 - Methodology for Collecting; Estimating; and Organizing Microeconomic Data' },
{ id: 'C82', text: 'C82 - Methodology for Collecting; Estimating; and Organizing Macroeconomic Data' },
{ id: 'C87', text: 'C87 - Econometric Software' },
{ id: 'C88', text: 'C88 - Other Computer Software' },
{ id: 'C89', text: 'C89 - Other' },
{ id: 'C9', text: 'C9 - Design of Experiments' },
{ id: 'C90', text: 'C90 - General' },
{ id: 'C91', text: 'C91 - Laboratory; Individual Behavior' },
{ id: 'C92', text: 'C92 - Laboratory; Group Behavior' },
{ id: 'C93', text: 'C93 - Field Experiments' },
{ id: 'C99', text: 'C99 - Other' },
{ id: 'D', text: 'D - Microeconomics' },
{ id: 'D0', text: 'D0 - General' },
{ id: 'D00', text: 'D00 - General' },
{ id: 'D01', text: 'D01 - Microeconomic Behavior: Underlying Principles' },
{ id: 'D02', text: 'D02 - Institutions: Design; Formation; and Operations' },
{ id: 'D1', text: 'D1 - Household Behavior and Family Economics' },
{ id: 'D10', text: 'D10 - General' },
{ id: 'D11', text: 'D11 - Consumer Economics: Theory' },
{ id: 'D12', text: 'D12 - Consumer Economics: Empirical Analysis' },
{ id: 'D13', text: 'D13 - Household Production and Intrahousehold Allocation' },
{ id: 'D14', text: 'D14 - Personal Finance' },
{ id: 'D18', text: 'D18 - Consumer Production' },
{ id: 'D19', text: 'D19 - Other' },
{ id: 'D2', text: 'D2 - Production and Organizations' },
{ id: 'D20', text: 'D20 - General' },
{ id: 'D21', text: 'D21 - Firm Behavior' },
{ id: 'D23', text: 'D23 - Organizational Behavior; Transaction Costs; Property Rights' },
{ id: 'D24', text: 'D24 - Production; Capital and Total Factor Productivity; Capacity' },
{ id: 'D29', text: 'D29 - Other' },
{ id: 'D3', text: 'D3 - Distribution' },
{ id: 'D30', text: 'D30 - General' },
{ id: 'D31', text: 'D31 - Personal Income; Wealth; and Their Distribution' },
{ id: 'D33', text: 'D33 - Factor Income Distribution' },
{ id: 'D39', text: 'D39 - Other' },
{ id: 'D4', text: 'D4 - Market Structure and Pricing' },
{ id: 'D40', text: 'D40 - General' },
{ id: 'D41', text: 'D41 - Perfect Competition' },
{ id: 'D42', text: 'D42 - Monopoly' },
{ id: 'D43', text: 'D43 - Oligopoly and Other Forms of Market Imperfection' },
{ id: 'D44', text: 'D44 - Auctions' },
{ id: 'D45', text: 'D45 - Rationing; Licensing' },
{ id: 'D46', text: 'D46 - Value Theory' },
{ id: 'D49', text: 'D49 - Other' },
{ id: 'D5', text: 'D5 - General Equilibrium and Disequilibrium' },
{ id: 'D50', text: 'D50 - General' },
{ id: 'D51', text: 'D51 - Exchange and Production Economies' },
{ id: 'D52', text: 'D52 - Incomplete Markets' },
{ id: 'D57', text: 'D57 - Input-Output Tables and Analysis' },
{ id: 'D58', text: 'D58 - Computable and Other Applied General Equilibrium Models' },
{ id: 'D59', text: 'D59 - Other' },
{ id: 'D6', text: 'D6 - Welfare Economics' },
{ id: 'D60', text: 'D60 - General' },
{ id: 'D61', text: 'D61 - Allocative Efficiency; Cost-Benefit Analysis' },
{ id: 'D63', text: 'D63 - Equity; Justice; Inequality; and Other Normative Criteria and Measurement' },
{ id: 'D64', text: 'D64 - Altruism' },
{ id: 'D69', text: 'D69 - Other' },
{ id: 'D7', text: 'D7 - Analysis of Collective Decision-Making' },
{ id: 'D70', text: 'D70 - General' },
{ id: 'D71', text: 'D71 - Social Choice; Clubs; Committees; Associations' },
{ id: 'D72', text: 'D72 - Economic Models of Political Processes: Rent-Seeking; Elections; Legislatures; and Voting Behavior' },
{ id: 'D73', text: 'D73 - Bureaucracy; Administrative Processes in Public Organizations; Corruption' },
{ id: 'D74', text: 'D74 - Conflict; Conflict Resolution; Alliances' },
{ id: 'D78', text: 'D78 - Positive Analysis of Policy-Making and Implementation' },
{ id: 'D79', text: 'D79 - Other' },
{ id: 'D8', text: 'D8 - Information; Knowledge; and Uncertainty' },
{ id: 'D80', text: 'D80 - General' },
{ id: 'D81', text: 'D81 - Criteria for Decision-Making under Risk and Uncertainty' },
{ id: 'D82', text: 'D82 - Asymmetric and Private Information' },
{ id: 'D83', text: 'D83 - Search; Learning; Information and Knowledge' },
{ id: 'D84', text: 'D84 - Expectations; Speculations' },
{ id: 'D85', text: 'D85 - Network Formation' },
{ id: 'D86', text: 'D86 - Economics of Contract Law' },
{ id: 'D89', text: 'D89 - Other' },
{ id: 'D9', text: 'D9 - Intertemporal Choice and Growth' },
{ id: 'D90', text: 'D90 - General' },
{ id: 'D91', text: 'D91 - Intertemporal Consumer Choice; Life Cycle Models and Saving' },
{ id: 'D92', text: 'D92 - Intertemporal Firm Choice and Growth; Investment; or Financing' },
{ id: 'D99', text: 'D99 - Other' },
{ id: 'E', text: 'E - Macroeconomics and Monetary Economics' },
{ id: 'E0', text: 'E0 - General' },
{ id: 'E00', text: 'E00 - General' },
{ id: 'E01', text: 'E01 - Measurement and Data on National Income and Product Accounts and Wealth' },
{ id: 'E1', text: 'E1 - General Aggregative Models' },
{ id: 'E10', text: 'E10 - General' },
{ id: 'E11', text: 'E11 - Marxian; Sraffian; Institutional; Evolutionary' },
{ id: 'E12', text: 'E12 - Keynes; Keynesian; Post-Keynesian' },
{ id: 'E13', text: 'E13 - Neoclassical' },
{ id: 'E17', text: 'E17 - Forecasting and Simulation' },
{ id: 'E19', text: 'E19 - Other' },
{ id: 'E2', text: 'E2 - Consumption; Saving; Production; Employment; and Investment' },
{ id: 'E20', text: 'E20 - General' },
{ id: 'E21', text: 'E21 - Consumption; Saving' },
{ id: 'E22', text: 'E22 - Capital; Investment (including Inventories); Capacity' },
{ id: 'E23', text: 'E23 - Production' },
{ id: 'E24', text: 'E24 - Employment; Unemployment; Wages' },
{ id: 'E25', text: 'E25 - Aggregate Factor Income Distribution' },
{ id: 'E26', text: 'E26 - Informal Economy; Underground Economy' },
{ id: 'E27', text: 'E27 - Forecasting and Simulation' },
{ id: 'E29', text: 'E29 - Other' },
{ id: 'E3', text: 'E3 - Prices; Business Fluctuations; and Cycles' },
{ id: 'E30', text: 'E30 - General' },
{ id: 'E31', text: 'E31 - Price Level; Inflation; Deflation' },
{ id: 'E32', text: 'E32 - Business Fluctuations; Cycles' },
{ id: 'E39', text: 'E39 - Other' },
{ id: 'E4', text: 'E4 - Money and Interested Rates' },
{ id: 'E40', text: 'E40 - General' },
{ id: 'E41', text: 'E41 - Demand for Money' },
{ id: 'E42', text: 'E42 - Monetary Systems; Standards; Regimes; Government and the Monetary System' },
{ id: 'E43', text: 'E43 - Determination of Interest Rates; Terms Structure of Interest Rates' },
{ id: 'E44', text: 'E44 - Financial Markets and the Macroeconomy' },
{ id: 'E47', text: 'E47 - Forecasting and Simulation' },
{ id: 'E49', text: 'E49 - Other' },
{ id: 'E5', text: 'E5 - Monetary Policy; Central Banking; and the Supply of Money and Credit' },
{ id: 'E50', text: 'E50 - General' },
{ id: 'E51', text: 'E51 - Money Supply; Credit; Money Multipliers' },
{ id: 'E52', text: 'E52 - Monetary Policy (Targets; Instruments; and Effects)' },
{ id: 'E58', text: 'E58 - Central Bank and Their Policies' },
{ id: 'E59', text: 'E59 - Other' },
{ id: 'E6', text: 'E6 - Macroeconomic Policy Formation; MAcroeconomic Aspects of Public Finance; Macroeconomic Policy; and General Outlook' },
{ id: 'E60', text: 'E60 - General' },
{ id: 'E61', text: 'E61 - Policy Objectives; Policy Designs and Consistency; Policy Coordination' },
{ id: 'E62', text: 'E62 - Fiscal Policy; Public Expenditures; Investment; and Finance; Taxation' },
{ id: 'E63', text: 'E63 - Comparative or Joint Analysis of Fiscal and Monetary Policy; Stabilization' },
{ id: 'E64', text: 'E64 - Incomes Policy; Price Policy' },
{ id: 'E65', text: 'E65 - Studies of Particular Policy Episodes' },
{ id: 'E66', text: 'E66 - General Outlook and Conditions' },
{ id: 'E69', text: 'E69 - Other' }, ,
{ id: 'F', text: 'F - International Economics' },
{ id: 'F0', text: 'F0 - General' },
{ id: 'F00', text: 'F00 - General' },
{ id: 'F01', text: 'F01 - Global Outlook' },
{ id: 'F1', text: 'F1 - Trade' },
{ id: 'F10', text: 'F10 - General' },
{ id: 'F11', text: 'F11 - Neoclassical Models of Trade' },
{ id: 'F12', text: 'F12 - Models of Trade with Imperfect Competition and Scale Economies' },
{ id: 'F13', text: 'F13 - Commercial Policy; Protection; Promotion; Trade Negotiations; International Organizations' },
{ id: 'F14', text: 'F14 - Country an Industry Studies of Trade' },
{ id: 'F15', text: 'F15 - Economic Integration' },
{ id: 'F16', text: 'F16 - Trade and Labor Market Interactions' },
{ id: 'F17', text: 'F17 - Trade Forecasting and Simulation' },
{ id: 'F18', text: 'F18 - Trade and Environment' },
{ id: 'F19', text: 'F19 - Other' },
{ id: 'F2', text: 'F2 - International Factor Movements and International Business' },
{ id: 'F20', text: 'F20 - General' },
{ id: 'F21', text: 'F21 - International Investment; Long-Term Capital Movements' },
{ id: 'F22', text: 'F22 - International Migration' },
{ id: 'F23', text: 'F23 - Multinational Firms; International Business' },
{ id: 'F29', text: 'F29 - Other' },
{ id: 'F3', text: 'F3 - International Finance' },
{ id: 'F30', text: 'F30 - General' },
{ id: 'F31', text: 'F31 - Foreign Exchange' },
{ id: 'F32', text: 'F32 - Current Account Adjustment; Short-Term Capital Movements' },
{ id: 'F33', text: 'F33 - International Monetary Arrangements and Institutions' },
{ id: 'F34', text: 'F34 - International Lending and Debt Problems' },
{ id: 'F35', text: 'F35 - Foreign Aid' },
{ id: 'F36', text: 'F36 - Financial Aspects of Economic Integration' },
{ id: 'F39', text: 'F39 - Other' },
{ id: 'F4', text: 'F4 - Macroeconomic Aspects of International Trade and Finance' },
{ id: 'F40', text: 'F40 - General' },
{ id: 'F41', text: 'F41 - Open Economy Macroeconomics' },
{ id: 'F42', text: 'F42 - International Policy Coordination and Transmission' },
{ id: 'F43', text: 'F43 - Economic Growth of Open Economies' },
{ id: 'F47', text: 'F47 - Forecasting and Simulation' },
{ id: 'F49', text: 'F49 - Other' },
{ id: 'G', text: 'G - Financial Economics' },
{ id: 'G0', text: 'G0 - General' },
{ id: 'G00', text: 'G00 - General' },
{ id: 'G1', text: 'G1 - General Financial Markets' },
{ id: 'G10', text: 'G10 - General' },
{ id: 'G11', text: 'G11 - Portfolio Choice; Investment Decisions' },
{ id: 'G12', text: 'G12 - Asset Pricing' },
{ id: 'G13', text: 'G13 - Contingent Pricing; Futures Pricing' },
{ id: 'G14', text: 'G14 - Information and Market Efficiency; Event Studies' },
{ id: 'G15', text: 'G15 - International Financial Markets' },
{ id: 'G18', text: 'G18 - Government Policy and Regulation' },
{ id: 'G19', text: 'G19 - Other' },
{ id: 'G2', text: 'G2 - Financial Institutions and Services' },
{ id: 'G20', text: 'G20 - General' },
{ id: 'G21', text: 'G21 - Banks; Other Depository Institutions; Mortgages' },
{ id: 'G22', text: 'G22 - Insurance; Insurance Companies' },
{ id: 'G23', text: 'G23 - Pension Funds; Other Private Financial Institutions' },
{ id: 'G24', text: 'G24 - Investment Banking; Venture Capital; Brokerage' },
{ id: 'G28', text: 'G28 - Government Policy and Regulation' },
{ id: 'G29', text: 'G29 - Other' },
{ id: 'G3', text: 'G3 - Corporate Finance and Governance' },
{ id: 'G30', text: 'G30 - General' },
{ id: 'G31', text: 'G31 - Capital Budgeting; Investment Policy' },
{ id: 'G32', text: 'G32 - Financing Policy; Capital and Ownership Structure' },
{ id: 'G33', text: 'G33 - Bankruptcy; Liquidation' },
{ id: 'G34', text: 'G34 - Mergers; Acquisitions; Restructuring; Corporate Governance' },
{ id: 'G35', text: 'G35 - Payout Policy' },
{ id: 'G38', text: 'G38 - Government Policy and Regulation' },
{ id: 'G39', text: 'G39 - Other' },
{ id: 'H', text: 'H - Public Economics' },
{ id: 'H0', text: 'H0 - General' },
{ id: 'H00', text: 'H00 - General' },
{ id: 'H1', text: 'H1 - Structure and Scope of Government' },
{ id: 'H10', text: 'H10 - General' },
{ id: 'H11', text: 'H11 - Structure; Scope; and Performance of Government' },
{ id: 'H19', text: 'H19 - Other' },
{ id: 'H2', text: 'H2 - Taxation; Subsidies; and Revenue' },
{ id: 'H20', text: 'H20 - General' },
{ id: 'H21', text: 'H21 - Efficiency; Optimal Taxation' },
{ id: 'H22', text: 'H22 - Incidence' },
{ id: 'H23', text: 'H23 - Externalities; Redistributives Effects; Environmental Taxes and Subsidies' },
{ id: 'H24', text: 'H24 - Personal Income and Other Nonbusiness Taxes and Subsidies' },
{ id: 'H25', text: 'H25 - Business Taxes and Subsidies' },
{ id: 'H26', text: 'H26 - Tax Evasion' },
{ id: 'H27', text: 'H27 - Other Sources of Revenue' },
{ id: 'H29', text: 'H29 - Other' },
{ id: 'H3', text: 'H3 - Fiscal Policies and Behavior of Economic Agents' },
{ id: 'H30', text: 'H30 - General' },
{ id: 'H31', text: 'H31 - Household' },
{ id: 'H32', text: 'H32 - Firm' },
{ id: 'H39', text: 'H39 - Other' },
{ id: 'H4', text: 'H4 - Publicly Provided Goods' },
{ id: 'H40', text: 'H40 - General' },
{ id: 'H41', text: 'H41 - Public Goods' },
{ id: 'H42', text: 'H42 - Publicly Provided Private Goods' },
{ id: 'H43', text: 'H43 - Project Evaluation; Social Discount Rate' },
{ id: 'H49', text: 'H49 - Other' },
{ id: 'H5', text: 'H5 - National Government Expenditures and Related Policies' },
{ id: 'H50', text: 'H50 - General' },
{ id: 'H51', text: 'H51 - Government Expenditures and Health' },
{ id: 'H52', text: 'H52 - Government Expenditures and Education' },
{ id: 'H53', text: 'H53 - Governement Expenditures and Welfare Programs' },
{ id: 'H54', text: 'H54 - Infrastructures; Other Public Investment and Capital Stock' },
{ id: 'H55', text: 'H55 - Social Security and Public Pensions' },
{ id: 'H56', text: 'H56 - National Security and War' },
{ id: 'H57', text: 'H57 - Procurement' },
{ id: 'H59', text: 'H59 - Other' },
{ id: 'H6', text: 'H6 - National Budget; Deficit; and Debt' },
{ id: 'H60', text: 'H60 - General' },
{ id: 'H61', text: 'H61 - Budget; Budget Systems' },
{ id: 'H62', text: 'H62 - Deficit; Surplus' },
{ id: 'H63', text: 'H63 - Debt; Debt Management' },
{ id: 'H69', text: 'H69 - Other' },
{ id: 'H7', text: 'H7 - State and Local Government; Intergovernmental Relations' },
{ id: 'H70', text: 'H70 - General' },
{ id: 'H71', text: 'H71 - State and Local Taxation; Subsidies; and Revenue' },
{ id: 'H72', text: 'H72 - State and Local Budget and Expenditures' },
{ id: 'H73', text: 'H73 - Interjurisdictional Differentials and Their Effects' },
{ id: 'H74', text: 'H74 - State and Local Borrowing' },
{ id: 'H77', text: 'H77 - Intergovernmental Relations; Federalism' },
{ id: 'H79', text: 'H79 - Other' },
{ id: 'H8', text: 'H8 - Miscellaneous Issues' },
{ id: 'H80', text: 'H80 - General' },
{ id: 'H81', text: 'H81 - Governmental Loans; Loans Guarantees; and Credits' },
{ id: 'H82', text: 'H82 - Governmental Property' },
{ id: 'H83', text: 'H83 - Public Administration' },
{ id: 'H87', text: 'H87 - International Fiscal Issues; International Public Goods' },
{ id: 'H89', text: 'H89 - Other' },
{ id: 'I', text: 'I - Health; Education; and Welfare' },
{ id: 'I0', text: 'I0 - General' },
{ id: 'I00', text: 'I00 - General' },
{ id: 'I1', text: 'I1 - Health' },
{ id: 'I10', text: 'I10 - General' },
{ id: 'I11', text: 'I11 - Analysis of Health Care Markets' },
{ id: 'I12', text: 'I12 - Health Production: Nutrition; Mortality; Morbidity; Substance Abuse and Addiction; Disability; and Economic Behavior' },
{ id: 'I18', text: 'I18 - Government Policy; Regulation; Public Health' },
{ id: 'I19', text: 'I19 - Other' },
{ id: 'I2', text: 'I2 - Education' },
{ id: 'I20', text: 'I20 - General' },
{ id: 'I21', text: 'I21 - Analysis of Education' },
{ id: 'I22', text: 'I22 - Educational Finance' },
{ id: 'I23', text: 'I23 - Higher Education Research Institutions' },
{ id: 'I28', text: 'I28 - Government Policy' },
{ id: 'I29', text: 'I29 - Other' },
{ id: 'I3', text: 'I3 - Welfare and Poverty' },
{ id: 'I30', text: 'I30 - General' },
{ id: 'I31', text: 'I31 - General Welfare; Basic Needs; Living Standards; Quality of Life; Happiness' },
{ id: 'I32', text: 'I32 - Measurement and Analysis of Poverty' },
{ id: 'I38', text: 'I38 - Government Policy; Provision and Effects of Welfare Programs' },
{ id: 'I39', text: 'I39 - Other' },
{ id: 'J', text: 'J - Labor and Demographic Economics' },
{ id: 'J0', text: 'J0 - General' },
{ id: 'J00', text: 'J00 - General' },
{ id: 'J01', text: 'J01 - Labor Economics: General' },
{ id: 'J1', text: 'J1 - Demographic Economics' },
{ id: 'J10', text: 'J10 - General' },
{ id: 'J11', text: 'J11 - Demographic Trends and Forecasts' },
{ id: 'J12', text: 'J12 - Marriage; Marital Dissolution; Family Structure' },
{ id: 'J13', text: 'J13 - Fertility; Family Planning; Child Care; Children; Youth' },
{ id: 'J14', text: 'J14 - Economics of Elderly; Economics of the Handicapped' },
{ id: 'J15', text: 'J15 - Economics of Minorities and Races; Non-labor Discrimination' },
{ id: 'J16', text: 'J16 - Economics of Gender; Non-labor Discrimination' },
{ id: 'J17', text: 'J17 - Value of Life; Foregone Income' },
{ id: 'J18', text: 'J18 - Public Policy' },
{ id: 'J19', text: 'J19 - Other' },
{ id: 'J2', text: 'J2 - Time Allocation; Work Behavior; and Employment Determination and Creation; Human Capital' },
{ id: 'J20', text: 'J20 - General' },
{ id: 'J21', text: 'J21 - Labor Force and Employment; Size; and Structure' },
{ id: 'J22', text: 'J22 - Time Allocation and Labor Supply' },
{ id: 'J24', text: 'J24 - Human Capital; Skills; Occupational Choice; Labor Productivity' },
{ id: 'J26', text: 'J26 - Retirement; Retirement Policies' },
{ id: 'J29', text: 'J29 - Other' },
{ id: 'J3', text: 'J3 - Wages; Compensation; and Labor Costs' },
{ id: 'J30', text: 'J30 - General' },
{ id: 'J31', text: 'J31 - Wage Level and Structure; Wage Diffrentials by Skill; Training; Occupation; etc.' },
{ id: 'J32', text: 'J32 - Nonwage Labor Costs and Benefits; Private Pensions' },
{ id: 'J33', text: 'J33 - Compensation Packages; Payment Methods' },
{ id: 'J38', text: 'J38 - Public Policy' },
{ id: 'J39', text: 'J39 - Other' },
{ id: 'J4', text: 'J4 - Particular Labor Markets' },
{ id: 'J40', text: 'J40 - General' },
{ id: 'J41', text: 'J41 - Contracts: Specific Human Capital; Matching Models; Efficiency Wage Models; and Internal Labor Markets' },
{ id: 'J42', text: 'J42 - Monopsony; Segmented Labor Markets' },
{ id: 'J43', text: 'J43 - Agricultural Labor Markets' },
{ id: 'J44', text: 'J44 - Professional Labor Markets and Occupations' },
{ id: 'J45', text: 'J45 - Public Sector Labor Markets' },
{ id: 'J48', text: 'J48 - Public Policy' },
{ id: 'J49', text: 'J49 - Other' },
{ id: 'J5', text: 'J5 - Labor-Management Relations; Trade Unions; and collective Barbaining' },
{ id: 'J50', text: 'J50 - General' },
{ id: 'J51', text: 'J51 - Trade Unions; Objectives; Structure; and Effects' },
{ id: 'J52', text: 'J52 - Dispute Resolution: Strikes; Arbitration; and Mediation; Collective Barbaining' },
{ id: 'J53', text: 'J53 - Labor-Management Relations; Industrial Jurisprudence' },
{ id: 'J54', text: 'J54 - Producer Cooperatives; Labor Managed Firms' },
{ id: 'J58', text: 'J58 - Public Policy' },
{ id: 'J59', text: 'J59 - Other' },
{ id: 'J6', text: 'J6 - Mobility; Unemployment; and Vacancies' },
{ id: 'J60', text: 'J60 - General' },
{ id: 'J61', text: 'J61 - Geographic Labor Mobility; Immigrant Workers' },
{ id: 'J62', text: 'J62 - Job; Occupational; and Intergenerational Mobility' },
{ id: 'J63', text: 'J63 - Turnover; Vacancies; Layoffs' },
{ id: 'J64', text: 'J64 - Unemployment - Models Duration Incidence and Job Search' },
{ id: 'J65', text: 'J65 - Unemployment Insurance; Severance Pay; Plant Closings' },
{ id: 'J68', text: 'J68 - Public Policy' },
{ id: 'J69', text: 'J69 - Other' },
{ id: 'J7', text: 'J7 - Labor Discrimination' },
{ id: 'J70', text: 'J70 - General' },
{ id: 'J71', text: 'J71 - Discrimination' },
{ id: 'J78', text: 'J78 - Public Policy' },
{ id: 'J79', text: 'J79 - Other' },
{ id: 'J8', text: 'J8 - Labor Standards : National and International' },
{ id: 'J80', text: 'J80 - General' },
{ id: 'J81', text: 'J81 - Working Conditions' },
{ id: 'J82', text: 'J82 - Labor Force Composition' },
{ id: 'J83', text: 'J83 - Workers Rights' },
{ id: 'J88', text: 'J88 - Public policy' },
{ id: 'J89', text: 'J89 - Other' },
{ id: 'K', text: 'K - Law and Economies' },
{ id: 'K0', text: 'K0 - General' },
{ id: 'K00', text: 'K00 - General' },
{ id: 'K1', text: 'K1 - Basic Areas of Law' },
{ id: 'K10', text: 'K10 - General' },
{ id: 'K11', text: 'K11 - Property Law' },
{ id: 'K12', text: 'K12 - Contract Law' },
{ id: 'K13', text: 'K13 - Tort Law and Product Liability' },
{ id: 'K14', text: 'K14 - Criminal Law' },
{ id: 'K19', text: 'K19 - Other' },
{ id: 'K2', text: 'K2 - Regulation and Business Law' },
{ id: 'K20', text: 'K20 - General' },
{ id: 'K21', text: 'K21 - Antitrust Law' },
{ id: 'K22', text: 'K22 - Corporation and Securities Law' },
{ id: 'K23', text: 'K23 - Regulated Industries and Administrative Law' },
{ id: 'K29', text: 'K29 - Other' },
{ id: 'K3', text: 'K3 - Other Substantive Areas of Law' },
{ id: 'K30', text: 'K30 - General' },
{ id: 'K31', text: 'K31 - Labor Law' },
{ id: 'K32', text: 'K32 - Environmental; Health; and Safety Law' },
{ id: 'K33', text: 'K33 - International Law' },
{ id: 'K34', text: 'K34 - Tax Law' },
{ id: 'K35', text: 'K35 - Personal Bankruptcy Law' },
{ id: 'K39', text: 'K39 - Other' },
{ id: 'K4', text: 'K4 - Legal Procedure; the Legal System; and Illegal Behavior' },
{ id: 'K40', text: 'K40 - General' },
{ id: 'K41', text: 'K41 - Litigation Process' },
{ id: 'K42', text: 'K42 - Illegal Behavior and the Enforcement of Law' },
{ id: 'K49', text: 'K49 - Other' },
{ id: 'L', text: 'L - Industrial Organization' },
{ id: 'L0', text: 'L0 - General' },
{ id: 'L00', text: 'L00 - General' },
{ id: 'L1', text: 'L1 - Market Structure; Firm Strategy; and Market Performance' },
{ id: 'L10', text: 'L10 - General' },
{ id: 'L11', text: 'L11 - Production; Pricing; and Market Structure; Size Distribution of Firms' },
{ id: 'L12', text: 'L12 - Monopoly; Monopolization Strategies' },
{ id: 'L13', text: 'L13 - Oligopoly and Other Imperfect Markets' },
{ id: 'L14', text: 'L14 - Transactional Relationships; Contracts and Reputation; Networks' },
{ id: 'L15', text: 'L15 - Information and Product Quality; Standardization and Compatibility' },
{ id: 'L16', text: 'L16 - Industrial Organization and Macroeconomics; Macroeconomic Industrial Structure; Industrial Price Indices' },
{ id: 'L19', text: 'L19 - Other' },
{ id: 'L2', text: 'L2 - Firm Objectives; Organization; and Behavior' },
{ id: 'L20', text: 'L20 - General' },
{ id: 'L21', text: 'L21 - Business Objectives of the Firm' },
{ id: 'L22', text: 'L22 - Firm Organization and Market Structure: Markets vs. Hierarchies; Vertical Integration; Conglomerates' },
{ id: 'L23', text: 'L23 - Organization of Production' },
{ id: 'L24', text: 'L24 - Contracting Out; Joint Ventures' },
{ id: 'L25', text: 'L25 - Firm Performance: Size; Age; Profit; and Sales' },
{ id: 'L29', text: 'L29 - Other' },
{ id: 'L3', text: 'L3 - Nonprofit Organization and Public Enterprise' },
{ id: 'L30', text: 'L30 - General' },
{ id: 'L31', text: 'L31 - Nonprofit Institutions; NGOs' },
{ id: 'L32', text: 'L32 - Public Enterprises' },
{ id: 'L33', text: 'L33 - Comparison of Public and Private Enterprises; Privatizations; Contracting Out' },
{ id: 'L39', text: 'L39 - Other' },
{ id: 'L4', text: 'L4 - Antitrust Issues and Policies' },
{ id: 'L40', text: 'L40 - General' },
{ id: 'L41', text: 'L41 - monopolization; Horizontal Anticompetitive Practices' },
{ id: 'L42', text: 'L42 - Vertical Restraints; Resale Price Maintenance; Quality Discounts' },
{ id: 'L43', text: 'L43 - Legal Monopolies and Regulation or Deregulation' },
{ id: 'L44', text: 'L44 - Antitrust Policy and Public Enterprise; Nonprofit Institutions; and Professional Organizations' },
{ id: 'L49', text: 'L49 - Other' },
{ id: 'L5', text: 'L5 - Regulation and Industrial Policy' },
{ id: 'L50', text: 'L50 - General' },
{ id: 'L51', text: 'L51 - Economics of Regulation' },
{ id: 'L52', text: 'L52 - Industrial Policy; Sectoral Planning Methods' },
{ id: 'L53', text: 'L53 - Government Promotion of Firms' },
{ id: 'L59', text: 'L59 - Other' },
{ id: 'L6', text: 'L6 - Industry Studies: Manufacturing' },
{ id: 'L60', text: 'L60 - General' },
{ id: 'L61', text: 'L61 - Metals and Metal Products; Cement; Glass; Ceramics' },
{ id: 'L62', text: 'L62 - Automobiles; Other Transportation Equipment' },
{ id: 'L63', text: 'L63 - Microelectronics; Computers; Communications Equipment' },
{ id: 'L65', text: 'L65 - Chemicals; Rubber; Drugs; Biotechnology' },
{ id: 'L66', text: 'L66 - Food; Beverages; Cosmetics; Tobacco' },
{ id: 'L67', text: 'L67 - Other Consumer Nondurables: Clothing; Textiles; Shoes; and Leather' },
{ id: 'L68', text: 'L68 - Appliances; Other Consumer Durables' },
{ id: 'L69', text: 'L69 - Other' },
{ id: 'L7', text: 'L7 - Industrie Studies: Primary Products and Construction' },
{ id: 'L70', text: 'L70 - General' },
{ id: 'L71', text: 'L71 - Mining; Extraction; and Refining: Hydrocarbon Fuels' },
{ id: 'L72', text: 'L72 - Mining; Extraction; and Refining: Other Nonrenewable Resources' },
{ id: 'L73', text: 'L73 - Forest Products: Lumber and Paper' },
{ id: 'L74', text: 'L74 - Construction' },
{ id: 'L78', text: 'L78 - Government Policy' },
{ id: 'L79', text: 'L79 - Other' },
{ id: 'L8', text: 'L8 - Industry Studies: Services' },
{ id: 'L80', text: 'L80 - General' },
{ id: 'L81', text: 'L81 - Retail and Wholesale Trade; Warehousing; e-Commerce' },
{ id: 'L82', text: 'L82 - Entertainment; Media (Performing Arts; Visual Arts; Broascasting; Publishing; etc.)' },
{ id: 'L83', text: 'L83 - Sports; Gambling; Recreation; Tourism' },
{ id: 'L84', text: 'L84 - Personal; Professional; and Business Services' },
{ id: 'L85', text: 'L85 - Real Estate Services' },
{ id: 'L86', text: 'L86 - Information and Internet Services; Computer Software' },
{ id: 'L87', text: 'L87 - Postal and Delivery Services' },
{ id: 'L88', text: 'L88 - Government Policy' },
{ id: 'L89', text: 'L89 - Other' },
{ id: 'L9', text: 'L9 - Industry Studies: Transportation and Utilities' },
{ id: 'L90', text: 'L90 - General' },
{ id: 'L91', text: 'L91 - Transportation: General' },
{ id: 'L92', text: 'L92 - Railroads and Other Surface Transportation: Auto; Buses; Trucks; and Water Carriers; Ports' },
{ id: 'L93', text: 'L93 - Air Transportation' },
{ id: 'L94', text: 'L94 - Electric Utilities' },
{ id: 'L95', text: 'L95 - Gas Utilities; Pipelines; Water Utilities' },
{ id: 'L96', text: 'L96 - Telecommunications' },
{ id: 'L97', text: 'L97 - Utilities: General' },
{ id: 'L98', text: 'L98 - Government Policy' },
{ id: 'L99', text: 'L99 - Other' },
{ id: 'M', text: 'M - Business Administration and Business Economics; Marketing; Accounting' },
{ id: 'M0', text: 'M0 - General' },
{ id: 'M00', text: 'M00 - General' },
{ id: 'M1', text: 'M1 - Business Administration' },
{ id: 'M10', text: 'M10 - General' },
{ id: 'M11', text: 'M11 - Production Management' },
{ id: 'M12', text: 'M12 - Personnel Management' },
{ id: 'M13', text: 'M13 - Entrepreneurship' },
{ id: 'M14', text: 'M14 - Corporate Culture; Social Responsability' },
{ id: 'M19', text: 'M19 - Other' },
{ id: 'M2', text: 'M2 - Business Economics' },
{ id: 'M20', text: 'M20 - General' },
{ id: 'M21', text: 'M21 - Business Economics' },
{ id: 'M29', text: 'M29 - Other' },
{ id: 'M3', text: 'M3 - Marketing and advertising' },
{ id: 'M30', text: 'M30 - General' },
{ id: 'M31', text: 'M31 - Marketing' },
{ id: 'M37', text: 'M37 - advertising' },
{ id: 'M39', text: 'M39 - Other' },
{ id: 'M4', text: 'M4 - Accounting and Auditing' },
{ id: 'M40', text: 'M40 - General' },
{ id: 'M41', text: 'M41 - Accounting' },
{ id: 'M42', text: 'M42 - Auditing' },
{ id: 'M49', text: 'M49 - Other' },
{ id: 'M5', text: 'M5 - Personnel Economics' },
{ id: 'M50', text: 'M50 - General' },
{ id: 'M51', text: 'M51 - Firm Employment Decisions ; Promotions (hiring; firing; turnover; part-time; temporary workers; seniority issues)' },
{ id: 'M52', text: 'M52 - Compensation and Compensation Methods and their Effects (stock options; fringe benefits; incentives; family support programs; seniority issues)' },
{ id: 'M53', text: 'M53 - Training' },
{ id: 'M54', text: 'M54 - Labor Management (team formation; worker empowerment; job design; tasks and authority; job satisfaction)' },
{ id: 'M55', text: 'M55 - Labor Contracting Devices ; Outsourcing ; Franchising ; Other' },
{ id: 'M59', text: 'M59 - Other' },
{ id: 'N', text: 'N - Economic History' },
{ id: 'N0', text: 'N0 - General' },
{ id: 'N00', text: 'N00 - General' },
{ id: 'N01', text: 'N01 - Development of the Discipline: Historiographical; Sources and Methods' },
{ id: 'N1', text: 'N1 - Macroeconomics and Monetary Economics ; Growth and fluctuations' },
{ id: 'N10', text: 'N10 - General; International; or comparative' },
{ id: 'N11', text: 'N11 - U.S.; Canada: Pre-1913' },
{ id: 'N12', text: 'N12 - U.S.; Canada: 1913-' },
{ id: 'N13', text: 'N13 - Europe: Pre-1913' },
{ id: 'N14', text: 'N14 - Europe: 1913-' },
{ id: 'N15', text: 'N15 - Asia including Middle East' },
{ id: 'N16', text: 'N16 - Latin America; Caribbean' },
{ id: 'N17', text: 'N17 - Africa; Oceania' },
{ id: 'N2', text: 'N2 - Financial MArket and Institutions' },
{ id: 'N20', text: 'N20 - General; International or Comparative' },
{ id: 'N21', text: 'N21 - U.S.; Canada: Pre-1913' },
{ id: 'N22', text: 'N22 - U.S.; Canada: 1913-' },
{ id: 'N23', text: 'N23 - Europe: Pre-1913' },
{ id: 'N24', text: 'N24 - Europe: 1913-' },
{ id: 'N25', text: 'N25 - Asia including Middle East' },
{ id: 'N26', text: 'N26 - Latin America; Caribbean' },
{ id: 'N27', text: 'N27 - Africa; Oceania' },
{ id: 'N3', text: 'N3 - Labor and Consumers; Demography; Education Income and Wealth' },
{ id: 'N30', text: 'N30 - General; International or Comparative' },
{ id: 'N31', text: 'N31 - U.S.: Canada Pre-1913' },
{ id: 'N32', text: 'N32 - U.S.; Canada : 1913-' },
{ id: 'N33', text: 'N33 - Europe: Pre-1913' },
{ id: 'N34', text: 'N34 - Europe: 1913-' },
{ id: 'N35', text: 'N35 - Asia including Middle East' },
{ id: 'N36', text: 'N36 - Latin America; Caribbean' },
{ id: 'N37', text: 'N37 - Africa; Oceania' },
{ id: 'N4', text: 'N4 - Government; War; Law and Regulation' },
{ id: 'N40', text: 'N40 - General; International or Comparative' },
{ id: 'N41', text: 'N41 - U.S.; Canada: Pre-1913' },
{ id: 'N42', text: 'N42 - U.S.; Canada: 1913-' },
{ id: 'N43', text: 'N43 - Europe: Pre-1913' },
{ id: 'N44', text: 'N44 - Europe: 1913-' },
{ id: 'N45', text: 'N45 - Asia including Middle East' },
{ id: 'N46', text: 'N46 - Latin America; Caribbean' },
{ id: 'N47', text: 'N47 - Africa; Oceania' },
{ id: 'N5', text: 'N5 - Agriculture; Natural Resources; Environment and Extractive Industries' },
{ id: 'N50', text: 'N50 - General; International or Comparative' },
{ id: 'N51', text: 'N51 - U.S.; Canada: Pre-1913' },
{ id: 'N52', text: 'N52 - U.S.; Canada: 1913-' },
{ id: 'N53', text: 'N53 - Europe: Pre-1913' },
{ id: 'N54', text: 'N54 - Europe: 1913-' },
{ id: 'N55', text: 'N55 - Asia including Middle East' },
{ id: 'N56', text: 'N56 - Latin America; Caribbean' },
{ id: 'N57', text: 'N57 - Africa; Oceania' },
{ id: 'N6', text: 'N6 - Manufacturing and Construction' },
{ id: 'N60', text: 'N60 - General; International or Comparative' },
{ id: 'N61', text: 'N61 - U.S.; Canada: Pre-1913' },
{ id: 'N62', text: 'N62 - U.S.; Canada: 1913-' },
{ id: 'N63', text: 'N63 - Europe: Pre-1913' },
{ id: 'N64', text: 'N64 - Europe: 1913-' },
{ id: 'N65', text: 'N65 - Asia including Middle East' },
{ id: 'N66', text: 'N66 - Latin America; Caribbean' },
{ id: 'N67', text: 'N67 - Africa; Oceania' },
{ id: 'N7', text: 'N7 - Transport; International and Domestic Trade; Energy; Technology and Other Services' },
{ id: 'N70', text: 'N70 - General; Inernational; or Comparative' },
{ id: 'N71', text: 'N71 - U.S.; Canada: Pre-1913' },
{ id: 'N72', text: 'N72 - U.S.; Canada: 1913-' },
{ id: 'N73', text: 'N73 - Europe: Pre-1913' },
{ id: 'N74', text: 'N74 - Europe: 1913-' },
{ id: 'N75', text: 'N75 - Asia including Middle East' },
{ id: 'N76', text: 'N76 - Latin America; Caribbean' },
{ id: 'N77', text: 'N77 - Africa; Oceania' },
{ id: 'N8', text: 'N8 - Micro-Business History' },
{ id: 'N80', text: 'N80 - General; International; or Comparative' },
{ id: 'N81', text: 'N81 - U.S.; Canada: Pre-1913' },
{ id: 'N82', text: 'N82 - U.S.; Canada: 1913-' },
{ id: 'N83', text: 'N83 - Europe: Pre-1913' },
{ id: 'N84', text: 'N84 - Europe: 1913-' },
{ id: 'N85', text: 'N85 - Asia including Middle East' },
{ id: 'N86', text: 'N86 - Latina America; Caribbean' },
{ id: 'N87', text: 'N87 - Africa; Oceania' },
{ id: 'N9', text: 'N9 - Regional and Urban History' },
{ id: 'N90', text: 'N90 - General; International; or Comparative' },
{ id: 'N91', text: 'N91 - U.S.; Canada: Pre-1913' },
{ id: 'N92', text: 'N92 - U.S.; Canada: 1913-' },
{ id: 'N93', text: 'N93 - Europe: Pre-1913' },
{ id: 'N94', text: 'N94 - Europe: 1913-' },
{ id: 'N95', text: 'N95 - Asia including Middle East' },
{ id: 'N96', text: 'N96 - Latin America; Caribbean' },
{ id: 'N97', text: 'N97 - Africa; Oceania' },
{ id: 'O', text: 'O - Economic Development; Technological Change; and Growth' },
{ id: 'O1', text: 'O1 - Economic Development' },
{ id: 'O10', text: 'O10 - General' },
{ id: 'O11', text: 'O11 - Macroeconomic Analyses of Economic Development' },
{ id: 'O12', text: 'O12 - Microeconomic Analyses of Economic Development' },
{ id: 'O13', text: 'O13 - Agriculture; Natural Resources; Energy; Environment; Other Primary Products' },
{ id: 'O14', text: 'O14 - Industrialization; Manufacturing and Service Industries; Choice of Technology' },
{ id: 'O15', text: 'O15 - Human Resources; Human Development; Income Distribution; Migration' },
{ id: 'O16', text: 'O16 - Financial Markets; Saving and Capital Investment' },
{ id: 'O17', text: 'O17 - Formal and Informal Sectors; Shadow Economy; Institutional Arrangements: Legal; Social; Economic; and Political' },
{ id: 'O18', text: 'O18 - Regional; Urban; and Rural Analyses' },
{ id: 'O19', text: 'O19 - International Linkages to Development; Role of International Organizations' },
{ id: 'O3', text: 'O3 - Technological Change; Research and Development' },
{ id: 'O30', text: 'O30 - General' },
{ id: 'O31', text: 'O31 - Innovation and Invention: Processes and Incentives' },
{ id: 'O33', text: 'O33 - Technological Change: Choices and Consequences; Diffusion Processes' },
{ id: 'O34', text: 'O34 - Intellectual Property Rights: National and International Issues' },
{ id: 'O38', text: 'O38 - Government Policy' },
{ id: 'O39', text: 'O39 - Other' },
{ id: 'O4', text: 'O4 - Economic Growth and Aggregate Productivity' },
{ id: 'O40', text: 'O40 - General' },
{ id: 'O41', text: 'O41 - One; Two; and Multisector Growth Models' },
{ id: 'O42', text: 'O42 - Monetary Growth Models' },
{ id: 'O47', text: 'O47 - Measurement of Economic Growth; Aggregate Productivity' },
{ id: 'O49', text: 'O49 - Other' },
{ id: 'O5', text: 'O5 - Economywide Country Studies' },
{ id: 'O50', text: 'O50 - General' },
{ id: 'O51', text: 'O51 - U.S.; Canada' },
{ id: 'O52', text: 'O52 - Europe' },
{ id: 'O53', text: 'O53 - Asia including Middle East' },
{ id: 'O54', text: 'O54 - Latin America; Caribbean' },
{ id: 'O55', text: 'O55 - Africa' },
{ id: 'O56', text: 'O56 - Oceania' },
{ id: 'O57', text: 'O57 - Comparative Studies of Countries' },
{ id: 'P', text: 'P - Economic Systems' },
{ id: 'P0', text: 'P0 - General' },
{ id: 'P00', text: 'P00 - General' },
{ id: 'P1', text: 'P1 - Capitalist Systems' },
{ id: 'P10', text: 'P10 - General' },
{ id: 'P11', text: 'P11 - Planning; Coordination; and Reform' },
{ id: 'P12', text: 'P12 - Capitalist Enterprises' },
{ id: 'P13', text: 'P13 - Cooperative Enterprises' },
{ id: 'P14', text: 'P14 - Property Rights' },
{ id: 'P16', text: 'P16 - Political Economy' },
{ id: 'P17', text: 'P17 - Performances and Prospects' },
{ id: 'P19', text: 'P19 - Other' },
{ id: 'P2', text: 'P2 - Socialist Systems and Transitional Economies' },
{ id: 'P20', text: 'P20 - General' },
{ id: 'P21', text: 'P21 - Planning; Coordination; and Reform' },
{ id: 'P22', text: 'P22 - Prices' },
{ id: 'P23', text: 'P23 - Factor and Product Markets; Industry Studies; Population' },
{ id: 'P24', text: 'P24 - National Income; Product; and Expenditure; Money; Inflation' },
{ id: 'P25', text: 'P25 - Urban; Rural; and Regional Economics; Housing; Transportation' },
{ id: 'P26', text: 'P26 - Political Economy; Property Rights' },
{ id: 'P27', text: 'P27 - Performance and Prospects' },
{ id: 'P28', text: 'P28 - Natural Resources; Energy; Environment' },
{ id: 'P29', text: 'P29 - Other' },
{ id: 'P3', text: 'P3 - Socialist Institutions and Their Transitions' },
{ id: 'P30', text: 'P30 - General' },
{ id: 'P31', text: 'P31 - Socialist Enterprises and Their Transitions' },
{ id: 'P32', text: 'P32 - Collectives; Communes; Agriculture' },
{ id: 'P33', text: 'P33 - International Trade; Finance; Investment; and Aid' },
{ id: 'P34', text: 'P34 - Financial Economics' },
{ id: 'P35', text: 'P35 - Public Economics' },
{ id: 'P36', text: 'P36 - Consumer Economics; Health; Education; Welfare; and Poverty' },
{ id: 'P37', text: 'P37 - Legal Institutions; Illegal Behavior' },
{ id: 'P39', text: 'P39 - Other' },
{ id: 'P4', text: 'P4 - Other Economic Systems' },
{ id: 'P40', text: 'P40 - General' },
{ id: 'P41', text: 'P41 - Planning; Coordination; and Reform' },
{ id: 'P42', text: 'P42 - Productive Enterprises; Factors and Product Markets; Prices; Population' },
{ id: 'P43', text: 'P43 - Public Economics; Welfare and Poverty' },
{ id: 'P44', text: 'P44 - National Income; Product; and Expenditure; Money; Inflation' },
{ id: 'P45', text: 'P45 - International Trade; Finance; Investment; and Aid' },
{ id: 'P46', text: 'P46 - Consumer Economics; Welfare and Poverty' },
{ id: 'P47', text: 'P47 - Performance and Prospects' },
{ id: 'P48', text: 'P48 - Political Economy; Legal Institutions; Property Rights' },
{ id: 'P49', text: 'P49 - Other' },
{ id: 'P5', text: 'P5 - Comparative Economic Systems' },
{ id: 'P50', text: 'P50 - General' },
{ id: 'P51', text: 'P51 - Comparative Analysis of Economic Systems' },
{ id: 'P52', text: 'P52 - Comparative Studies of Particular Economies' },
{ id: 'P59', text: 'P59 - Other' },
{ id: 'Q', text: 'Q - Agricultural and Natural Resources Economics; environmental and Ecological Economics' },
{ id: 'Q0', text: 'Q0 - General' },
{ id: 'Q00', text: 'Q00 - General' },
{ id: 'Q01', text: 'Q01 - Sustainable Development' },
{ id: 'Q1', text: 'Q1 - Agriculture' },
{ id: 'Q10', text: 'Q10 - General' },
{ id: 'Q11', text: 'Q11 - Aggregate Supply and Demand Analysis; Prices' },
{ id: 'Q12', text: 'Q12 - Micro Analysis of Farm Firms; Farm Households; and Farm Input Markets' },
{ id: 'Q13', text: 'Q13 - Agricultural Markets and Marketing; Cooperatives; Agribusiness' },
{ id: 'Q14', text: 'Q14 - Agricultural Finance' },
{ id: 'Q15', text: 'Q15 - Land Ownership and Tenure; Land Reform; Land Use; Irrigation' },
{ id: 'Q16', text: 'Q16 - R&D; Agricultural Technology; Agricultural Extension Services' },
{ id: 'Q17', text: 'Q17 - Agriculture in International Trade' },
{ id: 'Q18', text: 'Q18 - Agricultural Policy; Food Policy' },
{ id: 'Q19', text: 'Q19 - Other' },
{ id: 'Q2', text: 'Q2 - Renewable Resources and Conservation' },
{ id: 'Q20', text: 'Q20 - General' },
{ id: 'Q21', text: 'Q21 - Demand and Supply' },
{ id: 'Q22', text: 'Q22 - Fishery; Aquaculture' },
{ id: 'Q23', text: 'Q23 - Forestry' },
{ id: 'Q24', text: 'Q24 - Land' },
{ id: 'Q25', text: 'Q25 - Water' },
{ id: 'Q26', text: 'Q26 - Recreational Aspects of Natural Resources' },
{ id: 'Q28', text: 'Q28 - Government Policy' },
{ id: 'Q29', text: 'Q29 - Other' },
{ id: 'Q3', text: 'Q3 - Nonrenewable Resources and Conservation' },
{ id: 'Q30', text: 'Q30 - General' },
{ id: 'Q31', text: 'Q31 - Demand and Supply' },
{ id: 'Q32', text: 'Q32 - Exhaustible Resources and Economic Development' },
{ id: 'Q33', text: 'Q33 - Resource Booms' },
{ id: 'Q34', text: 'Q34 - Natural Resources and Domestic and International Conflicts' },
{ id: 'Q38', text: 'Q38 - Government Policy' },
{ id: 'Q39', text: 'Q39 - Other' },
{ id: 'Q4', text: 'Q4 - Energy' },
{ id: 'Q40', text: 'Q40 - General' },
{ id: 'Q41', text: 'Q41 - Demad and Supply' },
{ id: 'Q42', text: 'Q42 - Alternative Energy Sources' },
{ id: 'Q43', text: 'Q43 - Energy and the Macroeconomy' },
{ id: 'Q48', text: 'Q48 - Government Policy' },
{ id: 'Q49', text: 'Q49 - Other' },
{ id: 'Q5', text: 'Q5 - Environmental Economics' },
{ id: 'Q50', text: 'Q50 - General' },
{ id: 'Q51', text: 'Q51 - Valuation of Environmental Effects' },
{ id: 'Q52', text: 'Q52 - Pollution Control Costs; Distributional Effects; Employment Effects' },
{ id: 'Q53', text: 'Q53 - Air Pollution; Water Pollution; Noise; Hazardous Waste; Solid Waste Recycling' },
{ id: 'Q54', text: 'Q54 - Climate; Natural Disasters' },
{ id: 'Q55', text: 'Q55 - Technological Innovation' },
{ id: 'Q56', text: 'Q56 - Environment and Development; Environment and Trade; Sustainability; Environmental Accounting' },
{ id: 'Q57', text: 'Q57 - Ecological Economics: Ecosystem Services; Biodiversity Conservation; Bioeconomics' },
{ id: 'Q58', text: 'Q58 - Government Policy' },
{ id: 'R', text: 'R - Urban; Rural; and Regional Economics' },
{ id: 'R0', text: 'R0 - General' },
{ id: 'R00', text: 'R00 - General' },
{ id: 'R1', text: 'R1 - General Regional Economics' },
{ id: 'R10', text: 'R10 - General' },
{ id: 'R11', text: 'R11 - Regional Economic Activity: Growth; Development; and Changes' },
{ id: 'R12', text: 'R12 - Size and Spatial Distributions of Regional Economic Activity; Interregional Trade' },
{ id: 'R13', text: 'R13 - General Equilibrium and Welfare Economic Analysis of Regional Economies' },
{ id: 'R14', text: 'R14 - Land Use Patterns' },
{ id: 'R15', text: 'R15 - Econometric and Input-Ouput Models; Other Models' },
{ id: 'R19', text: 'R19 - Other' },
{ id: 'R2', text: 'R2 - Household Analysis' },
{ id: 'R20', text: 'R20 - General' },
{ id: 'R21', text: 'R21 - Housing Demand' },
{ id: 'R22', text: 'R22 - Other Demand' },
{ id: 'R23', text: 'R23 - Regional Migration; Regional Labor Markets; Population' },
{ id: 'R29', text: 'R29 - Other' },
{ id: 'R3', text: 'R3 - Production Analysis and Firm Location' },
{ id: 'R30', text: 'R30 - General' },
{ id: 'R31', text: 'R31 - Housing Supply and Markets' },
{ id: 'R32', text: 'R32 - Other Production and Pricing Analysis' },
{ id: 'R33', text: 'R33 - Nonagricultural and Nonresidential Real Estate Markets' },
{ id: 'R34', text: 'R34 - Input Demand Analysis' },
{ id: 'R38', text: 'R38 - Government Policies; Regulatory Policies' },
{ id: 'R39', text: 'R39 - Other' },
{ id: 'R4', text: 'R4 - Transportation Systems' },
{ id: 'R40', text: 'R40 - General' },
{ id: 'R41', text: 'R41 - Transportation; Demand; Supply; Congestion; Safety and Accidents' },
{ id: 'R42', text: 'R42 - Government and Private Investment Analysis' },
{ id: 'R48', text: 'R48 - Government Pricing; Regulatory Policies' },
{ id: 'R49', text: 'R49 - Other' },
{ id: 'R5', text: 'R5 - Regional Government Analysis' },
{ id: 'R50', text: 'R50 - General' },
{ id: 'R51', text: 'R51 - Finance in Urban and Rural Economies' },
{ id: 'R52', text: 'R52 - Land Use and Other Regulations' },
{ id: 'R53', text: 'R53 - Public Facility Location Analysis; Public Investment and Capital Stock' },
{ id: 'R58', text: 'R58 - Regional Development Policy' },
{ id: 'R59', text: 'R59 - Other' },
{ id: 'Z', text: 'Z - Other Special Topics' },
{ id: 'Z0', text: 'Z0 - General' },
{ id: 'Z00', text: 'Z00 - General' },
{ id: 'Z1', text: 'Z1 - Cultural Economics' },
{ id: 'Z10', text: 'Z10 - General' },
{ id: 'Z11', text: 'Z11 - Economics of the Arts and Literature' },
{ id: 'Z12', text: 'Z12 - Religion' },
{ id: 'Z13', text: 'Z13 - Social Norms and Social Capital; Social Networks' },
{ id: 'Z19', text: 'Z19 - Other' },
{ id: 'M48', text: 'M48 - Government Policy and Regulation' },
{ id: 'F59', text: 'F59 - Other' },
{ id: 'O43', text: 'O43 - Institutions and Growth' },
{ id: 'E02', text: 'E02 - Institutions and the Macroeconomy' },
{ id: 'G01', text: 'G01 - Financial Crises' },
{ id: 'B54', text: 'B54 – Feminist Economics' },
{ id: 'Y30', text: 'Y30 - Book Reviews (unclassified)' },
{ id: 'Y3', text: 'Y3 - Book Reviews (unclassified)' },
{ id: 'I14', text: 'I14 6 Health and Inequality' },
{ id: 'O35', text: 'O35 - Social Innovation' },
{ id: '043', text: '043 – Institutions and Growth' },
{ id: 'Y8', text: 'Y8 – Related Disciplines' }
]


</script>
  
  