import { createAuth0 } from '@auth0/auth0-vue';

export const auth0 = createAuth0({
  domain: 'dev-z1ij1wuhd8l6lh8g.us.auth0.com',
  clientId: 'xFdDPR6WE0ILMo8AD85i7MBL7FEKXbYJ',
  cacheLocation: 'localstorage',
  authorizationParams: {
    redirect_uri: 'http://econhive.com/app/',
    audience: "http://137.184.10.117/oso/"
  },
  logoutParams: {
    returnTo: 'http://econhive.com/app/',
  }
});

// export async function getAccessTokenSilentlyOutsideComponent(options) {
//   return auth0.getAccessTokenSilently(options);
// }
