import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import Text from "components/inputs/text";

let LoginForm = (props: LoginFormPropType) => {
    return (
        <main role="main" className="form-align flex-shrink-0">
            <MDBContainer>
                <MDBRow>
                    <MDBCol size="12" middle={true}>
                        <form onSubmit={props.clickHandler}>
                            {/* <div className="container"> */}
                            <h1 className="mt-5">Login Form</h1>
                            <br />
                            {/* email */}
                            <div className="form-group">
                                {/* email */}
                                <Text
                                    htmlFor={"formGroupEmail"}
                                    className={"form-control"}
                                    id={"formGroupEmail"}
                                    testId={"login-email"}
                                    // placeholder={"email"}
                                    label="Email"
                                    name={"email"}
                                    value={props.email}
                                    changeHandler={props.changeHandler}
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
                                    value={props.password}
                                    changeHandler={props.changeHandler}
                                />
                                {/* button */}
                                <br />
                                <MDBRow>
                                    <MDBCol>
                                        <label htmlFor="formGroupPassword" />
                                        <MDBBtn
                                            type="submit"
                                            className={"mx-0"} color="blue-grey"
                                        >
                                            Submit
                                        </MDBBtn>
                                        <h3 className={"mt-5"}>{props.message ? props.message : ''}</h3>
                                        <h3 className="mt-5">{props.token ? props.token : ''}</h3>
                                    </MDBCol>
                                </MDBRow>
                            </div>
                            {/* </div> */}
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </main >
    )
};

export default LoginForm;