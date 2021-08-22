import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import Text from "components/inputs/text";

// Import Server-Side Utilities:
import { api as API } from '../../utils/API';

import { useState, FormEvent } from "react";

// Import module to get/set variables from/in the LocalStorage
import * as authenticationStore from '../../utils/authentication-store';

import { useHistory } from "react-router";

const LoginForm = ({ getRole }: { getRole: () => string }) => {
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
    let history = useHistory();

    const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let data = {
            email: state.email,
            password: state.password
        };
        try {
            // Post credentials, to get new token
            const res = await API.login(data);
            console.log(`RES: ${JSON.stringify(res)}`);
            if (res?.status === 200) {
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
                let test = await authenticationStore.setLocalStorage(
                    access_token,
                    refresh_token,
                    expiration,
                    email,
                    message);

                console.log(`test: ${JSON.stringify(test)}`)

                /***********************************
                 * Get user role and set on App Router
                 ***********************************/
                await getRole();

                // Optional: Since we are pushing to next page.  Clear email and password field
                setState((prevState) => ({
                    ...prevState,
                    email: '',
                    password: ''
                }) as unknown as Pick<LoginStateType, keyof LoginStateType>);
                // Transition to the products route in App.js 
                history.push('/products');
            }//if
        }//try
        catch (err) {
            console.log("LOGIN ERROR", err);
            // Update error message on state object
            setState((prevState) => ({
                ...prevState,
                message: err.message
            }) as unknown as Pick<LoginStateType, keyof LoginStateType>);
        }
    };//submitHandler

    return (
        <>
            <main
                role="main"
                className="form-align flex-shrink-0"
            >
                <MDBContainer>
                    <MDBRow>
                        <MDBCol
                            size="12"
                            middle={true}
                        >
                            <form onSubmit={(e: FormEvent<HTMLFormElement>) => submitHandler(e)} data-testid="login-form">
                                <h1 className="mt-5">
                                    Login Form
                                </h1>
                                <br />
                                {/* email */}
                                <div className="from-group">
                                    <Text
                                        htmlFor={"formGroupEmail"}
                                        className={"form-control"}
                                        id={"formGroupEmail"}
                                        testId={"login-email"}
                                        // placeholder={"email"}
                                        label="Email"
                                        name={"email"}
                                        value={state.email}
                                        changeHandler={(e) => {
                                            setState((prevState) => ({
                                                ...prevState,
                                                email: e.target.value
                                            }))
                                        }}
                                    />
                                    {/* password */}
                                    <Text
                                        htmlFor={"formGroupPassword"}
                                        className={"form-control"}
                                        id={"formGroupPassword"}
                                        testId={"login-password"}
                                        // placeholder="password"
                                        name={"password"}
                                        label={"Password"}
                                        value={state.password}
                                        changeHandler={(e) => {
                                            setState((prevState) => ({
                                                ...prevState,
                                                password: e.target.value
                                            }))
                                        }}
                                    />

                                    {/* button */}
                                    <br />
                                    <MDBRow>
                                        <MDBCol>
                                            <label htmlFor="formGroupPassword" />
                                            <MDBBtn
                                                type="submit"
                                                className={"mx-0"}
                                                color="blue-grey"
                                            >
                                                Submit
                                            </MDBBtn>
                                            <h3
                                                className={"mt-5"}
                                            >
                                                {state.message ? state.message : ''}
                                            </h3>
                                            <h3
                                                className="mt-5"
                                            >
                                                {state.token ? state.token : ''}
                                            </h3>
                                        </MDBCol>
                                    </MDBRow>
                                </div>
                            </form>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
            </main>
        </>
    );
};

export default LoginForm;