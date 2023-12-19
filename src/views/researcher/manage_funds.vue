<template>
    <CRow>
        <CCol :sm="3">
            <CWidgetStatsF color="dark" title="Balance" :value="balance">
                <template #icon>
                    <CIcon icon="cil-money" size="xl" />
                </template>
            </CWidgetStatsF>
            <BR />
            <CCard>
                <CCardBody>
                    <CCardTitle>Add Funds</CCardTitle>
                    <CCardText>Enter Amount</CCardText>
                    <CForm>
                        <CInputGroup class="mb-3">
                            <CInputGroupText>$</CInputGroupText>
                            <CFormInput type="numeric" v-model="amount" />
                        </CInputGroup>
                    </CForm>
                    <BR />
                    <CCardText>Select Method</CCardText>
                    <div v-if="!paid" id="paypal-button-container"></div>
                    <div v-else id="confirmation">Order complete!</div>
                </CCardBody>
            </CCard>
        </CCol>
        <CCol :sm="9">
            <CCard>
                <CCardBody>
                    <CCardTitle>Transactions</CCardTitle>
                    <div style="width:200px; margin-bottom:5px;">
                        <span>Search Field:</span>
                        <CFormSelect v-model="searchField">
                            <option value="session_id">Session Id #</option>
                            <option value="participant_id">Participant Id #</option>
                        </CFormSelect>
                    </div>
                    <div style="width:200px; margin-bottom:10px;">
                        <span>Search Value: </span>
                        <input type="text" v-model="searchValue">
                    </div>
                    <EasyDataTable v-if="showLoading == false" alternating header-class-name="customize-table-header"
                        header-item-class-name="customize-table-header-item" table-class-name="customize-table"
                        header-text-direction="center" body-text-direction="center" :headers="headers" :items="items"
                        :search-field="searchField" :search-value="searchValue">
                        <template #item-amount="item">
                            <span v-if="item.amount > 0" class="text-center text-success">${{
                                item.amount }}</span>
                            <span v-else class="text-center text-danger">-${{
                                Math.abs(item.amount) }}</span>
                        </template>
                        <template #item-date="item">
                            {{ format_date(item.date * 1000) }}
                        </template>
                    </EasyDataTable>
                </CCardBody>
            </CCard>
            <loadingAnimation v-if="showLoading"></loadingAnimation>
        </CCol>
    </CRow>
</template>
<script setup>
import { ref } from 'vue'
import { CIcon } from '@coreui/icons-vue';
import { loadScript } from '@paypal/paypal-js';
import { CCardText, CFormSelect } from '@coreui/vue';
import * as DataFunctions from '@/services/GetData.js'
const items = ref({})
const balance = ref(0)
const show_add_funds = ref(false)
const amount = ref(100)
const paid = ref(false);
const CLIENT_ID = 'test';
const showLoading = ref(true)
const searchField = ref("session_id");
const searchValue = ref();


const headers = [
    { text: "Date", value: "date", sortable: true },
    { text: "Amount", value: "amount", sortable: true },
    { text: "Source", value: "source", sortable: true },
    { text: "Session Id", value: "session_id", sortable: true },
    { text: "Participant Id", value: "participant_id", sortable: true },
]



loadScript({ "client-id": CLIENT_ID }).then((paypal) => {
    paypal.Buttons({
        createOrder: function (data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: amount.value
                    }
                }]
            });
        },
        onApprove: function (data, actions) {
            // This function captures the funds from the transaction.
            return actions.order.capture().then(function (details) {
                // This function shows a transaction success message to your buyer.
                DataFunctions.ResearcherNewPayment(details.purchase_units[0].amount.value)
                    .then(res => {
                        DataFunctions.UsersGetFunds()
                            .then((res) => {
                                balance.value = "$" + res.data[0]
                            });
                        DataFunctions.UsersGetFundsDetail()
                            .then((res) => {

                                items.value = res.data
                            });
                        show_add_funds.value = false;
                    })
                alert('Transaction completed for $' + details.purchase_units[0].amount.value)
            });
        }
    }).render('#paypal-button-container');
})
DataFunctions.UsersGetFunds()
    .then((res) => {
        balance.value = "$" + res.data[0]
    })

const format_date = function (date_string) {
    var date = new Date(date_string)
    return date.toLocaleDateString('en-US', {
        year: '2-digit',
        month: '2-digit',
        day: '2-digit',
    })
}

DataFunctions.UsersGetFundsDetail()
    .then((res) => {
        items.value = res.data
        showLoading.value = false
    })


</script>

<style>
#paypal-button-container {
    margin: 5px 0;
    text-align: center;
}

#confirmation {
    color: green;
    margin-top: 1em;
    font-size: 2em;
}

.paypal-button {
    max-width: 10px !important;
    max-height: 50px;
}
</style>