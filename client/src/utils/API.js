import axios from "axios";
/****************************************************
 * API.js SHOULD NEVER CATCH ERROR, THAT SHOULD BE
 * HANDLED BY THE CONTAINER ON THE FRONTEND.  The
 * API IS JUST FORWARDING THE HTTP REQUEST To Backend
 *****************************************************/
// Create Export Hash
export let api = {
  register: async (data) => {
    /*************************************************************
     *  package and send the body to the endpoint
     ************************************************************/
    console.log("Sending data to:", "/api/user/register");
    const post = await axios({
      method: "post",
      url: "/api/user/register",
      data: data,
    }); // post
    /*************************************************************
     * Send the results back to the calling program
     ************************************************************/
    return post;
  },
  login: async (data) => {
    console.log("in login- Data:", data);
    /*************************************************************
     *  package and send the body to the endpoint
     ************************************************************/
    let post = await axios({
      method: "post",
      url: "/api/user/login",
      data: data,
    });
    /*************************************************************
     * Send the results back to the calling program
     ************************************************************/
    return post;
  },
  // products list GET
  getProducts: async (baseURL) => {
    if (baseURL) {
      console.log("In API.getProducts", baseURL);
      let get = await axios.get(baseURL, {
        headers: {
          Accept: "application/json,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      // let get = await axios.get(baseURL);
      return get;
    }
  },
  // individual product, make it resemble deleteProduct below
  getProduct: async (baseURL, authToken, refreshToken) => {
    if (baseURL) {
      try {
        console.log("in API.getProduct", baseURL);
        console.log("authToken:", authToken);
        console.log("refreshToken", refreshToken);
        const get = await axios.get(baseURL, {
          headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
            refreshtoken: refreshToken,
          },
        });
        /********************************************
         * Send the results back to calling program
         ********************************************/
        console.log("GET=", get);
        return get;
      } catch (err) {
        console.log("Get Product Unauthorized Error:", err);
        return err;
      }
    }
  },
  getUserInfo: async (baseURL, authToken, refreshToken) => {
    try {
      // console.log("in API.getProduct", baseURL);
      // console.log("authToken:", authToken);
      // console.log("refreshToken", refreshToken);
      if (baseURL) {
        let response = await axios.get(baseURL, 
          {
            headers: {
            Authorization: authToken,
            "Content-Type": "application/json",
            refreshtoken: refreshToken,
            },
          });

        console.log("APIGETUSERINFO: " + JSON.stringify(response));
        return response;
      } else {
        console.log("API.baseURL:", baseURL);
      }
    } catch (err) {
      console.log("UserInfo Unauthorized Error:", err);
      return err;
    }
  },

  refreshTokens: async (url, accessToken, refreshToken, email, expired) => {
    console.log("API In RefreshToken: ", refreshToken);
    if (url) {
      /*************************************************************
       *  package and send the body to the endpoint
       ************************************************************/
      const post = await axios({
        method: "post",
        url,
        data: {
          email,
          expired,
        },
        headers: {
          Authorization: accessToken,
          "Content-Type": "application/json",
          refreshtoken: refreshToken,
        },
      }); // post
      // console.log(post.data, post.status);
      /*************************************************************
       * Send the results back to the calling program
       ************************************************************/
      return post;
    }
  }, // catch

  // /:productId
  deleteProduct: async (baseURL, authToken, refreshToken, expired, email) => {
    if (baseURL) {
      const data = {
        expired: expired,
        email: email,
      };
      console.log("DATA:", JSON.stringify(data));
      console.log(`API: GOING TO DELETE ROUTE: ${baseURL}`);
      console.log(
        `authtoken: ${authToken}, refreshtoken: ${refreshToken}, expired: ${expired}, email: ${email}, URL: ${baseURL}`
      );
      /*************************************************************
       *  package and send the body to the endpoint
       ************************************************************/
      const remove = await axios.delete(baseURL, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
          refreshtoken: refreshToken,
        },
        data: data,
      });
      /**********************************************
       * Send the results back to the calling program
       **********************************************/
      // console.log("REMOVE=", remove);
      return remove;
    }
  },

  // /:productId
  updateProduct: async (
    baseURL,
    authToken,
    refreshToken,
    name,
    value,
    image,
    expired,
    email
  ) => {
    if (baseURL) {
      console.log("in API.updateProduct, baseURL:", baseURL);
      console.log("authToken:", authToken);
      console.log("refreshToken", refreshToken);
      console.log(
        "API-updateProduct: name:",
        name,
        "value:",
        value,
        "expired:",
        expired
      );

      const data = [
        // first set
        {
          propName: "name",
          value: name,
        },
        // second set
        {
          propName: "value",
          value: value,
        },
        // third set
        {
          propName: "expired",
          value: expired,
        },
        // fourth set
        {
          propName: "email",
          value: email,
        },
      ];
      /*************************************************************
       *  package and send the body to the endpoint
       ************************************************************/
      const patch = await axios.patch(baseURL, data, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
          refreshtoken: refreshToken,
        },
      });
      /*************************************************************
       * Send the results back to the calling program
       ************************************************************/
      return patch;
    }
  },
  // insertCloudinary: "/api/products/cloudinary/insert/"
  insertCloudinary: async (baseURL, imageObj, authToken, refreshToken) => {
    if (imageObj) {
      console.log("In insertCloudinary", baseURL);
      // console.log ("#ImageObj:", imageObj);

      //create formData from BASE64 file
      const formData = new FormData();
      formData.append("file", imageObj);

      const config = {
        headers: {
          Authorization: authToken,
          "Content-Type": "multipart/form-data",
          refreshtoken: refreshToken,
        },
      };

      // NEW POST WITH FORMDATA
      const post = await axios.post(baseURL, formData, config);

      return post;
    }
  },

  // /:productId
  insertProduct: async (
    baseURL,
    id,
    email,
    authToken,
    refreshToken,
    name,
    value,
    image,
    expired
  ) => {
    var cloudImageUrl = image.cloudImageUrl;
    var cloudPublicId = image.cloudImagePublicId;
    if (baseURL) {
      console.log("authToken:", authToken);
      console.log("refreshToken", refreshToken);
      // console.log("API: INSERT TOKEN:", 'name:', name, ',value:', value,'base64', image.base64Str);

      const data = [
        {
          propName: "name",
          value: name,
        },
        {
          propName: "value",
          value: value,
        },
        // {
        //     'propName': 'productImage',
        //     'value': base64Image
        // },
        {
          propName: "productImage",
          value: cloudImageUrl,
        },
        {
          propName: "cloudId",
          value: cloudPublicId,
        },
        {
          propName: "productId",
          value: id,
        },
        {
          propName: "authToken",
          value: authToken,
        },
        {
          propName: "refreshToken",
          value: refreshToken,
        },
        {
          propName: "email",
          value: email,
        },
        {
          propName: "expired",
          value: expired,
        },
      ];
      /*************************************************************
       *  package and send the body to the endpoint
       ************************************************************/
      const insert = await axios.post(baseURL, data, {
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
          refreshtoken: refreshToken,
        },
      });
      /*************************************************************
       * Send the results back to the calling program
       ************************************************************/
      return insert;
    }
  },
};
