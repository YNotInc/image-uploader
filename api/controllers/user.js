//import oAuthAccessToken
const oAuthAccessToken = require("../generators/oAuthAccessToken");

// import models
var db = require("../models");

//import momentjs
// const moment = require('moment');
// const { token } = require('morgan');

/************************************
 * Purpose: Store user credentials
 * from registration page (email, pw)
 ************************************/
exports.user_register = async (req, res, next) => {
  console.log("*****In controller/user/user_register");
  console.log("Request body:", req.body);
  let email = req.body.email;

  const duplicateEmail = await db.user.findOne({
    where: {
      email,
    },
  });

  if (duplicateEmail) {
    return res.status(409).json({
      message: "Mail exists",
    });
  } else {
    //Generate user with hashed password
    let password = req.body.password;
    // console.log("Password:", password);
    try {
      let salt = 10;
      /************************
       ** Encrypt Password
       ***********************/
      const passwordHash = await oAuthAccessToken.getHash(password, salt);
      // console.log("Password Hash", passwordHash);
      const result = await db.user.create({
        email,
        password: passwordHash,
      });
      // console.log("user:", result);
      res.status(201).json({
        message: "User created",
        id: result.id,
      });
    } catch (error) {
      // try
      console.log("ERROR", error);
      return res.status(500).json({
        error: error,
      });
    } // catch
  } //else
};

exports.user_refreshTokens = async (req, res, next) => {
  let email = req.body.email;
  console.log("In user_refreshTokens controller: " + email);

  try {
    const duplicateEmail = await db.user.findOne({
      where: {
        email,
      },
    });

    if (duplicateEmail) {
      return res.status(401).json({
        message: "Auth failed",
      });
    }
    // Success
    else {
      let endTime = oAuthAccessToken.getExpiration();
      /*******************
       * Create New Tokens
       *******************/
      let access_token;
      let refresh_token;
      /*******************************************
       * Returns signed JWT TOken
       *******************************************/
      access_token = oAuthAccessToken.createAccessToken(
        email,
        duplicateEmail.id
      );
      refresh_token = oAuthAccessToken.createRefreshToken(
        email,
        duplicateEmail.id
      );
      // console.log("TOKEN:", access_token);
      return res.status(200).json({
        message: "Auth successful",
        access_token: access_token,
        refresh_token: refresh_token,
        expiration: endTime,
        email,
      });
    } // else
  } catch (err) {
    console.log(err);
    res.status(401).json({
      message: "Auth failed",
    });
  }
};

exports.create_token = async (access_token, refresh_token, email) => {
  const userId = await db.user.findOne({
    include: [db.token],
    where: {
      email: email,
    },
    attributes: ["id"],
  });

  const prevTokenId = userId.dataValues.token
    ? userId.dataValues.token.id
    : null;
  const curUserId = userId && userId.dataValues.id;
  // console.log("***curUSERID:", curUserId);
  // console.log("***prevTokenID:", prevTokenId);

  //Create Token:
  let dbToken = await db.token.create({
    access: access_token,
    refresh: refresh_token,
    userId: curUserId,
  });

  // Delete previousTokenId in token table after new user.TokenId has been updated
  if (prevTokenId) {
    // console.log("In prevToken");
    await db.token.destroy({
      where: {
        id: prevTokenId,
      },
    });
  }

  if (curUserId) {
    return true;
  } else return false;
};

exports.users_get_user = async (req, res, next) => {
  let email = req.params.userEmail;
  // console.log("User Controller Email:", email);
  const duplicateEmail = await db.user.findOne({
    where: {
      email,
    },
  });
  // console.log("USER CONtroller Email:", duplicateEmail);
  try {
    if (duplicateEmail.dataValues) {
      console.log(
        "USERCONTROLLER = ID:",
        duplicateEmail.dataValues.id,
        "Role:",
        duplicateEmail.dataValues.role
      );
      res.status(200).json(duplicateEmail.dataValues);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.populate_token = async (email) => {
  // console.log("UserController: populate-Token email:", email);
  const allUsers = await db.user.findOne({
    include: [db.token],
    where: {
      email,
    },
  });
  // console.log("allUsers", allUsers);
  // return JSON.stringify(userDocument);
  return allUsers.dataValues;
};

exports.user_login = async (req, res, next) => {
  console.log("reached controllers-user-user_login");
  console.log("Request body:", req.body);
  let email = req.body.email;
  try {
    console.log("In Try");
    // Find the matching document in the user collection that matches the email
    let duplicateEmail = await db.user.findOne({
      where: {
        email,
      },
    });

    if (duplicateEmail < 1) {
      return res.status(401).json({
        message: "Auth failed",
      });
    } else {
      let endTime = oAuthAccessToken.getExpiration();
      /*************************************************************
       * Check if password sent matches what was saved to database
       **************************************************************/
      let passwordsEqual = await oAuthAccessToken.comparePasswords(
        req.body.password,
        duplicateEmail.password
      );

      console.log("Passwords Equal:", passwordsEqual);
      console.log("In comparePasswords");

      let access_token;
      let refresh_token;
      if (passwordsEqual) {
        /*******************************************
         * Returns JWT TOken
         *******************************************/
        // create access_token
        access_token = oAuthAccessToken.createAccessToken(
          email,
          duplicateEmail.id
        );

        // create refresh_token
        refresh_token = oAuthAccessToken.createRefreshToken(
          email,
          duplicateEmail.id
        );

        // 12/31/2019: Insert token on user document:
        /**************************/
        let isTokenStored = await this.create_token(
          access_token,
          refresh_token,
          email
        );

        console.log("is Token stored on USer: ", JSON.stringify(isTokenStored));
        /***************************/

        if (isTokenStored) {
        }
        res.status(200).json({
          message: "Auth successful",
          access_token: access_token,
          refresh_token: refresh_token,
          expiration: endTime.toString(),
          email,
        });
      } // if
      // if passwords not Equal
      else {
        // console.log("in Password failed condition");
        res.status(401).send({
          message: "Auth failed",
        });
      } // else
    } // else
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err,
      message: err,
    });
  }
};

exports.user_delete = (req, res, next) => {
  try {
    const destroyedRecord = db.user.destroy({
      where: {
        id: req.params.userId,
      },
    });
    if (destroyedRecord) {
      res.status(200).json({
        message: "user deleted",
      });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({
      error: err,
    });
  } // catch
};
