import { MDBContainer, MDBRow, MDBCol, MDBBtn } from "mdbreact";
import Text from "components/inputs/text";

let ProductUpdateForm = (props: UpdateFormPropType) => {
    const response = props.message;
    const message = (response === 'Request failed with status code 401') ? 'Please login' : response;
    return (
        <main role="main" className="form-align flex-shrink-0">
            <MDBContainer>
                <MDBRow>
                    <MDBCol size="12" middle={true}>
                        <form>
                            <h1 className="mt-5">Product Update Form</h1>
                            <br />
                            {/* name */}
                            <div className="form-group">
                                {/* name */}
                                <Text
                                    htmlFor={"formGroupEmail"}
                                    className={"form-control product-name"}
                                    id={"formGroupName"}
                                    testId={"update-name"}
                                    placeholder={props.placeholderName}
                                    label={"Name"}
                                    name={"productName"}
                                    value={props.productName}
                                    changeHandler={props.changeHandler}
                                />
                                {/* price */}
                                <Text
                                    htmlFor={"formGroupName"}
                                    className={"form-control"}
                                    id={"formGroupValue"}
                                    testId={"update-value"}
                                    placeholder={props.placeholderValue}
                                    name={"productValue"}
                                    label={"Price"}
                                    value={props.productValue}
                                    changeHandler={props.changeHandler}
                                />
                                {/* button */}
                                <br />
                                <MDBRow>
                                    <MDBCol>
                                        <label htmlFor="formGroupName" />
                                        <MDBBtn
                                            className={"mx-0"} color="blue-grey"
                                            onClick={props.updateClickHandler}
                                        >
                                            Submit
                                        </MDBBtn>
                                        <h3 className={"mt-5"}>{message}</h3>
                                    </MDBCol>
                                </MDBRow>
                            </div>
                        </form>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </main >
    )
};

export default ProductUpdateForm;