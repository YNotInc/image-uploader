import { token as tokenStore } from './token-store';
// import * as authenticationStore from "./authenticationStore";
import * as auth from './authentication-store';

export let credentials = {
    // Pulls credentials from backend and stores in localstorage
    setLocalCredWNewTokens: async (
        refresh_token: string, refreshURL: string, authToken: string,
        email: string, hasAccessTokenExpired: boolean) => {
        console.log("ProductListContainer refresh-token: ", refresh_token);

        /***************************************
         * Step3: RefreshTokens: If tokens have expired
         * **************************************/
        try {
            /*********************************
             * Step3b:Call refreshTokens to perform update
             *********************************/
            console.log("CredentialStore: Before TokenStore Call");
            let res = await tokenStore.refresh(refreshURL, authToken, refresh_token, email, hasAccessTokenExpired);
            /**************************/
            console.log("CredentialStore: After TokenStore Call");

            // do something with response
            console.log("ProductionList:response returned", res);
            if (res?.status === 200) {
                console.log("NEW ACCESS TOKENS HAVE BEEN RECEIVED RES:", res);
                /***********************************************
                 * Step4: Set Local Storage Variables
                 ************************************************/
                let { access_token, refresh_token, expiration, email, message } = await auth.setLocalStorage(
                    res.data.access_token,
                    res.data.refresh_token,
                    res.data.expiration,
                    res.data.email,
                    res.data.message);
                console.log("After setlocalStorage");
                /*********************************************
                 * STEP5: Return variables to productListContainer
                 ********************************************/
                return ({
                    access_token,
                    refresh_token,
                    expiration,
                    email,
                    message
                });
                // console.log("After return");
                /********************************************/
                // }
            } // if
        } // try
        catch (err) {
            // Clear all localStorage, due to invalid Refresh token
            if (err.response.status === 401) {
                console.log('401 status received in ProductUpdate');
                /***********************************************
                 * STEP6: Reset Local Storage Variables
                 ************************************************/
                // console.log("In if 3: baseURL =", baseURL);
                await auth.resetLocalStorage();

                /*********************************************
                 * STEP7: SET STATE VARIABLES FROM Local Storage
                 *********************************************/
                return ({
                    authToken: '',
                    access_token: '',
                    refresh_token: '',
                    expiration: null,
                    email: '',
                    hasAccessTokenExpired: false,
                    isUserAuthorized: false,
                    message: err.response.data.message
                });
            } // if
        } // catch  
    }, // get
    /************************************************
         Get all state credentials from local storage to send a get request for data 
    ************************************************/
    getEvaluatedCredentials: (
        curCredentials: CurrentCredentialType) => {
        let authToken = "Bearer " + curCredentials.access_token;

        let hasAccessTokenExpired = auth.hasAccessTokenExpired();

        const credentials = {
            access_token: curCredentials.access_token,
            refresh_token: curCredentials.refresh_token,
            expiration: curCredentials.expiration,
            email: curCredentials.email,
            message: curCredentials.message,
            hasAccessTokenExpired,
            authToken,
            isUserAuthorized: true,
            refreshed: false
        };
        return credentials;
    }
}; // export