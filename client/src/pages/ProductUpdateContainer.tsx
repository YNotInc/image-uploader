import { ChangeEvent, Component } from "react";
import Can from "components/can";

// Import module to get/set variables from/in the LocalStorage
import * as auth from '../utils/authentication-store';

// Import Components
import UpdateForm from "../forms/product/update";
import { credentials as credentialStore } from '../utils/credential-store';
import { updateProduct, performDBAction } from '../utils/product-store';
import { Moment } from "moment";
import { urlBtnUpdates } from "utils/url-btn-updates";
import { getProductDetails } from '../utils/product-store';

class ProductUpdateContainer extends Component<ProductUpdatePropType> {
    refreshURL: string;
    baseURL: string;
    state: ProductUpdateStateType;
    constructor(props: ProductUpdatePropType) {
        super(props);
        let pushedProps = props.location.state;
        const name = pushedProps?.name;
        const value = pushedProps?.value;
        this.refreshURL = '/user/login/refresh';
        this.baseURL = '/api/products/product/update/';
        this.state = {
            productItemComponent: null,
            productId: '',
            productName: '',
            productValue: '',
            placeholderName: '',
            placeholderValue: '',
            authToken: '',
            refresh_token: '',
            email: '',
            hasAccessTokenExpired: false,
            isUserAuthorized: true,
            message: '',
        };
        this.setState({ productName: name });
        this.setState({ productValue: value });

        this.changeHandler = this.changeHandler.bind(this);
        this.updateClickHandler = this.updateClickHandler.bind(this);
    } // constructor

    /**
     * Sets product item component
     */
    set productItemComponent(productItem: JSX.Element) {
        this.setState({ productItemComponent: productItem });
        // console.log('productItemComponent', this.state.productItem);
    }

    /**
     * Gets product item component
     */
    get productItemComponent() {
        return this.state.productItemComponent as JSX.Element;
    }

    async setStateVariables(access_token: string, refresh_token: string, expiration: Moment | null, email: string, message: string) {
        /************************************************
         * SET State VARIABLES FROM LocalStorage
         ************************************************/
        let authToken = "Bearer " + access_token;

        console.log("Auth token", authToken);
        this.setState({ authToken });

        console.log("Refresh token", refresh_token);
        this.setState({ refresh_token });

        this.setState({ email });

        let hasAccessTokenExpired = await auth.hasAccessTokenExpired();

        console.log("Expired?", hasAccessTokenExpired);
        this.setState({ hasAccessTokenExpired });

        this.setState({ isUserAuthorized: true });

        this.setState({ message });
        /************************************************/
    }

    resetStateVariables() {
        this.setState({ authToken: '' });
        this.setState({ access_token: '' });
        this.setState({ refresh_token: '' });
        this.setState({ email: '' });
        this.setState({ hasAccessTokenExpired: false });
    }

    /**
     * Parse url and perform data fetch
     * Set state variables for React
     * Managed component
     */
    async componentDidMount() {
        // Update navbar for address bar changes
        urlBtnUpdates();

        let url = window.location.pathname;
        let urlArray = url.split('/');
        urlArray.splice(3, 1);
        //replace space with app
        urlArray.splice(0, 1, '/api');
        // Get Product PlaceHolder text
        // API Syntax: /api/products/product/:id
        // urlArray.splice(2, 1);
        const baseUrl = urlArray.join('/');
        // console.log("UPDATEBASEURL:", baseUrl);

        //4/5/2021
        /*****************************************
        * STEP2: Evaluate localStorage credentials * and set STATE VARIABLES with evaluated 
        * credentials
        *****************************************/
        // Retrieve StateCredentials
        const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());

        // Set state credentials
        this.setState(evaluatedCredentials);

        console.log("AUTHTOKEN Set to LocalStorage:", this.state.authToken);
        /*************************************/

