import React, { useState, useEffect } from "react";
import { urlBtnUpdates } from "utils/url-btn-updates";
import Can from "components/can";

// import "../style.css";
import UpdateBtn from "components/buttons/update-btn";
import DeleteBtn from "components/buttons/delete-btn";
import * as auth from '../../utils/authentication-store';

import { deleteProduct, getProductDetails, stageDBAction } from '../../utils/product-store';
import { credentials as credentialStore } from "../../utils/credential-store";

const ProductViewContainer = (props: ProductViewPropType) => {
    const deleteURL = '/api/products/product/delete/';
    const refreshURL = '/user/login/refresh';
    const updatePath = "update/";
    
    const initState: ProductViewStateType = {
        productItemComponent: null,
        baseUrl: '',
        access_token: '',
        authToken: '',
        refresh_token: '',
        expiration: '',
        email: '',
        hasAccessTokenExpired: false,
        isUserAuthorized: true,
        loading: false,
        message: '',
    };

    //Set State to initial value
    const [state, setState] = useState(initState);

    // Retrieve products
    useEffect(() => {
        /*************************************
         * Step1: Update navbar highlighting 
         * for address bar changes on first 
         * render or re-render.  Normaly placed 
         * in componentDidMount
         * ************************************/
        urlBtnUpdates();

        /*****************************************
        * Step2: Parse URL to Create Query API URI
        *****************************************/
        let url = window.location.pathname;
        console.log(`URL: ${url}`);
        let urlArray = url.split('/');
        console.log("@@@URLARRAY:", urlArray);
        //replace space with app
        urlArray.splice(0, 1, '/api');
        // construct api URL Syntax: /api/products/product/:id
        // urlArray.splice(2, 1);
        const baseUrl = urlArray.join('/');
        console.log("baseUrl:", baseUrl);

        /******************************************
           * STEP3: Evaluate localStorage credentials 
           * and set STATE VARIABLES with evaluated 
           * credentials, before sending api request
           *****************************************/
        const fetchCredentials = async () => {
            // Retrieve StateCredentials
            const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());
            console.log("FetchCredentials:", evaluatedCredentials);
            // Set state credentials
            setState((prevState) => ({
                ...prevState,
                ...evaluatedCredentials
            }));
            console.log(`FetchCredentials: STATE: ${JSON.stringify(state)}`);

            console.log("ProductViewContainer-AUTHTOKEN Set to LocalStorage:", state.authToken);
            /*************************************/
        };

        //call fetchCredentials
        fetchCredentials();

        /**********************************************
         * STEP4: If accessToken expired, use 
         * refreshToken to generate a new accessToken. 
         * If refreshToken expired, clear all tokens 
         * from localStorage
         *********************************************/
        const fetchAccessTokens = async () => {
            // Retrieve StateCredentialsif (state.hasAccessTokenExpired) {
            if (state.hasAccessTokenExpired) {
                    try {
                        /***********************************
                         * STEP5: Call credendentialStore to Refresh All credentials and set local storage with results, if Refresh Token is valid. Else set revoke credentials.
                         ***********************************/
                        let userCredentials = await credentialStore.setLocalCredWNewTokens(state.refresh_token, refreshURL, state.authToken, state.email, state.hasAccessTokenExpired);

                        console.log(`FetchAccessTokens: userCredentials: ${JSON.stringify(userCredentials)}`);
                        /***********************************/
                        console.log(`FetchAccessTokens: userCredentialsTEST`);

                        if (userCredentials) {
                            console.log("NEW ACCESS TOKENS HAVE BEEN RECEIVED userCredentials:", userCredentials);
                            /**********************************
                             * STEP6: Evaluate localStorage 
                             * credentials and set state 
                             * variables with results 
                             *********************************/   // Get state credentials
                            const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());
                            console.log("FetchAccessTokens: EVALUATEDCREDENTIALS:", evaluatedCredentials)
                            // Set state credentials
                            setState((prevState) => ({
                                ...prevState,
                                ...evaluatedCredentials
                            }));

                            console.log(`New AUTHTOKEN0 after Refresh: ${JSON.stringify(state)}`);
                        }
                        // AccessToken and RefreshToken expired
                        else {
                            props.setRole("visitor", true);
                            auth.resetLocalStorage();
                        }
                    }
                    catch (err) {
                        // Clear all localStorage, due to invalid Refresh token
                        console.log("err: ", err);
                        if (err.response.status === 401) {
                            console.log('401 status received in ProductInsert');
                            /**********************
                             * Reset Local Storage 
                             * Variables
                             ***********************/
                            await auth.resetLocalStorage();
                        }
                    }
                }//if   
        } // fetch accessTokens

            // Call fetchAccessTokens
            fetchAccessTokens();
            /*********************************************/
            /*******************************
             * STEP 6: PERFORM A DB ACTION IF 
             * TOKENS R VALID
             ********************************/
            //Fetch Products:
            const fetchProducts = async () => {
                if (state.isUserAuthorized) {
                    console.log("EMAIL IN STAGEDBACTION:", state.email);
                    // make product request and set productItemComponent
                    let productItemComponent = await getProductDetails(baseUrl, state.authToken, state.refresh_token);
                    console.log("FetchProducts: ITEMS:", JSON.stringify(productItemComponent));
                    // setProductItemComponent(items);
                    setState((prevState) => ({
                        ...prevState,
                        productItemComponent
                    }));
                }//if
                else {
                    console.log(`USER NOTE AUTHORIZED: ${state.isUserAuthorized}`);
                }
                /*****************************************/
                console.log("ViewContainer Props2:", props.role);

                // check if user Credentials Active:
                props.areCredentialsValid();
                console.log("USER ACTIVE:", props.credentialsActive);
            }
            // Call FetchProducts
            fetchProducts();
        }, [state.authToken, state.email, state.hasAccessTokenExpired, state.access_token, state.refresh_token, state.productItemComponent?.props.image]);

    const deleteClickHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault();
            /************************************
             * STEP1: GET Product ID to be deleted
             ************************************/
            let productId = (event.target as HTMLButtonElement).id;

            /******************************************
             * STEP2: Evaluate localStorage credentials and set STATE VARIABLES with evaluated credentials
             *******************************/
            // Retrieve StateCredentials
            const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());

            // Set state credentials
            setState((prevState) => ({
                ...prevState,
                ...evaluatedCredentials
            }));

            console.log("AUTHTOKEN Set to LocalStorage:", state.authToken);
            /*************************************/

            console.log("hasAccessTokenExpired", state.hasAccessTokenExpired);
            /*************************************
             * STEP3: If accessToken expired, use 
             * refreshToken to generate a new 
             * accessToken. If refreshToken 
             * expired, clear all tokens from 
             * localStorage
             ************************************/
            if (state.hasAccessTokenExpired) {
                try {
                    /*****************************
                     * Step4: Call 
                     * credendentialStore to get 
                     * new AccessTokens from the 
                     * API, AND SET LOCAL STORAGE 
                     * WITH RESULTS, if 
                     * refreshTokens valid
                     **************************/
                    let newUserCredentials = await credentialStore.setLocalCredWNewTokens(state.refresh_token, refreshURL, state.authToken, state.email, state.hasAccessTokenExpired);
                    /***********************************/

                    if (newUserCredentials) {
                        console.log("NEW ACCESS TOKENS HAVE BEEN RECEIVED From Refresh;  newUserCredentials:", newUserCredentials);
                        /***********************
                         * STEP5: Evaluate 
                         * localStorage 
                         * credentials and set 
                         * state variables with 
                         * results 
                         ***********************/
                        // Get state credentials
                        const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());

                        // Set state credentials
                        setState((prevState) => ({
                            ...prevState,
                            ...evaluatedCredentials
                        }));

                        console.log("New AUTHTOKEN after Refresh:", state.authToken);
                    }
                    // AccessToken and RefreshToken expired
                    else {
                        props.setRole("visitor", true);
                        auth.resetLocalStorage();
                    }
                }
                catch (err) {
                    // Clear all localStorage, due to invalid Refresh token
                    console.log("err: ", err);
                    if (err.response.status === 401) {
                        console.log('401 status received in ProductInsert');
                        /**********************
                         * Reset Local Storage 
                         * Variables
                         ***********************/
                        await auth.resetLocalStorage();
                    }
                }
            } // if
            /*************************************************/
            console.log("AUTHORIZED?:", state.isUserAuthorized);
            if (state.isUserAuthorized) {
                /*******************************
                 *STEP 6: PERFORM A DB ACTION IF TOKENS R VALID
                ********************************/
                console.log("EMAIL IN STAGEDBACTION:", state.email);

                // Stage DB Action, by passing it the 
                // action to be performed as last argument
                // and setting state with the results
                let dbActionResults = await stageDBAction(
                    productId,
                    state.email,
                    null,
                    null,
                    null,
                    deleteURL,
                    state.refresh_token,
                    state.authToken,
                    state.hasAccessTokenExpired,
                    deleteProduct);

                // Set state variables
                setState((prevState) => ({
                    ...prevState,
                    ...dbActionResults
                }));
            }
        }
        catch (err) {
            console.log("ERROR:", err);
            console.log("User is logged out");
            setState((prevState: any) => ({
                ...prevState,
                message: "User is logged out"
            }));

        }

        // reroute to products page 
        props.history.push('/products');
    }

    return (
        <React.Fragment>
            {!props.loggedOut ? <Can
                role={props.role}
                perform="products:view"
                yes={
                    () => (
                        <>{state.productItemComponent}</>
                    )}
                no={() => <></>}
            /> : ''}
            <div className="text-center">
                {!props.loggedOut ? <Can
                    role={props.role}
                    perform="products:update"
                    yes={
                        () => (
                            <>
                                <UpdateBtn
                                    id={state.productItemComponent?.props?.id}
                                    name={"Update"}
                                    value={state.productItemComponent?.props?.value}
                                    path={updatePath}
                                    btnName={"Update"}
                                />
                            </>
                        )}
                    no={() => <></>}
                /> : ''}
                {!props.loggedOut ? <Can
                    role={props.role}
                    perform="products:delete"
                    yes={() => (
                        <>
                            <DeleteBtn
                                btnName={"Delete"}
                                btnClickHandler={(event) => deleteClickHandler(event)}
                                id={state.productItemComponent?.props?.id}
                            />
                        </>
                    )}
                    no={() => <></>}
                /> : ''}
            </div>
        </React.Fragment>
    )
}

export default ProductViewContainer;