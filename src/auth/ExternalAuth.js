import { auth0 } from '@/auth/auth';

export async function getAccessTokenSilentlyOutsideComponent() {
  try {
    return await auth0.getAccessTokenSilently()
  }
  catch (e) {
    if(e.error=="login_required"){auth0.loginWithRedirect()}

  }
}