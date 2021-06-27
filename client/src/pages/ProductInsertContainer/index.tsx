import React, { Component, FormEvent } from "react";
// Import module to get/set variables from/in the LocalStorage
import * as auth from '../../utils/authentication-store';
import Can from "components/can";
import { displayInputErrors, removeImgErrorDisplay, removeInputErrors } from "utils/input-validation";

// Import Components
import ProductInsertForm from "../../forms/product/insert";
import { credentials as credentialStore } from '../../utils/credential-store';
import { insertProduct, stageDBAction } from '../../utils/product-store';
import * as imgHelper from './utils/helpers';
import { insertCloudinary } from '../../utils/product-store';
import { ChangeEvent } from "react";
import { Moment } from "moment";
import './styles.css';

class ProductInsertContainer extends Component<ProductInsertContainerPropType, ProductInserContainerStateType>  {
    cloudinaryURL = '/api/products/cloudinary/insert/';
    refreshURL = '/api/user/login/refresh';
    baseURL = '/api/products/product/insert/';
    constructor(props: ProductInsertContainerPropType) {
        super(props);
        this.state = {
            productId: '',
            productName: '',
            productValue: '',
            productImage: '',
            placeholderName: '',
            placeholderValue: '',
            productsList: [],
            authToken: '',
            refresh_token: '',
            email: '',
            hasAccessTokenExpired: false,
            isUserAuthorized: true,
            message: '',
            // Image imputs for Image Uploader component
            image: {
                base64Str: '',
                cloudImageUrl: '',
                cloudImagePublicId: '',
                input: '',
                file: '',
                submitBtnId: "image-input",
                fileTypes: [
                    'image/jpeg',
                    'image/jpg',
                    'image/png'
                ],
                imageName: '',
                imageWidth: 0,
                imageHeight: 0,
                imageSize: 0,
                imageSrc: '',
                imageMin: 200,
                imageMax: 450,
                maxMB: 2,
                errorTag: 'file-msg',
                invalidMsg: 'Not a valid file.',
                unacceptedMsg: 'File not accepted.',
                acceptedMsg: 'File accepted.',
                fileMsgElement: '',
                previewCanvasElement: '',
                submitImageElement: '',
                className: "customFileInput",
                type: "file"
            }

        };

        this.changeHandler = this.changeHandler.bind(this);
        this.insertClickHandler = this.insertClickHandler.bind(this);
        // @ts-ignore
        this.insertProduct = insertProduct.bind(this);
        this.productImageClickHandler = this.productImageClickHandler.bind(this);
        this.submitImageHandler = this.submitImageHandler.bind(this);
        this.selectImage = this.selectImage.bind(this);
        this.setImageProp = this.setImageProp.bind(this);
        this.message = this.message.bind(this);
    } // constructor

    setElementRef() {
        this.setImageProp("fileMsgElement", document.getElementById(this.state.image.errorTag));

        console.log("ImageUploaderStateMounted", this.state.image.imageMin);
    }

