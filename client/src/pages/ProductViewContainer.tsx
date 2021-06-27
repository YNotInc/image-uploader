import { AxiosResponse } from "axios";
import React, { Component } from "react";
import { urlBtnUpdates } from "utils/url-btn-updates";
import Can from "components/can";

// import "../style.css";
import UpdateBtn from "components/buttons/update-btn";
import DeleteBtn from "components/buttons/delete-btn";
import * as auth from '../utils/authentication-store';

import { deleteProduct, getProductDetails, stageDBAction } from '../utils/product-store';
import { credentials as credentialStore } from "utils/credential-store";

class ProductViewContainer extends Component<ProductViewPropType> {
    // props!: ProductViewPropType;
    deleteURL = '/api/products/product/delete/';
    refreshURL = '/user/login/refresh';

    _productItemComponent!: JSX.Element;
    state: ProductViewStateType;

    deleteProduct: (url: string, productId: string, email: string, accessToken: string, refresh_token: string, expired: boolean, name?: null, value?: null, imageSrc?: null) => Promise<AxiosResponse<any> | undefined>;

    _productsListData: ProductDataType[];

    constructor(props: ProductViewPropType) {
        super(props);

        console.log("ViewPROPS:", props);
        this._productsListData = [];
        // 2/14/21: everthing after baseUrl added
        this.state = {
            productsList: [],
            productListData: [],
            productItem: {},
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
            // role: this.props.role,
        };

        this.deleteProduct = deleteProduct.bind(this);
        console.log("ViewContainer Props1:", this.props.role);
    } // constructor

    get productsListData(): ProductDataType[] {
        return this._productsListData;
    }
    /******************************
     * 1/8/19: setUser HERE
     ******************************/
    set productsListData(data) {
        auth.getLocalStorage().then((curCredentials: any) => { this.setState(curCredentials) });

        console.log("----Data", data);
        this._productsListData = data;
    } // setProductList

    /**
     * Deletes selected item
     * @param event 
     */
    async deleteClickHandler(event: React.MouseEvent<HTMLButtonElement>) {
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
            this.setState(evaluatedCredentials);

            console.log("AUTHTOKEN Set to LocalStorage:", this.state.authToken);
            /*************************************/

            console.log("hasAccessTokenExpired", this.state.hasAccessTokenExpired);
            /*************************************
             * STEP3: If accessToken expired, use 
             * refreshToken to generate a new 
             * accessToken. If refreshToken 
             * expired, clear all tokens from 
             * localStorage
             ************************************/
            if (this.state.hasAccessTokenExpired) {
                try {
                    /*****************************
                     * Step4: Call 
                     * credendentialStore to get 
                     * new AccessTokens from the 
                     * API, AND SET LOCAL STORAGE 
                     * WITH RESULTS, if 
                     * refreshTokens valid
                     **************************/
                    let newUserCredentials = await credentialStore.setLocalCredWNewTokens(this.state.refresh_token, this.refreshURL, this.state.authToken, this.state.email, this.state.hasAccessTokenExpired);
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
                        this.setState(evaluatedCredentials);

                        console.log("New AUTHTOKEN after Refresh:", this.state.authToken);
                    }
                    // AccessToken and RefreshToken expired
                    else {
                        this.props.setRole("visitor", true);
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
            console.log("AUTHORIZED?:", this.state.isUserAuthorized);
            if (this.state.isUserAuthorized) {
                /*******************************
                 *STEP 6: PERFORM A DB ACTION IF TOKENS R VALID
                ********************************/
                console.log("EMAIL IN STAGEDBACTION:", this.state.email);

                // Stage DB Action, by passing it the 
                // action to be performed as last argument
                // and setting state with the results
                let dbActionResults = await stageDBAction(
                    productId,
                    this.state.email,
                    null,
                    null,
                    null,
                    this.deleteURL,
                    this.state.refresh_token,
                    this.state.authToken,
                    this.state.hasAccessTokenExpired,
                    this.deleteProduct);

                // Set state variables
                this.setState(dbActionResults);

                // set instance variable productListData
                this.productsListData = this.state.productsList;
            }
        }
        catch (err) {
            console.log("ERROR:", err);
            console.log("User is logged out");
            this.setState({ message: "User is logged out" });
        }

        // reroute to products page 
        this.props.history.push('/products');
    }
    /**
     * Components did mount - Parses the url and 
     * makes a backend api request for a product 
     * with the product id 
     */
    async componentDidMount() {
        // Update navbar for address bar changes
        urlBtnUpdates();

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

        //4/5/2021
        /************************************/
        /******************************************
             * STEP2: Evaluate localStorage credentials and set STATE VARIABLES with evaluated credentials
             *******************************/
        // Retrieve StateCredentials
        const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());

        // Set state credentials
        this.setState(evaluatedCredentials);

        console.log("ProductViewContainer-AUTHTOKEN Set to LocalStorage:", this.state.authToken);
        /*************************************/

        console.log("ProductViewContainer- hasAccessTokenExpired:", this.state.hasAccessTokenExpired);
        /**************************************************
         * STEP3: If accessToken expired, use refreshToken to generate a new accessToken. If refreshToken expired, clear all tokens from localStorage
         **************************************************/
        if (this.state.hasAccessTokenExpired) {
            try {
                /***********************************
                 * STEP4: Call credendentialStore to Refresh All credentials and set local storage with results, if Refresh Token is valid. Else set revoke credentials.
                 ***********************************/
                let userCredentials = await credentialStore.setLocalCredWNewTokens(this.state.refresh_token, this.refreshURL, this.state.authToken, this.state.email, this.state.hasAccessTokenExpired);
                /***********************************/

                if (userCredentials) {
                    console.log("NEW ACCESS TOKENS HAVE BEEN RECEIVED userCredentials:", userCredentials);
                    /*********************************************
                     * STEP5: Evaluate localStorage credentials and set state variables with results 
                     ********************************************/   // Get state credentials
                    const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());

                    // Set state credentials
                    this.setState(evaluatedCredentials);

                    console.log("New AUTHTOKEN after Refresh:", this.state.authToken);
                }
                // AccessToken and RefreshToken expired
                else {
                    this.props.setRole("visitor", true);
                    auth.resetLocalStorage();
                }
            }
            catch (err) {
                // Clear all localStorage, due to invalid Refresh token
                console.log("err: ", err);
            }
        } // if
        /*************************************************/
        console.log("ProductViewContainer AUTHORIZED?:", this.state.isUserAuthorized);
        if (this.state.isUserAuthorized) {
            /*******************************
             *STEP 6: PERFORM A DB ACTION IF TOKENS R VALID
            ********************************/
            //4/5/2021
            console.log("EMAIL IN STAGEDBACTION:", this.state.email);
            // make product request and set productItemComponent
            this.productItemComponent = await getProductDetails(baseUrl, this.state.authToken, this.state.refresh_token);
            console.log("PRODUCTVIEWCONTAINER-Product:", this.productItemComponent);
        }
        /************************************/



