import { api as API } from './API';
import ProductViewItem from "../components/products/list/item";
import React from "react";


/**
* getProductDetails - Get product details for individual product from controller
* @param baseUrl 
* @returns  
*/
export let getProductDetails = async (baseUrl: string, authToken: string, refreshToken: string) => {
    let product = await API.getProduct(baseUrl, authToken, refreshToken);
    let productDetails = product && { ...product.data };
    console.log("@ProductDetails", productDetails)
    const productItemComponent = <ProductViewItem
        image={productDetails.productImage}
        key={productDetails._id}
        id={productDetails._id}
        name={productDetails.name}
        value={productDetails.value}
    /> as JSX.Element;
    return productItemComponent;
}

/**
* retrieveUpdatedProductList - retrieves all products from the database
* @returns  
*/
export let retrieveUpdatedProductList = async () => {
    /************************************
     * STEP9: Get the new updated productsList
     ***********************************/
    const baseURL = '/api/products';
    try {
        let res = await API.getProducts(baseURL);

        let data = res?.data.products;
        console.log("productStore:retrieveUpdatedProductList data =", data);
        return data;
    } catch (err) {
        console.log("ERROR", err);
    }
};

/**
 * Delete Product - Deletes an individual product
 * @param url 
 * @param productId 
 * @param email 
 * @param accessToken 
 * @param refresh_token 
 * @param expired 
 * @param [name] 
 * @param [value] 
 * @param [imageSrc] 
 * @returns  
 */
export async function deleteProduct(
    url: string,
    productId: string,
    email: string,
    accessToken: string,
    refresh_token: string,
    expired: boolean,
    name = null,
    value = null,
    imageSrc = null
) {
    console.log('IN DELETE PRODUCT CALL');
    console.log(`DATA URL: ${url}, ATOKENT: ${accessToken}, RTOKEN: ${refresh_token}, EXPIRED: ${expired}, EMAIL: ${email}`);

    let deleteProductResponse = await API.deleteProduct(url, accessToken, refresh_token, expired, email);

    /*NEVER COMES BACK*/
    console.log("deleteProduct: ", deleteProductResponse);

    // Return deleteProductResponse from deleteProduct on the backend
    return deleteProductResponse;
}

// 
/**
 * Update product - Updates image data in SQL db, with info from request body
 * @param url 
 * @param id 
 * @param email 
 * @param authToken 
 * @param refreshToken 
 * @param expired 
 * @param name 
 * @param value 
 * @param [image] 
 * @returns  
 */
 export let updateProduct = async (
    url: string,
    id: string,
    email: string,
    authToken: string,
    refreshToken: string,
    expired: boolean,
    name: string,
    value: string,
    image = null) => {
    console.log('ProductStore:IN UPDATE PRODUCT CALL', "expired", expired);
    let updateResponse = await API.updateProduct(url, authToken, refreshToken, name, value, image, expired, email);

    // Return results to the calling program
    return updateResponse;
};

/**
* insertCloudinary - Insert image into cloudinary storage server
* @param baseURL 
* @param imageObj 
* @returns  
*/
export let insertCloudinary = async (baseURL: string, imageObj: string, authToken: string, refreshToken: string) => {
    const cloudinaryResponse = await API.insertCloudinary(baseURL, imageObj, authToken, refreshToken);

    return cloudinaryResponse;
};

// Define Call to Server Side utils to post body to the backend server:
/**
 * Inserts product - Inserts image details from request body into sql db
 * @param url 
 * @param id 
 * @param email 
 * @param [authToken] 
 * @param [refreshToken] 
 * @param [expired] 
 * @param name 
 * @param value 
 * @param image 
 * @returns  
 */
export async function insertProduct(
    url: string,
    id: string,
    email: string,
    authToken = null,
    refreshToken = null,
    expired = null,
    name: string,
    value: string,
    image: ImageType) {
    console.log('ProductStore: insertProduct: IN INSERT PRODUCT CALL');
    console.log("ProductStore: insertProduct: Insert Product Image:", image);
    console.log("ProductStore: insertProduct: email:", email);
    let insertResponse = await
        API.insertProduct(url, id, email, authToken, refreshToken, name, value, image, expired);

    // Return results to the calling program
    return insertResponse;
}

