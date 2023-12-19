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
<CModal :visible="showConfirmation" @close="() => { showConfirmation = false }">
<CModalHeader>
    <CModalTitle>Low Balance</CModalTitle>
</CModalHeader>
<CModalBody>
    Are you sure you want to confirm all payments for this session? <br /><br />
    For this session, you will need: ${{ neededFunds.toFixed(2) }}.<br /><br />
    You have: ${{ balance.toFixed(2) }}
</CModalBody>
<CModalFooter>
    <CButton color="success" @click="confirm_all(info, touches)">
        Confirm
    </CButton>
    <CButton color="danger" @click="() => { showConfirmation = false }">
        Cancel
    </CButton>
</CModalFooter>
</CModal>
<!-- Error modal for low balance on session start -->
<CModal :visible="lowBalanceError" @close="() => { lowBalanceError = false }">
<CModalHeader>
    <CModalTitle>Low Balance</CModalTitle>
</CModalHeader>
<CModalBody>
    Your research fund balance is too low to start this session. <br /><br />
    You must have at least 50% of the total expected session cost in research funds to start the session.<br /><br />
    For this session, you will need: ${{ neededFunds.toFixed(2) }}.<br /><br />
    You have: ${{ balance.toFixed(2) }}
</CModalBody>
<CModalFooter>
    <CButton color="primary" @click="() => { lowBalanceError = false }">
        Close
    </CButton>
</CModalFooter>
</CModal>
<!-- Error modal for low balance on payment confirmation -->
<CModal :visible="insufficientFundsError" @close="() => { insufficientFundsError = false }">
<CModalHeader>
    <CModalTitle>Low Balance</CModalTitle>
</CModalHeader>
<CModalBody>
    You do no have sufficient funds for this payment.
    <br /><br />
    Selected Payment: ${{ neededFunds.toFixed(2) }}.<br /><br />
    You have: ${{ balance.toFixed(2) }}
</CModalBody>
<CModalFooter>
    <CButton color="primary" @click="() => { insufficientFundsError = false }">
        Close
    </CButton>
</CModalFooter>
</CModal>