        console.log("ViewContainer Props2:", this.props.role);

        // check if user Credentials Active:
        this.props.areCredentialsValid();
        console.log("USER ACTIVE:", this.props.credentialsActive);
    }// ComponentDidMount

    /**
     * Sets product item component
     */
    set productItemComponent(productItem: JSX.Element) {
        this._productItemComponent = productItem;
        // console.log("in get", this._productItemComponent);

        this.setState({ productItem: this._productItemComponent });
        // console.log('productItemComponent', this.state.productItem);
    }

    /**
     * Gets product item component
     */
    get productItemComponent() {
        return this._productItemComponent;
    }

    render() {
        const role = this.props.role;
        const product = this.productItemComponent;
        const props = product?.props;

        const updatePath = "update/";
        let loggedOut = this.props.loggedOut;
        console.log("User loggedOut:", loggedOut, " role:", role);
        return (
            <React.Fragment>
                {!loggedOut ? <Can
                    role={role}
                    perform="products:view"
                    yes={
                        () => (
                            <>{product}</>
                        )}
                    no={() => <></>}
                /> : ''}
                <div className="text-center">
                    {!loggedOut ? <Can
                        role={role}
                        perform="products:update"
                        yes={
                            () => (
                                <>
                                    <UpdateBtn
                                        id={props?.id}
                                        name={"Update"}
                                        value={props?.value}
                                        path={updatePath}
                                        btnName={"Update"}
                                    />
                                </>
                            )}
                        no={() => <></>}
                    /> : ''}
                    {!loggedOut ? <Can
                        role={role}
                        perform="products:delete"
                        yes={() => (
                            <>
                                <DeleteBtn
                                    btnName={"Delete"}
                                    btnClickHandler={(event) => this.deleteClickHandler(event)}
                                    id={props?.id}
                                />
                            </>
                        )}
                        no={() => <></>}
                    /> : ''}
                </div>
            </React.Fragment>
        )
    }
} // class

export default ProductViewContainer;