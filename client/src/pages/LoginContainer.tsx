import React, { Component, ChangeEvent, FormEvent } from "react";

import { urlBtnUpdates } from "utils/url-btn-updates";

// Import module to get/set variables from/in the LocalStorage
import * as authenticationStore from '../utils/authentication-store';

// Import Server-Side Utilities:
import { api as API } from '../utils/API';

// Import Components
import LoginForm from "../forms/login";

interface PropTypes {
    getRole: () => void,
    history: any
}

class LoginContainer extends Component<LoginPropType, LoginStateType> {
    state!: LoginStateType;
    constructor(props: LoginPropType) {
        super(props);

        this.state = {
            email: '',
            password: '',
            message: '',
            access_token: '',
            refresh_token: '',
            expiration: '',
            hasAccessTokenExpired: false,
            isUserAuthorized: false,
            authToken: '',
            token: ''
        };

        this.changeHandler = this.changeHandler.bind(this);
        this.clickHandler = this.clickHandler.bind(this);
    } // constructor

    async componentDidMount() {
        // Update navbar for address bar changes
        urlBtnUpdates();
    }

    changeHandler(event: ChangeEvent<HTMLInputElement>): void {
        // First disable default behavior
        event.preventDefault();

        const {
            name,
            value
        } = event.target;
        console.log("--NAME:", name);
        // if (name && typeof value === 'string') 
        // [name]: value
        // set name computed property to the name "email", "password" of the input element, where the value was entered in login form,and set the corresponding state property to the element's value{
        if (Object.keys(this.state).includes(name)) {

            this.setState({
                [name]: value
            } as unknown as Pick<LoginStateType, keyof LoginStateType>);  // setState
        }
    } // changeHandler

    /**
     * Clicks handler handles login form submission events
     * @param event 
     */
    async clickHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        console.log(`User Name: ${this.state.email}, Password: ${this.state.password}`);

        // Package Data to be sent in the Post Request Body
        let data = {
            email: this.state.email,
            password: this.state.password
        };
        // Define Call to Server Side utils to post body to the backend server and set states, using login method:
        let login = (data: DataType) => {
            console.log('IN LOGIN CALL');
            API.login(data)
                .then(async (res: any) => {
                    if (res) {
                        // Step 1 of 2: Set state variables from response
                        let { message, access_token, refresh_token, expiration, email } = res.data;
                        this.setState(
                            {
                                access_token,
                                expiration,
                                refresh_token,
                                message,
                                email
                            });
                        console.log("RES:", res);

                        // Step 2 fo 2: Set Local Storage variables from respons
                        await authenticationStore.setLocalStorage(
                            access_token,
                            refresh_token,
                            expiration,
                            email,
                            message);

                        /***********************************
                         Get user role and set on App Router
                         ***********************************/
                        let role = await this.props.getRole();


                        // this.setState({toProducts: true});
                        // push props to the products route in App.js 
                        this.props.history.push('/products');
                    }//if
                })
                .catch(async err => {
                    console.log("LOGIN ERROR", err);
                    this.setState(
                        { message: err.message });
                });
        };

        // Execute login
        login(data);

        // Reset state variables after submit
        this.setState({
            email: '',
            password: '',
        });
    }

    /**
     * Sets state variables from LocalStorage
     * @param access_token 
     * @param refresh_token 
     * @param expiration 
     * @param email 
     * @param message 
     */
    async setStateVariables(access_token: string, refresh_token: string, expiration: string, email: string, message: string) {
        let authToken = "Bearer " + access_token;

        console.log("Auth token", authToken);
        this.setState({ authToken });

        console.log("Refresh token", refresh_token);
        this.setState({ refresh_token });

        this.setState({ email });

        let hasAccessTokenExpired = await authenticationStore.hasAccessTokenExpired();

        console.log("Expired?", hasAccessTokenExpired);
        this.setState({ hasAccessTokenExpired });

        this.setState({ isUserAuthorized: true });

        this.setState({ message });
    }

    render() {
        return (
            <React.Fragment>
                <LoginForm
                    changeHandler={this.changeHandler}
                    clickHandler={this.clickHandler}
                    email={this.state.email}
                    password={this.state.password}
                    message={this.state.message}
                    token={this.state.token} />
            </React.Fragment>
        )
    }
} // class

export default LoginContainer;