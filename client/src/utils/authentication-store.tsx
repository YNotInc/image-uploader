import { api as API } from './API';
import moment, { Moment } from 'moment';
// Import Server-Side Utilities:


/**********************
 * Contains methods for storing credentials in localStorage and packaging for setting as state variables
 */
let set = (name: string, value: string) => {
    localStorage.setItem(name, value);
};

let get = (name: string) => {
    let authenticationStore_value = localStorage.getItem(name);
    console.log(name, ':', authenticationStore_value);
    let returnValue = authenticationStore_value ? authenticationStore_value : '';
    return returnValue;
};

let hasAccessTokenExpired = (() => {
    let data = localStorage.getItem('data');
    // set hasAccessTokenExpired to true to get the refreshToken method to execute.  Request will fail with no tokens and return.  Otherwise
    let returnValue = false;

    if (data !== null && typeof data !== 'undefined') {
        let currentTime = moment.utc(moment()).local().format("L LT");
        const userCredentials = JSON.parse(get('data'));
        //5/17/2020
        /***********************************/
        // let { expiration } = data;
        // let sessionExpirationTime = moment.utc(moment(expiration)).local().format("MM/DD/YYYY LT");
        let sessionExpirationTime = moment.utc(userCredentials.expiration).local().format("MM/DD/YYYY LT");



        /************************************/
        console.log("currentTime.isAfter(sessionExpirationTime):", moment(currentTime).isAfter(sessionExpirationTime));

        console.log("sessionExpirationTime.isAfter(currentTime):", moment(sessionExpirationTime).isAfter(moment(currentTime)));


        console.log('currentTime:', currentTime, 'sessionExpiration:', sessionExpirationTime);

        // Get TIme difference in minutes
        let timeDiff = moment(sessionExpirationTime).diff(moment(currentTime), 'minutes');

        console.log('TIMEDIFF:', timeDiff);

        returnValue = timeDiff <= 10 ? true : false;
        // return returnValue;
        // return false;
    } // if
    return returnValue;
});

let setLocalStorage = ((
    access_token: string, refresh_token: string, expiration: Moment | null,
    email: string,
    message?: string) => {

    let data = {
        access_token,
        refresh_token,
        expiration,
        email,
        message
    };
    console.log("created data", data.message);
    set('data', JSON.stringify(data));
    console.log("set LocalStorage data", data.message);
    return data;
});

let getLocalStorage = (async () => {
    console.log("In getLocalStorage");
    
    let curCredResponse;

    let curCredentials = await localStorage.getItem('data');
    console.log("curCredentials:", curCredentials);
    if (curCredentials !== null && typeof curCredentials !== 'undefined') {
        // get data from local storage
        const curCredObj = JSON.parse(get('data'));
        console.log("CurCredObj", curCredObj);
        curCredResponse = curCredObj;
    }
    else {
        curCredResponse = {
            access_token: '',
            refresh_token: '',
            expiration: '',
            email: '',
            message: ''
        };
    }
    console.log("AuthenticationStore return curCredentials:", curCredResponse);
    return curCredResponse;
});

let resetLocalStorage = () => {
    console.log("LOCAL STORAGE CLEARED");
    localStorage.clear();
};

let setUserState = async (email: string, authToken: string, refreshToken: string) => {
    // set state variables:
    // let stateVariables = await getLocalStorage();

    // this.setState(stateVariables);
    // let user;
    let baseURL = `/api/user/information/${email}`;
    console.log("authenticationStore.setUserState: Email=*" + email + "*");

    // 01/03/2020: Get User role
    let userRoleObj = await API.getUserInfo(baseURL, authToken, refreshToken)
        .then(userRecord => {
            console.log("BASE URL=", baseURL);
            console.log("USER userRecord=", userRecord);
            // set user

            let userObject = {
                role: userRecord?.data.role,
                // data: products
            };
            console.log("PLC2USEROBJECT:", userObject);
            return userObject

        })
        .catch(err => {
            console.log("ERROR: Setting ROLE to VISITOR:", err);
            var userObject = {
                role: "visitor",
                // data: products
            };
            return userObject;
            // this.setState({ user: userObject });
        });
    return userRoleObj;
};

// get user role from backend
var setUserRole = async (email: string, authToken: string, refreshToken: string) => {

    let baseURL = `/api/user/information/${email}`;
    // console.log("authenticationStore.setUserRole: Email=*" + email + "*");

    // Get User role
    let userRoleObj = await API.getUserInfo(baseURL, authToken, refreshToken)
        .then(userRecord => {
 
            // set user
            const userRole = {
                role: userRecord?.data.role,
            };

            if (!userRole.role) {
                userRole.role = "visitor";
            }
            return userRole;
        })
        .catch(err => {
            console.log("ERROR: Setting ROLE to VISITOR:", err);
            let userRole = {
                role: "visitor",
            };
            return userRole;
        });
    return userRoleObj;
}

export { set, get, hasAccessTokenExpired, setLocalStorage, getLocalStorage, resetLocalStorage, setUserState, setUserRole };