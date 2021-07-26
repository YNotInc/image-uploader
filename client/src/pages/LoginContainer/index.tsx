import React, { ChangeEvent, useState, useEffect} from "react";

import { useHistory } from "react-router";

import { urlBtnUpdates } from "utils/url-btn-updates";

// Import module to get/set variables from/in the LocalStorage
import * as authenticationStore from '../../utils/authentication-store';

// Import Server-Side Utilities:
import { api as API } from '../../utils/API';

// Import Components
import LoginForm from "../../forms/login";


/**
 * Props login container - Update user authorization and authentication when login credentials are provided.
 * @param props.getRole, props.history 
 * @returns  
 */
let LoginContainer = ({getRole}: {getRole: Function }) => {
    let history = useHistory();
    const initState: LoginStateType = {
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

    const [state, setState] = useState(initState);
    // EventHandlers: two way bind email and password state variable.
    const changeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        // First disable default behavior
        event.preventDefault();

        const {
            name,
            value
        } = event.target;
        console.log("--NAME:", name);
        // set name computed property to the name "email", "password" of the input element, where the value was entered in login form,and set the corresponding state property to the element's value{
        if (Object.keys(state).includes(name)) {
            setState((prevState) => ({
                ...prevState,
                [name]: value
            } as unknown as Pick<LoginStateType, keyof LoginStateType>));
        }
    } // changeHandler

    const [onSubmit, setOnSubmit] = useState(false);
    
    // Fetches updated user credential when a valid email and password is submitted
    useEffect(() => {
         // Update navbar highlighting for address bar changes on first render or re-render.  Normmaly placed in componentDidMount
         urlBtnUpdates();

        // Package email and password data to be sent in the Post Request Body
        let data = {
            email: state.email,
            password: state.password
        };
        if(onSubmit) {
            API.login(data)
            .then(async (res: any) => {
                if (res) {
                    // Step 1 of 2: Set state variables from response
                    let { message, access_token, refresh_token, expiration, email } = res.data;

                    // Update login credentials on state object
                    setState((prevState) => ({
                        ...prevState,
                        access_token,
                        expiration,
                        refresh_token,
                        message,
                        email
                    }) as unknown as Pick<LoginStateType, keyof LoginStateType>);

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
                    await getRole();

                    // Transition to the products route in App.js 
                    history.push('/products');
                }//if
                //reset onSubmit
                setOnSubmit(false);
            })
            .catch(async err => {
                console.log("LOGIN ERROR", err);
                // Update error message on state object
                setState((prevState) => ({
                    ...prevState,
                    message: err.message
                }) as unknown as Pick<LoginStateType, keyof LoginStateType>);
            });
        }
        
    // Run fetch when the email and pw is submitted
    }, [history, getRole, state.email, state.password, onSubmit]);

    return (
        <>
            <LoginForm
                changeHandler={changeHandler}
                clickHandler={()=>setOnSubmit(true)}
                email={state.email}
                password={state.password}
                message={state.message}
                token={state.token} />
        </>
    )
} // function

export default LoginContainer;