    //  Select an image
    /************/
    async selectImage(event: FormEvent<HTMLInputElement>, imageSelectRef: ImageUploadRefObject<HTMLInputElement>, previewCanvasRef: ImageUploadRefObject<HTMLDivElement>) {
        // event.preventDefault();
        event.persist();
        console.log("EVENT:", event);
        console.log("IMGREF:", imageSelectRef, "; PVCanvasRef:", previewCanvasRef);
        console.log("SELECTIMAGE imageSelectRef:", imageSelectRef?.current, "previewCanvasRef:", previewCanvasRef?.current, "imageSelectRef1:", typeof imageSelectRef);

        // Get Reference to the canvas
        let previewCanvasElement = previewCanvasRef?.current;
        let inputElement = imageSelectRef?.current;

        this.setImageProp("previewCanvasElement", previewCanvasElement);
        this.setImageProp("input", inputElement);

        // Create copy of image props
        let image = this.state.image;
        console.log("In Contanier: imagebtn:", image.submitBtnId, "file:", image.input, "file2", image.file);

        // 12/12: Handle image name display;
        /*******************************************/
        await this.productImageClickHandler(event);
        /*******************************************/

        // copy image.input  to state.image
        this.setState({ image: image });

        // this.setImageProp("input", image.file);
        console.log("FILE INPUT: ", this.state.image.input);

        this.setImageProp("file", this.state.image.file);

        let img;

        if (imgHelper.isFileSelected(image.input) && imgHelper.isFileTypeValid(image.file, image.fileTypes)) {
            var blob = image.input.files[0];

            // save image back to prop
            img = new Image();
            try {
                const loadedImgResult: ImagePropsType = await imgHelper.loadImage(img, blob);
                console.log("loadedImgResult", loadedImgResult);

                // Set variables
                img.src = loadedImgResult.imageSrc.toString();
                this.setImageProp("imageSrc", loadedImgResult.imageSrc);
                this.setImageProp("imageWidth", loadedImgResult.imageWidth);
                this.setImageProp("imageHeight", loadedImgResult.imageHeight);
                this.setImageProp("imageSize", loadedImgResult.imageSize);
                this.setImageProp("imageName", loadedImgResult.imageName);

                console.log("DISPLAYIMAGE PREVIEW CANVAS:", image.previewCanvasElement, "*", "state:", this.state.image.previewCanvasElement);

                // remove OL tag
                imgHelper.removeItem('ol', image.previewCanvasElement);
                var areDimensionsValid = imgHelper.checkImageDimensions(image.imageWidth, image.imageMin, image.imageHeight, image.imageMax);
                console.log("AREDIMENSIONSVALID:", areDimensionsValid);

                this.setImageProp("imageSize", imgHelper.setFileSize(areDimensionsValid, image.errorTag, image.acceptedMsg, image.unacceptedMsg, image.imageName, image.imageSize, image.input.files, image.previewCanvasElement, image.imageWidth, image.imageHeight));

                // Create Canvas and load image
                imgHelper.displayImage(img, areDimensionsValid, image.previewCanvasElement);

                //12/12/09: set new image prop values
                this.setState({ image });

                // Remove error class from image-input, if file selected
                removeImgErrorDisplay('image-input', 'image-input-error');
            }
            catch (err) {
                console.log("failure ", err);
                imgHelper.imgOnError(image.previewCanvasElement, image.imageWidth, image.imageMax, image.imageHeight, image.errorTag, image.invalidMsg);
            }
            // console.log("IMAGE NAME", this.imageName);
        }// if
        else {
            imgHelper.removeCanvas(image.previewCanvasElement);
            imgHelper.setFileMessage(image.errorTag, image.unacceptedMsg);
        }
    }
    /************/
    setImageProp(key: string, value: HTMLElement | null | string | number) {
        // Make a copy of props
        var image = this.state.image;
        console.log("setImageProp", image, "Key", key, "Value", value);
        // update props
        image[key] = value;

        // PROBLEM
        /*******************/
        console.log("image: ", image);
        /*******************/
        // Update state with new value
        this.setState({ image: image });

        console.log("Key:", [key]);
        console.log("Value:", value);
        console.log(`Image ${key}:`, this.state.image[key]);
    }
    async submitImageHandler(event: FormEvent<HTMLFormElement>, img: any) {
        // Don't refresh the page!
        // event.preventDefault();
        event.persist();
        console.log("IN SUBMITIMAGEHANDLER");

        //local copy of image
        let image;
        let {
            input,
            imageWidth,
            imageHeight,
            imageMin,
            imageMax,
            imageName,
            imageSize,
            maxMB,
            errorTag,
            acceptedMsg,
            unacceptedMsg,
            fileMsgElement,
            previewCanvasElement,
            imageSrc } = img;


        // set img props
        this.setState({
            image: img
        });
        // if file selected
        if (imgHelper.isFileSelected(input)) {
            console.log("ActionHelper file selected");

            // checks image dimension and file size
            let isInputValid = false

            // Check Image Dimensions
            if (imageWidth >= imageMin && imageWidth <= imageMax && imageHeight >= imageMin && imageHeight <= imageMax) {
                isInputValid = true
            } else {
                isInputValid = false
            }

            // Check Image Size
            console.log("FileName:", imageName);
            console.log("FileSize:", imageSize);

            // Get Unit of Measure
            var unit = imageSize.slice(-2).toLowerCase();

            // Get FileSize
            var fileSizeNumber = imageSize.replace(/[^\d.-]/g, '');

            console.log("FILESIZE = " + fileSizeNumber + ", Unit = " + unit);
            console.log("Max File Size:", maxMB);

            if (unit === 'mb') {
                console.log("max file size:", maxMB, ", actual file size:", fileSizeNumber);
                if (fileSizeNumber <= maxMB) {
                    isInputValid = true
                } else {
                    isInputValid = false
                }
            }
            else if (unit === 'kb') {
                if (fileSizeNumber <= maxMB * 1000) {
                    isInputValid = true
                } else {
                    isInputValid = false
                }
            }

            // If input is not valid do not accept image and do nothing
            console.log("Is Input File Valid:", isInputValid);
            if (!isInputValid) {
                console.log("image not acceptable");
                if (fileMsgElement) {
                    imgHelper.setFileMessage(errorTag, unacceptedMsg);
                } else {
                    imgHelper.setFileMessage(errorTag, acceptedMsg);
                }
            } else {
                console.log("Image is acceptable");
                var imageUrl = imageSrc;

                console.log("Call convertImageFromURLTOBase");
                /******************************************************    Converts image to base64String
                ****************************************************/
                let base64StringImage: string = await imgHelper.convertImageFromUrlToBase64String(imageUrl);
                console.log(`***Base64StringImage: ${typeof base64StringImage}`);
                /**************************
                 * Code Burst onChange Event
                 * upload to Cloudinary
                 **************************/
                console.log("Calling productStore.insertCloudinary");

                const currentCredentials = await auth.getLocalStorage();

                console.log("CurrentCredentials:", currentCredentials);

                const authToken = 'Bearer ' + currentCredentials.access_token;

                console.log("ProdInsertCont-AuthToken:", authToken);
                const refreshToken = currentCredentials.refresh_token;

                console.log("ProdInsertCont-RefreshToken:", refreshToken);

                let cloudinaryResult = await insertCloudinary(this.cloudinaryURL, base64StringImage, authToken, refreshToken);
                console.log("CloudinaryResult:", cloudinaryResult);
                // If cloudinary insert successfull
                if (cloudinaryResult) {
                    // this.setState({cloudImageUrl: cloudinaryResult.url});
                    /**************************/
                    console.log("Converted Image: ", base64StringImage);
                    // copy image state to local variable
                    image = this.state.image;
                    //update cloudImageUrl
                    console.log("CLOUD URL:", cloudinaryResult?.data.url);
                    image.cloudImageUrl = cloudinaryResult?.data.url;
                    console.log("CLOUD IMAGEURL:", image.cloudImageUrl);
                    image.cloudImagePublicId = cloudinaryResult?.data.public_id;

                    /****************************/
                    // Save image.cloudImagePublicId to db, where productImage == image.cloudImageURL
                    /****************************/
                    console.log("public_id", image.cloudImagePublicId);
                    /*************************** */
                    // update base64Str
                    image.base64Str = base64StringImage;
                    // update image state variable
                    console.log("Image:", image);
                    this.setState({ image: image });
                    console.log("State image: ", this.state.image, "cloud image url", this.state.image.cloudImageUrl);
                }// if cloudinary
            }// else
            // remove canvas after submit
            imgHelper.removeCanvas(previewCanvasElement);
            // var image = this.state.image;

            /*****************************/
            // Reset image Name
            /*******************************/

            await this.productImageClickHandler(event);
        } // if file selected

        console.log("SubmitImageHandler: file NOT selected");
    }// submit-Image on click