/**
* Perform DB Actipn - Executes the callback function, with user credentials
* @param [productId] 
* @param email 
* @param authToken 
* @param refreshToken 
* @param expired 
* @param [name] 
* @param [value] 
* @param [image] 
* @param url 
* @param cb 
* @returns  
*/
export let performDBAction = async (
    productId = '',
    email: string,
    authToken: string,
    refreshToken: string,
    expired: boolean,
    name: string | null | undefined = null,
    value: string | null | undefined = null,
    image: ImageType | null = null,
    url: string,
    cb: Function) => {

    const uniqueProductError: string = "Request failed with status code 500";
    const uniqueProductMsg = "Product name exists";

    console.log("ProductStore: PerformDbAction:", "email:", email);
    console.log('ProductUpdateContainer:refresh_token = ', refreshToken);

    /**********************************
     *  STEP8: Call method to delete product
     ***********************************/
    try {
        // Set Refresh Token Temporarly to norefresh to clear checkAuthization
        // let refresh_token = 'norefresh';

        console.log("BEFORE UPDATE CALLED");
        console.log("PerformDBAction Image:", image);
        let callBackResponse = await cb(
            url + productId,
            productId,
            email,
            authToken,
            refreshToken,
            expired,
            name,
            value,
            image
        );

        console.log("AFTER UPDATE CALLED");

        console.log("RESPONSEMESSAGE ", JSON.stringify(callBackResponse), "STATUS", callBackResponse.status);

        if (callBackResponse.status === 200 || callBackResponse.status === 201) {
            /************************************
             *  10142019: Set the global variable to  
             *  the updated ProductsListContainer
             ***********************************/

            let productsList = await retrieveUpdatedProductList();
            console.log("retrievedUpdatedProductList:", productsList);

            let data = {
                message: "Action Completed",
                refresh_token: "norefresh",
                isUserAuthorized: true,
                hasAccessTokenExpired: false,
                productsList: productsList
            };

            return data;
        }
    }
    catch (err) {
        console.log('err:', err.message);
        let data = {message: ''};

        if (err.message === uniqueProductError) {
            data = {
                message: uniqueProductMsg
            };
        } else {
            data = {
                message: err.message
            };
        }
        
        return data
    }
};

/**
 * stage db action - An integrator that passes an id and a callback function 
 * corresponding to the desired db action to be performed, and retrieves the 
 * new data and updates the state variables, to be displayed to screen.
 * @param id 
 * @param email 
 * @param name 
 * @param value 
 * @param image 
 * @param url 
 * @param refreshToken 
 * @param authToken 
 * @param expired 
 * @param cb 
 * @returns  
 */
 export let stageDBAction = async (
    id: string,
    email: string,
    name: string | null,
    value: string | null,
    image: ImageType | null,
    url: string,
    refreshToken: string,
    authToken: string,
    expired: boolean,
    cb: Function) => {
    console.log("Start stageDBAction: performDBAction");
    console.log("stageDBAction-email:", email);

    // Execute callback function and return results
    let dBActionResults = await performDBAction(
        id,
        email,
        authToken,
        refreshToken,
        expired,
        name,
        value,
        image,
        url,
        cb);

    console.log("PRODUCTINSERT: CONTAINER performDBAction dBActionResults:", dBActionResults);

    /************************************
     * Set placeholder text if data was inserted
     ****************************************/
    let namePlaceHolder;
    let valuePlaceHolder;
    if (dBActionResults?.message === "Action Completed") {

        if (name) {
            namePlaceHolder = { placeholderName: name };
        }
        if (value) {
            valuePlaceHolder = { placeholderValue: value };

        }
    }
    console.log("Passed performDBAction");
    let {
        message,
        isUserAuthorized,
        productsList
    }: PerformDBActionType = dBActionResults!;

    if (message === "Request failed with status code 401") {
        message = "Please Login";
    }
    /***************************************************
     * Set objects to be returned from stageDBAction
     *****************************************************/
    let dbObj;
    if (namePlaceHolder && valuePlaceHolder) {
        dbObj = {
            message,
            refreshToken,
            isUserAuthorized,
            expired,
            productsList,
            placeholderName: namePlaceHolder ? namePlaceHolder.placeholderName : '',
            placeholderValue: valuePlaceHolder ? valuePlaceHolder.placeholderValue : ''
        }
    }
    else {
        dbObj = {
            message,
            refreshToken,
            isUserAuthorized,
            hasAccessTokenExpired: expired,
            productsList
        }
    }

    console.log("STAGEDBACTION: productListData =", productsList);

    return dbObj;
}
