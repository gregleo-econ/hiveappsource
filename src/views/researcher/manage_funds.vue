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
                    <CTable align="middle" class="mb-0 border" hover responsive>
                        <CTableHead color="light">
                            <CTableRow>
                                <CTableHeaderCell class="text-center">Date</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Amount</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Source</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Experiment</CTableHeaderCell>
                                <CTableHeaderCell class="text-center">Participant #</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            <CTableRow v-for="item in items" :key="item.date">
                                <CTableDataCell class="text-center">{{
                                    format_date(item.date * 1000)
                                }}</CTableDataCell>
                                <CTableDataCell v-if="item.amount > 0" class="text-center"><span
                                        class="text-success">${{ item.amount }}</span></CTableDataCell>
                                <CTableDataCell v-else class="text-center"><span
                                        class="text-danger">-${{ Math.abs(item.amount) }}</span></CTableDataCell>
                                <CTableDataCell class="text-center">{{ item.source }}</CTableDataCell>
                                <CTableDataCell v-if="item.amount < 0" class="text-center">{{ item.experiment }}
                                </CTableDataCell>
                                <CTableDataCell v-else class="text-center"></CTableDataCell>
                                <CTableDataCell v-if="item.amount < 0" class="text-center">{{
                                    item.participant_number }}
                                </CTableDataCell>
                                <CTableDataCell v-else class="text-center"></CTableDataCell>
                            </CTableRow>
                            <CTableRow> </CTableRow>
                        </CTableBody>
                    </CTable>

                </CCardBody>
            </CCard>
            <loadingAnimation v-if="showLoading"></loadingAnimation>
        </CCol>


    </CRow>
</template>


<script setup>

import axios from 'axios'
import { ref } from 'vue'
import { useStore } from 'vuex'
import { CIcon } from '@coreui/icons-vue';
import { loadScript } from '@paypal/paypal-js';
import { CCardText } from '@coreui/vue';

const store = useStore()
const items = ref({})
const balance = ref(0)
const show_add_funds = ref(false)
const amount = ref(100)
const paid = ref(false);
const CLIENT_ID = 'test';
const showLoading = ref(true)


loadScript({ "client-id": CLIENT_ID }).then((paypal) => {
    paypal.Buttons({
        createOrder: function (data, actions) {
            // This function sets up the details of the transaction, including the amount and line item details.
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
                console.log(details)
                alert('Transaction completed for $' + details.purchase_units[0].amount.value)
                axios
                    .post('http://127.0.0.1:9985/api/researcher/new_payment?researcher_email=' + store.state.user.email + '&amount=' + details.purchase_units[0].amount.value + '&source=paypal')
                    .then(res => {
                        axios
                            .get(
                                'http://127.0.0.1:9985/api/users/get_funds?my_email=' +
                                store.state.user.email,
                            )
                            .then((res) => {
                                balance.value = "$" + res.data[0]
                            });
                        axios
                            .get(
                                'http://127.0.0.1:9985/api/users/get_funds_detail?my_email=' +
                                store.state.user.email,
                            )
                            .then((res) => {
                                items.value = res.data

                            });
                        show_add_funds.value = false;
                    })
            });
        }
    }).render('#paypal-button-container');
})


axios
    .get(
        'http://127.0.0.1:9985/api/users/get_funds?my_email=' +
        store.state.user.email,
    )
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


axios
    .get(
        'http://127.0.0.1:9985/api/users/get_funds_detail?my_email=' +
        store.state.user.email,
    )
    .then((res) => {
        items.value = res.data
        showLoading.value = false

    })

const add_funds = function () {
    show_add_funds.value = true;

}


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