    /***************************************************/
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

    componentDidMount({ location } = this.props) {
        this.setElementRef();
        if (location.state) {
            /******************************
             * Pass product info from click button
             * *******************************/
            const { name, value } = location.state;
            var image = this.state.image;
            image.imageName = "Choose File";
            this.setState({
                placeholderName: name,
                placeholderValue: `$ ${value}`,
                image: image
            });
        }
    }

    changeHandler(event: ChangeEvent<HTMLInputElement>) {
        // First disable default behavior
        event.preventDefault();
        const {
            name,
            value
        } = event.target;

        if (name && typeof value === 'string') {
            this.setState(
                {
                    // set name computed property to the name of the element clicked, 
                    // and set the corresponding state property to the element's value
                    [name]: value,
                }
            );
            if (event.target.style.borderColor === "red") {
                removeInputErrors(event.target);
            }
        }

    } // changeHandler

    async insertClickHandler(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        console.log("PRODUCTINSERTCONTAINER: insertCLICKHANDLER CLICKED");
        try {

            let name = this.state.productName;
            let value = this.state.productValue;
            let image = this.state.image.input;

            /************************************************************************
             * Reset state variables representing view input after submit
             * **********************************************************************/
            // this.setState({ productName: '' });
            // this.setState({ productValue: '' });
            // this.setState({ placeholderName: '' });
            // this.setState({ placeholderValue: '' });

            /************************************
             * STEP1 of 8: Get Data out of local Storage
             ************************************/
            let { access_token, refresh_token, expiration, email } = await auth.getLocalStorage();
            /*************************************/

            /******************************************
             * STEP2 of 8: SET STATE VARIABLES With data returned from localStorage
             *******************************/
            await this.setStateVariables(access_token, refresh_token, expiration, email, this.state.message);

            console.log("hasAccessTokenExpired", this.state.hasAccessTokenExpired);
            /******************************************
             * STEP3 of 8: Determine if Token Refresh is needed
             *******************************/
            if (this.state.hasAccessTokenExpired) {
                console.log("ProductInsertContainer refresh-token: ", this.state.refresh_token);

                /**********************************
                 * STEP4 of 8: RefreshTokens: If 
                 * tokens have expired
                 * *********************************/
                try {
                    /***************************
                     * STEP5 of 8: Call 
                     * credendentialStore to get 
                     * new AccessTokens from the 
                     * API, AND SET LOCAL STORAGE 
                     * WITH RESULTS, if 
                     * refreshTokens valid
                     ****************************/
                    let newUserCredentials = await credentialStore.setLocalCredWNewTokens(this.state.refresh_token, this.refreshURL, this.state.authToken, this.state.email, this.state.hasAccessTokenExpired);
                    /**************************/
                    console.log("newUserCredentials STATUS", newUserCredentials);
                    if (newUserCredentials) {
                        console.log("NEW ACCESS TOKENS HAVE BEEN RECEIVED newUserCredentials:", newUserCredentials);

                        /*************************
                         * STEP6 of 8: Evaluate 
                         * localStorage 
                         * credentials and set 
                         * state variables with 
                         * results
                         ************************/
                        // Get state credentials
                        const evaluatedCredentials = credentialStore.getEvaluatedCredentials(await auth.getLocalStorage());

                        // Set state credentials
                        this.setState(evaluatedCredentials);

                        console.log("New AUTHTOKEN after Refresh:", this.state.authToken);
                        /*********************/
                    }
                    // AccessToken and RefreshToken expired
                    else {
                        console.log("I NEVER MADE IT TO IF");
                        // this.props.setRole("visitor", true);
                        // auth.resetLocalStorage();
                    }
                }
                catch (err) {
                    // Clear all localStorage, due to invalid Refresh token
                    console.log("ERRORED OUT IN Insert CATCH");
                    if (err.response.status === 401) {
                        console.log('401 status received in ProductInsert');
                        /**********************
                         * Reset Local Storage 
                         * Variables
                         ***********************/
                        await auth.resetLocalStorage();

                        /******************
                         * SET STATE VARIABLES 
                         * FROM Local Storage
                         ********************/
                        await this.resetStateVariables();
                        console.log('err', err.response);
                        console.log('error status code', err.response.status);
                        this.setState({ isUserAuthorized: false });
                        console.log("isUserAuthorised = ", this.state.isUserAuthorized);
                        this.setState({ message: err.response.data.message });
                    } // if
                } // catch
            }
            console.log("AUTHORIZED?:", this.state.isUserAuthorized);
            if (this.state.isUserAuthorized) {

                // 5/17/2020:
                console.log('ProductInsertContainer:refresh_token = ', this.state.refresh_token);

                /**************************************
                * Step 7 of 8: ConvertImage to base64:
                * *************************************/
                // 12/22/2019: CONVERT IMAGE TO BASEURL
                /**************************************/
                await this.submitImageHandler(event, this.state.image);
                // console.log("base64 still here:", this.state.image.base64Str);
                console.log("In stage");

                // Check if a product name, value, and image has been selected, before input submission:
                if (!name || !value || !image) {
                    displayInputErrors("insertFormGroupProductName", "insertFormGroupProductValue",
                    "image-input");
                } else {
                    /***********************************************
                                     * Step8 of 8: PERFORM A DB ACTION IF TOKENS R VALID 
                                     **********************************************/
                    const dbActionResults = await stageDBAction(
                        this.state.productId,
                        this.state.email,
                        name,
                        value,
                        this.state.image,
                        this.baseURL,
                        this.state.refresh_token,
                        this.state.authToken,
                        this.state.hasAccessTokenExpired,
                        insertProduct);
                    console.log("Out stage");
                    console.log("ProductInsertContainer:", dbActionResults);
                    /***************************************************
                     * Set State with the results of calling the DB Action
                     ***************************************************/
                    this.setState(dbActionResults);
                }
            } // if

        } // try
        catch (err) {
            console.log(err);
            const displayMessage = err.message === 'Request failed with status code 401' ? 'Please Login' : '';
            this.setState({
                message: displayMessage
            });
        }
    }

