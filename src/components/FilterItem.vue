<template>
    <h5>
        <CIcon icon="cilGroup" size="xl" />&nbspGroups
    </h5>
    
    <CCard>
        <CCardBody>
            <CRow :xs="{ cols: 1, gutter: 6 }" :md="{ cols: 2 }">

                <CCol xs v-for="(conditions, index) in filterData.filter">
                    <CCard v-if="index != filterData.activeGroup" @click="active_group(index)" text-color="dark"
                        class="mb-3 border">
                        <CCardHeader>Group {{ index + 1 }}</CCardHeader>
                        <CCardBody>
                            <CCardText>
                                Filter: {{ conditions.join(" AND ") }}
                            </CCardText>
                        </CCardBody>
                        <CCardFooter>
                            <CButton @click="filter_remove_last(index)" color="danger">Remove Last Condition
                            </CButton>
                        </CCardFooter>
                    </CCard>

                    <CCard v-if="index == filterData.activeGroup" color="dark" text-color="white"
                        @click="active_group(index)" class="mb-3 border">
                        <CCardHeader>Group {{ index + 1 }} <b>(Active)</b></CCardHeader>
                        <CCardBody>
                            <CCardText>
                                Filter: {{ conditions.join(" AND ") }}
                            </CCardText>
                        </CCardBody>
                        <CCardFooter>
                            <CButton @click="filter_remove_last(index)" color="danger">Remove Last Condition
                            </CButton>
                        </CCardFooter>
                    </CCard>
                </CCol>
            </CRow>
            <CButton @click="filter_add_group" color="success">Add Group</CButton>
            <CButton style="margin-left:10px;" @click="filter_remove_group(event)" color="danger">Remove Group {{
                filterData.activeGroup + 1 }}</CButton>
<br/>
<br/>
<CRow >
                <CCol md="4">
                    <CIcon icon="cilFindInPage" size="md" />&nbspVariable
                    <Select2 v-model="filterData.variable" :settings="select2Settings.single" :options="props.variables"
                        @change="selectVariable($event)" @select="selectVariable($event)" />
                </CCol>
                <CCol md="4">
                    <CIcon icon="cilPlus" size="md" />&nbspOperator
                    <Select2 v-model="filterData.operator" :settings="select2Settings.single"
                        :options="filterData.operators" @change="selectOperator($event)" @select="selectOperator($event)" />
                </CCol>
                <CCol md="4">
                    <CIcon icon="cilOptions" size="md" />&nbspOptions
                    <Select2 v-if="filterData.type === 'multi'" v-model="filterData.selected"
                        :settings="select2Settings.multiple" :options="filterData.options" @change="selectOptions($event)"
                        @select="selectOptions($event)" />
                    <Select2 v-if="filterData.type === 'single'" v-model="filterData.selected"
                        :settings="select2Settings.single" :options="filterData.options" @change="selectOptions($event)"
                        @select="selectOptions($event)" />
                    <VueDatePicker v-if="filterData.type === 'date'" v-model="filterData.selected"
                        :enable-time-picker="false" format="yyyy-MM-dd" model-type="yyyy-MM-dd" text-input="true"
                        @change="selectOptions($event)" @select="selectOptions($event)" />
                    <CFormInput v-if="filterData.type === 'open'" type="text" v-model="filterData.selected" placeholder=""
                        text="" />
                </CCol>
            </CRow>
            <br/>
            <CButton @click="filter_add" color="success">Add Condition to Group {{ filterData.activeGroup + 1 }}</CButton>

        </CCardBody>
    </CCard>
    <br />

</template>
   
<script setup>

import { CButton, CCardBody, CCardHeader, CCardTitle } from '@coreui/vue';
import { ref } from 'vue';

const selectedValue = ref("")

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

const filterData = ref({
    variable: '',
    type: 'single',
    options: '',
    selected: '',
    operators: '',
    operator: '',
    filter: [[]],
    activeGroup: 0
})


const props = defineProps({
    startingFilter: Object,
    modelValue: Object,
    variables: Array,
    variableOptions: Object,
    variableOperators: Object,
    types: Object,
})

let emit = defineEmits(['update:modelValue','updateFilter']);

filterData.value.filter = props.startingFilter

const selectVariable = function (event) {
    filterData.value.type = props.types[filterData.value.variable]
    filterData.value.options = props.variableOptions[filterData.value.variable]
    filterData.value.operators = props.variableOperators[filterData.value.variable]
    filterData.value.operator = filterData.value.operators[0]
    filterData.value.selected = ""
    emit('update:modelValue', filterData.value)
}

const selectOptions = function (event) {
    emit('update:modelValue', filterData.value)
}

const selectOperator = function (event) {
    emit('update:modelValue', filterData.value)
}

const filter_add = function (event) {
    if (filterData.value.type == 'single') {
        if(filterData.value.selected.length>0){
        filterData.value.filter[filterData.value.activeGroup].push(filterData.value.variable + ' ' + filterData.value.operator + ' ("' + filterData.value.selected + '")')
        emit('update:modelValue', filterData.value)
        emit('updateFilter')
        }
    }
    else if (filterData.value.type == 'multi') {
        if(filterData.value.selected.length>0){
        let arrayOfOptions = filterData.value.selected
        for (let i = 0; i < filterData.value.selected.length; i++) {
            arrayOfOptions[i] = addQuotes(arrayOfOptions[i])
        }
        filterData.value.filter[filterData.value.activeGroup].push(filterData.value.variable + ' ' + filterData.value.operator + ' (' + arrayOfOptions.join(",") + ')')
        emit('update:modelValue', filterData.value)
        emit('updateFilter')
    }
    }
    else if (filterData.value.type == 'date') {
        if(filterData.value.selected.length>0){
        filterData.value.filter[filterData.value.activeGroup].push(filterData.value.variable + ' ' + filterData.value.operator + ' ("' + filterData.value.selected + '")')
        emit('update:modelValue', filterData.value)
        emit('updateFilter')
        }
    }
    else if (filterData.value.type == 'open') {
        if(filterData.value.selected.length>0){
        filterData.value.filter[filterData.value.activeGroup].push(filterData.value.variable + ' ' + filterData.value.operator + ' ("%' + filterData.value.selected + '%")')
        emit('update:modelValue', filterData.value)
        emit('updateFilter')
        }
    }

}


const filter_remove_last = function (index) {
    filterData.value.filter[index].pop()
    emit('update:modelValue', filterData.value)
    emit('updateFilter')
}

const filter_add_group = function (event) {
    filterData.value.filter.push([])
    filterData.value.activeGroup = filterData.value.activeGroup + 1
    emit('update:modelValue', filterData.value)

}

const filter_remove_group = function (event) {
    filterData.value.filter.splice(filterData.value.activeGroup, 1)
    filterData.value.activeGroup = filterData.value.filter.length - 1
    if (filterData.value.filter.length == 0) {
        filterData.value.filter.push([])
        filterData.value.activeGroup = 0
    }
    emit('update:modelValue', filterData.value)
    emit('updateFilter')
}

const active_group = function (index) {
    filterData.value.activeGroup = index
    emit('update:modelValue', filterData.value)
}


const addQuotes = function (str) {
    return `"${str}"`;
}

emit('update:modelValue', filterData.value)




</script>

