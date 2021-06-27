const oAuthAccessToken = require("../generators/oAuthAccessToken");
const userController = require("../controllers/user");
const jwt = require("jsonwebtoken");
var _ = require("lodash");
const moment = require("moment");
// Add the following JWT middleware to the routes we wish to authenticate.
module.exports = async (req, res, next) => {
  // Step0: Set Defaults:
  const access_token_header = removeBearer(req.headers.authorization);
  console.log("access_token_header:", access_token_header);

  const refresh_token_header = req.headers.refreshtoken;
  console.log("refresh_token_header:", refresh_token_header);

  let validDecodedRefreshToken;

  // verify and return decoded value
  /************************************/
  console.log("In check-auth.js");
  console.log("REQ Path:", req.path);
  console.log("REQ BaseURL:", req.baseUrl);
  // console.log("REQ Route:", req.route);
  // if there is a valid refresh token, reset credentials
  if (req.baseUrl === "/login/refresh") {
    validDecodedRefreshToken = decodedToken(refresh_token_header);
    // console.log("validDecodedRefreshToken:", validDecodedRefreshToken);

    const refreshTokenExpired = isTokenExpired(validDecodedRefreshToken);
    // console.log("isRefreshTokenExpired:", refreshTokenExpired);
    // if refreshTokenExpired throw error
    refreshTokenExpired ? throwAuthError(res) : "";
  }
  // Perform normal checks
  else {
    try {
      // Step2: Check if Tokens are unmanipulated

      const validDecodedAccessToken = decodedToken(access_token_header);
      // console.log("validDecodedAccessToken:", validDecodedAccessToken);

      if (!validDecodedAccessToken) {
        // Step3: check if refreshToken is unmanipulated
        validDecodedRefreshToken = decodedToken(refresh_token_header);
        // console.log("validDecodedRefreshToken:", validDecodedRefreshToken);
      }
      //if accessToken valid and refreshToken=norefresh, this indicates the access token is still valid, so no refresh is required.
      else if (
        validDecodedAccessToken &&
        refresh_token_header === "norefresh"
      ) {
        const accessTokenExpired = isTokenExpired(validDecodedAccessToken);
        accessTokenExpired ? throwAuthError(res) : "";
      } else if (validDecodedAccessToken) {
        // Step4: Check if AccesTokens time has expired
        const accessTokenExpired = isTokenExpired(validDecodedAccessToken);
        console.log("isAccessTokenExpired:", accessTokenExpired);
        if (accessTokenExpired) {
          // if accessTokenExpired then check refreshToken expiration
          validDecodedRefreshToken = decodedToken(refresh_token_header);
          const refreshTokenExpired = isTokenExpired(validDecodedRefreshToken);
          console.log("isRefreshTokenExpired:", refreshTokenExpired);
          // if refreshTokenExpired throw error
          refreshTokenExpired ? throwAuthError(res) : "";
        }
      }

      // Step5: If no error was triggered call next function:
      next();
    } catch (error) {
      console.log("check-auth: Error Caught", error);
      return res.status(401).json({
        message: "Auth failed",
      });
    } // catch
  } // else
};

let throwAuthError = (res) => {
  // throw new Error("Unauthorized Use");
  return res.status(401).json({
    message: "Auth failed",
  });
};

let convertUnixToUtc = (unixTime) => {
  return moment.unix(unixTime).utc();
};

let isTokenExpired = (decodedToken) => {
  //const access_token = access_token_header.split(" ")[1];

  console.log("DECODED Access-token Valid:", decodedToken);

  //Convert Unix time stamp to utc time
  const tokenExpireTime = convertUnixToUtc(decodedToken.exp);
  console.log("Token Expire Time:", tokenExpireTime);

  const currentTime = moment.utc();
  console.log("currentTime:", currentTime);

  const hoursBeforeExpire = tokenExpireTime.diff(currentTime, "hours");
  console.log("Hours Before Expiration:", hoursBeforeExpire);

  const minutesBeforeExpire = tokenExpireTime.diff(currentTime, "minutes");
  console.log("Minutes Before Expiration:", minutesBeforeExpire);

  const hoursB4ExpireInMins = hoursBeforeExpire * 60;
  console.log("Hours Before Expire in Mins:", hoursB4ExpireInMins);

  const totalMinsB4Expire = hoursB4ExpireInMins + minutesBeforeExpire;

  console.log("Total Mins Before Expire:", totalMinsB4Expire);

  const tokenExpired = totalMinsB4Expire <= 0 ? true : false;
  console.log("TokenExpired =", tokenExpired);

  return tokenExpired;
};

let decodedToken = (token_header) => {
  let isValid = false;

  const token = token_header;

  const decodedToken = oAuthAccessToken.verify(
    token,
    process.env.JWT_PRIVATE_KEY
  );

  return decodedToken;
}; // isAccessTokenValid

let removeBearer = (str) => {
  let strCopy = str;
  console.log("StrCopy:", strCopy);
  const regex = /Bearer /;
  if (strCopy && regex.test(strCopy)) {
    while (regex.test(strCopy)) {
      strCopy = strCopy.replace(regex, "");
    }
  }
  console.log("NEWStrCopy:", strCopy);
  return strCopy;
};