    // Handles changing input text when an image is clicked
    productImageClickHandler(event: FormEvent) {
        // event.preventDefault();
        event.persist();
        let element = document.getElementById(this.state.image.submitBtnId) as HTMLInputElement;

        // 12/12
        let imageSelectorLabel = document.querySelector("#img-select-label")
        let labelElement;
        let labelValue;
        let imgInputInfo;
        console.log("QUERY SELECTOR", imageSelectorLabel?.innerHTML);

        console.log("Image Selector Element", element);
        if (element.labels && element.files) {
            console.log("ELEMENT:", element?.files);
            labelElement = element?.labels[0];
            labelValue = labelElement?.textContent;
            imgInputInfo = element?.files[0];
        }

        let image;

        // Upload Image has NO target, so set the labelValue to choose file
        if (!event.target) {
            // copy and update image
            image = this.state.image;
            // update imageName for no event
            image.imageName = "No File Chosen";
            console.log("ELSE: IMAGENAME:", image.imageName);
            this.setState({
                image: image
            });
            labelValue = this.state.image.imageName;
            console.log("LabelElement:", labelElement);
            console.log("LabelValue:", labelValue);
            // console.log("ProductImageClickHandler: FILENAME:", fileName);
        }
        // If File selected, Set File and FileName
        if (imgInputInfo && element.files) {
            console.log("IMG Select EVENT INFO", event.target);
            const fileName = element?.files[0].name.toString();

            let labelValue = labelElement?.textContent;
            console.log("PRODUCTIMAGECLICKHANDLER:", element?.baseURI);
            console.log("LabelValue:", labelValue);
            console.log("FILENAME:", fileName);

            // copy and update image
            image = this.state.image;
            image.imageName = fileName;
            console.log("IF: IMAGENAME:", image.imageName);

            // 12/07/2019
            image.file = imgInputInfo;
            console.log("ProductImageClickHandler file:", this.state.image.file);
            this.setState({
                image: image
            });
            console.log("ProductImageClickHandler Image Path:", imgInputInfo);
            console.log("ProductImageName:", this.state.image.imageName);
            labelValue = this.state.image.imageName;
            console.log("labelElement:", labelElement);
            console.log("labelValue:", labelValue);
        }
        // If no file chosen go here
        else {
            image = this.state.image;
            image.imageName = "No File Chosen";
            console.log("ELSE: IMAGENAME:", image.imageName);
            this.setImageProp(
                image, image
            );
            labelValue = this.state.imageName;
        }
    }

    message = () => {
        console.log("Message method called");
    }
    render() {
        const role = this.props.role;
        let loggedOut = this.props.loggedOut;
        console.log("User loggedOut:", loggedOut, " role:", role);
        if (this.state.image) {
            return (
                <>
                    {!loggedOut ? <Can
                        role={role}
                        perform="products:update"
                        yes={
                            () => (<>
                                <ProductInsertForm
                                    changeHandler={this.changeHandler}
                                    insertClickHandler={this.insertClickHandler}
                                    productImageName={this.state.image.imageName}
                                    productName={this.state.productName}
                                    productValue={this.state.productValue}
                                    productImage={this.state.productImage}
                                    placeholderName={this.state.placeholderName}
                                    placeholderValue={this.state.placeholderValue}
                                    message={this.state.message}
                                    image={this.state.image}
                                    submitImageHandler={this.submitImageHandler}
                                    selectImage={this.selectImage}
                                    setImageProp={this.setImageProp}
                                />
                            </>
                            )
                        }
                        no={() => <></>}
                    /> : ''}
                </>
            )
        }
    }
} // class

export default ProductInsertContainer;