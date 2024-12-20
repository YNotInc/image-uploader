// Import Server-Side Utilities:
import { api as API } from './API';

export let token = {
    refresh: async (url:string, accessToken: string, refreshToken: string, email: string, expired:boolean) => {
        console.log('In REFRESHTOKENS:', refreshToken);
        /*************************************************************
         *  package and send the body to the endpoint
         ************************************************************/
        let newCredentialResponse = await API.refreshTokens(url, accessToken, refreshToken, email, expired);
        console.log("tokenStore: newCredentialResponse = ", newCredentialResponse);

        /*************************************************************
         * Send the newCredentialResponse back to the calling program
         ************************************************************/
        return newCredentialResponse;
    }
};