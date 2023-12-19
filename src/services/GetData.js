import axios from 'axios'
import store from '@/store/index.js'
import { getAccessTokenSilentlyOutsideComponent } from '@/auth/ExternalAuth'

axios.defaults.baseURL = 'https://www.econhive.com/api'


// Get Role
export async function UsersGetRole() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/users/get_role', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {

    },
  })
  return response
}

// Get Funds
export async function UsersGetFunds() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/users/get_funds', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Get Funds Detail
export async function UsersGetFundsDetail() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/users/get_funds_detail  ', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Get number of participants that meet an R dplyr filter.
export async function ResearcherQueryPool(filter) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/query_pool', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      filter: filter,
      
    },
  })
  return response
}

// Update experiment status.
export async function ResearcherChangeExperimentStatus(session_id, status) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/change_experiment_status', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
      status: status,
      
    },
  })
  return response
}

// Get summary of running and completed experiment.
export async function ResearcherGetHistoryResearcher() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_history_researcher', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Get preregistrations
export async function ResearcherGetPreregistrations(id) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_preregistrations', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      id: id,
      
    },
  })
  return response
}

// Get touches given experiment id
export async function ResearcherGetTouchesForSession(session_id) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_touches_for_session', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
      
    },
  })
  return response
}

// Confirm participant given participant id and session id.
export async function ResearcherChangeTouchStatus(
  session_id,
  participant_id,
  status,
) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/change_touch_status', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
      participant_id: participant_id,
      status: status,
      
    },
  })
  return response
}

// Confirm participant given participant id and session id.
export async function ResearcherConfirmAll(session_id) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/confirm_all', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
    },
  })
  return response
}

// Reject participant given participant id and session id.
export async function ResearcherNewPreregistration(id, markdown) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/new_preregistration', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      project_id: id,
      markdown: markdown,
      
    },
  })
  return response
}

// Reject participant given participant id and session id.
export async function ResearcherNewExperiment(session_data) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/new_experiment', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_data: session_data,
      
    },
  })
  return response
}


export async function QueryDB(query) {
  
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/users/query_db', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      query:query,
    },
  })
  return response
}


// Reject participant given participant id and session id.
export async function ResearcherEditExperiment(session_data) {
  
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/edit_experiment', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_data: session_data,
      
    },
  })
  return response
}

// Reject participant given participant id and session id.
export async function ResearcherNewProject(project_data) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/new_project', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      project_data,
      
    },
  })
  return response
}

// Get Projects.
export async function ResearcherGetProjects() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_projects', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// New Payment.
export async function ResearcherNewPayment(amount) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/new_payment', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
      amount: amount,
      source: 'paypal',
    },
  })
  return response
}

// Reject participant given participant id and session id.
export async function ResearcherEditProject(project_data) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/edit_project', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      project_data: project_data,
      
    },
  })
  return response
}

// Manually add subject payments and confirm participation.
export async function ResearcherManuallyConfirm(session_id, csv) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/manually_confirm', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
      csv: csv,
      
    },
  })
  return response
}

// Get all unique values of a demographic variable.
export async function ResearcherGetValues(variable) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_values', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
      variable: variable,
    },
  })
  return response
}

// Get data files available for session_id.
export async function ResearcherGetDataForSession(id) {
  
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_data_for_session', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      project_id: id,
      
    },
  })
  return response
}

// Download Data
export async function ResearcherDownloadData(session_id, version) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/download_data', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      // @serializer csv
      session_id: session_id,
      version: version,
      
    },
  })
  return response
}

// Public Download Data
export async function PublicDownloadData(project_id, version) {
  const response = await axios.get('/public/download_data?id='+project_id+'&version='+version)
  return response
}

// Upload Data
export async function ResearcherUploadData(file,comment,id) {
  let formData = new FormData();
  console.log(id)
  formData.append("file", file);
  formData.append("params", JSON.stringify({
    comment: comment,
    project_id: id,
  }))
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  formData.append("headers", JSON.stringify({
    jwt: jwt,
    email: store.state.user.email,
  }))
    const response = await axios.post('/researcher/upload_data', formData)
  return response
}

// Get Public Projects
export async function GetPublicProjects() {
  const response = await axios.get('/public/get_public_projects')
  return response
}

// Get Public Preregistrations
export async function GetPublicPreregistrationsForProject(id) {
  const response = await axios.get('/public/get_public_preregistrations_for_project?id='+id)
  console.log('/public/get_public_preregistrations_for_project?id='+id)
  return response
}

// Get Public Data
export async function GetPublicDataForProject(id) {
  const response = await axios.get('/public/get_public_data_for_project?id='+id)
  return response
}


// Get Researcher Profile
export async function ResearcherGetProfile() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_profile', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Get Experiment List
export async function ResearcherGetExperimentList() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_experiment_list', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Get Researcher List
export async function ResearcherGetResearcherList() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_researcher_list', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Get info for eligible sessions given participant's email.
export async function SubjectGetExperimentInfoForEligibleSessions() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post(
    '/subject/get_experiment_info_for_eligible_sessions',
    {
      headers: {
        jwt: jwt,
        email: store.state.user.email,
      },
      params: {
        
      },
    },
  )

  return response
}

// Get Session URL Given Session ID.
export async function SubjectGetExperimentInfo(session_id) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/subject/get_experiment_info', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
      
    },
  })
  return response
}

// Start experiment given session id and participant number.
export async function SubjectStartExperiment(session_id) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/subject/start_experiment', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
      
    },
  })
  return response
}

// Start experiment given session id and participant number.
export async function ExperimentFinishExperiment(session_id) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/experiment/finish_experiment', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
      
    },
  })
  return response
}

// Get ID From Email
export async function GetId() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/users/get_id_from_email', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
      
    },
  })
  return response
}

// Get experiment history for email.
export async function SubjectGetHistory() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/subject/get_history', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Get payment totals for user.
export async function SubjectGetHistorySummary() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/subject/get_history_summary', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Get Profile
export async function SubjectGetProfile() {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/subject/get_profile', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      
    },
  })
  return response
}

// Submit Profile
export async function SubjectSubmitProfile(profile) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/subject/submit_profile', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      profile: profile,
      
    },
  })
  return response
}

// Update Profile
export async function SubjectUpdateProfile(profile) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/subject/update_profile', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      profile: profile,
      
    },
  })
  return response
}


export async function ResearcherGetReceipt(session_id) {
  const jwt = await getAccessTokenSilentlyOutsideComponent()
  const response = await axios.post('/researcher/get_receipt', {
    headers: {
      jwt: jwt,
      email: store.state.user.email,
    },
    params: {
      session_id: session_id,
    },
  })
  return response
}
