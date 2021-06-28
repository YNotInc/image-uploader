import { FC } from 'react';
import { MDBBtn, MDBContainer, MDBRow, MDBCol } from "mdbreact";
import { ImageUploader } from '../../../components/image-uploader';
import "./styles.css";
import Text from 'components/inputs/text';

//FC = FunctionComponent
let ProductInsertForm: FC<ProductInsertFormPropType> = (props: ProductInsertFormPropType) => {
    console.log("PRODUCTINSERTINPUTS", props.image);
    console.log("PRODUCTINSERT FileTypes", props.image.fileTypes);
    return (
        <main className="form-align">
            <MDBContainer>
                <MDBRow>
                    <MDBCol size="12" middle={true}>
                        <form onSubmit={props.insertClickHandler}>
                            <h1 className="mt-5">Product Insert Form</h1>
                            <br />
                            <div className="product-name-value-form-group">
                                <Text
                                    htmlFor="insertFormGroupProductName"
                                    className="form-control product-name"
                                    id={"insertFormGroupProductName"}
                                    placeholder={props.placeholderName }
                                    name={"productName"}
                                    label={"Name"}
                                    value={props.productName}
                                    changeHandler={props.changeHandler}
                                />
                                <Text
                                    htmlFor={"insertFormGroupProductValue"}
                                    className={"form-control product-value"}
                                    id={"insertFormGroupProductValue"}
                                    placeholder={props.placeholderValue}
                                    name={"productValue"}
                                    label={"Value"}
                                    value={props.productValue}
                                    changeHandler={props.changeHandler}
                                />
                                <br />
                                <MDBRow className={"image-require-border"}>
                                    {/* REQUIREMENTS */}
                                    <MDBCol size="12">Image Requirements (PNG, JPG):<br />
                                        <MDBCol size="7">
                                            <div className="col-12">
                                                <b>Filesize:</b> &#60; {props.image.maxMB}MB, <b>Dimensions: </b>
                                            Min: {props.image.imageMin}, Max: {props.image.imageMax}
                                            </div>
                                        </MDBCol>
                                    </MDBCol>
                                </MDBRow>
                                <MDBRow role="main" className="upload-image-form-group image-require-border">
                                    <br></br>
                                    <ImageUploader
                                        uploaderBorder={"uploader-border"}
                                        image={props.image}
                                        submitImageHandler={props.submitImageHandler}
                                        productImage={props.productImage}
                                        selectImage={props.selectImage}
                                        setImageProp={props.setImageProp}
                                    />
                                    <MDBCol
                                        className={"image-require-border"}>
                                        {/******SUBMIT BUTTON: PRODUCT/VALUE UPLOAD*********/}
                                        <label htmlFor="formGroupSubmitButton" />
                                        <MDBBtn
                                            id="submit-image"
                                            color="blue-grey"
                                            type="submit"
                                        >
                                            Submit
                                        </MDBBtn>
                                        <h3 className="mt-5">{props.message ? props.message : ''}</h3>
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

export default ProductInsertForm;