        console.log("hasAccessTokenExpired", this.state.hasAccessTokenExpired);
        /***************************************
         * STEP3: If accessToken expired, use 
         * refreshToken to generate a new 
         * accessToken. If refreshToken expired, 
         * clear all tokens from localStorage
         **************************************/
        if (this.state.hasAccessTokenExpired) {
            try {
                /*********************************
                 * Step4: Call credendentialStore 
                 * to get new AccessTokens from 
                 * the API, AND SET LOCAL STORAGE 
                 * WITH RESULTS, if refreshTokens 
                 * valid. Else set revoke credentials.
                 *********************************/
                let newUserCredentials = await credentialStore.setLocalCredWNewTokens(this.state.refresh_token, this.refreshURL, this.state.authToken, this.state.email, this.state.hasAccessTokenExpired);
                /*********************************/

                if (newUserCredentials) {
                    console.log("NEW ACCESS TOKENS HAVE BEEN RECEIVED newUserCredentials:", newUserCredentials);
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
        console.log("ProductUpdateContainer AUTHORIZED?:", this.state.isUserAuthorized);
        if (this.state.isUserAuthorized) {
            // make product request like deleteProduct request
            this.productItemComponent = await getProductDetails(baseUrl, this.state.authToken, this.state.refresh_token);
            // object destructuring
            const { name, value, id } = this.productItemComponent.props;
            /*******************************************************
             Get data response from http request, after parsing URL
            *******************************************************/
            if (id && name && value) {

                /*******************************************
                 * Pass item info from click button
                 ******************************************/
                this.setState({
                    productId: id,
                    placeholderName: name,
                    placeholderValue: `$${value}`,
                });
            }
            /***********************************************************/
        }
        /******************************/
        //4/5/2021
    }

    changeHandler(event: ChangeEvent) {
        // First disable default behavior
        event.preventDefault();

        const {
            name,
            value
        }: EventTargetType = event.target as HTMLInputElement;

        if (name && typeof value === 'string') {
            // changed from [name]: value
            this.setState(
                {
                    // set name computed property to the name of the element clicked, 
                    // and set the corresponding state property to the element's value
                    [name]: value,
                }
                // as unknown as Pick<UpdateStateType, keyof UpdateStateType>
            );  // setState
        }
    } // changeHandler

    /************************************
    * stageDBActionis an integrator that passes an id and a callback function corresponding to the desired db action to be performed, and retrieves the new data and updates the state variables, to be displayed to screen. 
    ************************************/
    async stageDBAction(
        id: string,
        email: string,
        name: string,
        value: string,
        url: string,
        image = null,
        cb: Function) {
        console.log("Start performDBAction");
        //EXECUTE CALLBACK FUNCTION AND RETURN RESULSTS
        console.log("hasExpired0:", this.state.hasAccessTokenExpired);
        let dBActionResult: DbActionResultType | undefined = await performDBAction(
            id,
            email,
            this.state.refresh_token,
            this.state.authToken,
            this.state.hasAccessTokenExpired,
            name,
            value,
            null,
            url,
            cb);

        console.log("hasExpired1:", this.state.hasAccessTokenExpired);
        /************************************
         * Set placeholder text if data was updated
         ****************************************/
        if (dBActionResult?.message === "Action Completed") {
            if (name) {
                this.setState({ placeholderName: name });
            }
            if (value) {
                this.setState({ placeholderValue: value });
            }
        }
        console.log("Passed performDBAction");

        const {
            message,
            refresh_token,
            isUserAuthorized,
            hasAccessTokenExpired
        }: DbActionResultType = dBActionResult!;

        console.log("hasAccessTokenExpired2:", hasAccessTokenExpired);

        /***************************************************
         * Set State with the results of calling the DB Action
         *****************************************************/
        this.setState({
            message: message,
            refresh_token,
            isUserAuthorized,
            hasAccessTokenExpired,
        });
    }

    async updateClickHandler(event: ChangeEvent) {
        try {
            event.preventDefault();
            let name = this.state.productName;
            let value = this.state.productValue;
            // let email = this.state.email;

            /************************************************************************
             * Reset state variables representing view input after submit
             ************************************************************************/
            // this.setState({ productName: '' });
            // this.setState({ productValue: '' });
            // this.setState({ placeholderName: '' });
            // this.setState({ placeholderValue: '' });

            /************************************
             * STEP1: Get Data out of local Storage
             ************************************/
            let { access_token, refresh_token, expiration, email, message } = await auth.getLocalStorage();

            /*************************************/

            /******************************************
             * STEP2: SET STATE VARIABLES With data returned from localStorage
             *******************************/
            await this.setStateVariables(access_token, refresh_token, expiration, email, message);


            console.log("HasAccessTokenExpired", this.state.hasAccessTokenExpired);
            /******************************************
             * STEP3: Determine if Token Refresh is needed
             *******************************/
            if (this.state.hasAccessTokenExpired) {
                console.log("ProductUpdateContainer refresh-token: ", this.state.refresh_token);

                /***************************************
                 * STEP3: Use RefreshTokens To Obtain new credentials, if Access Token has expired
                 * **************************************/
                try {
                    /*********************************
                     * STEP4: Call credendentialStore to Refresh All credentials and set local storage with results, if Refresh Token is valid. Else set revoke credentials."
                     *********************************/
                    let newUserCredentials = await credentialStore.setLocalCredWNewTokens(this.state.refresh_token, this.refreshURL, this.state.authToken, this.state.email, this.state.hasAccessTokenExpired);
                    /**************************/
                    if (newUserCredentials) {
                        console.log("NEW ACCESS TOKENS HAVE BEEN RECEIVED From Refresh; newUserCredentials:", newUserCredentials);

                        /*********************************************
                         * STEP5: Evaluate localStorage credentials and set state variables with results 
                         ********************************************/
                        // Get state credentials
                        const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());

                        // Set state credentials
                        this.setState(evaluatedCredentials);

                        console.log("New AUTHTOKEN after Refresh:", this.state.authToken);
                        /********************************************/
                    }
                    // AccessToken and RefreshToken expired
                    else {
                        this.props.setRole("visitor", true);
                        auth.resetLocalStorage();
                    }
                }
                catch (err) {
                    // Clear all localStorage, due to invalid Refresh token
                    console.log("ERRORED OUT IN UPDATE CATCH");
                    if (err.response.status === 401) {
                        console.log('401 Unauthorized user');
                        /***********************************************
                         * Reset Local Storage Variables
                         ************************************************/
                        await auth.resetLocalStorage();

                        /*********************************************
                         * SET STATE VARIABLES FROM Local Storage
                         *********************************************/
                        await this.resetStateVariables();
                        console.log('err', err.response);
                        console.log('error status code', err.response.status);
                        this.setState({ isUserAuthorized: false });
                        console.log("isUserAuthorised = ", this.state.isUserAuthorized);
                        // this.setState({ message: err.response.data.message });
                        this.setState({ message: "401 Unauthorized user" });

                    } // if
                } // catch
            }
            console.log("AUTHORIZED?:", this.state.isUserAuthorized);
            if (this.state.isUserAuthorized) {
                // Refresh_Token should be temporarily set to 'norefresh' in productionAction, as tokens should NOT be refreshed
                // this.setState({ refresh_token: 'norefresh' });

                console.log('ProductUpdateContainer:refresh_token = ', this.state.refresh_token);

                /***********************************************
                 * Step6: PERFORM A DB ACTION IF TOKENS R VALID 
                 **********************************************/
                //id, name, value, url, file = null, imageSrc = null, cb

                await this.stageDBAction(
                    this.state.productId,
                    email,
                    name,
                    value,
                    this.baseURL,
                    null,
                    updateProduct);
            } // if
        } // try
        catch (err) {
            console.log("User is logged out");
            this.setState({ message: "User is logged out" });
        }
    }

    render() {
        const role = this.props.role;
        // const updatePath = "update/";
        let loggedOut = this.props.loggedOut;
        console.log("User loggedOut:", loggedOut, " role:", role);
        return (
            <>
                {!loggedOut ? <Can
                    role={role}
                    perform="products:update"
                    yes={
                        () => (<>
                            <UpdateForm
                                changeHandler={this.changeHandler}
                                updateClickHandler={this.updateClickHandler}
                                productName={this.state.productName}
                                productValue={this.state.productValue}
                                placeholderName={this.state.placeholderName}
                                placeholderValue={this.state.placeholderValue}
                                message={this.state.message}
                            />
                        </>
                        )
                    }
                    no={() => <></>}
                /> : ''}
            </>
        )
    }
} // class

export default ProductUpdateContainer;