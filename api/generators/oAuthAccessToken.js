const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const accessExpireTime = 1;
const refreshExpireTime = 5;

exports.getHash = (password, salt) => {
  return new Promise((resolve, reject) => {
    console.log("IN oAuthAccessToken.getHash PROMISE");
    bcrypt.hash(password, salt, async (err, hash) => {
      if (err) {
        console.log("Password Err:", err);
        reject(err);
      } else {
        console.log("Password Hash:", hash);
        resolve(hash);
      }
    }); // bcrypt
  }); // promise
};

exports.comparePasswords = (inputPassword, storedPassword) => {
  return new Promise((resolve, reject) => {
    console.log("IN PROMISE");
    bcrypt.compare(inputPassword, storedPassword, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    }); // bcrypt
  }); // promise
};

// Create a new access_token
exports.createAccessToken = (email, id) => {
  return jwt.sign(
    {
      email: email,
      userId: id,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: `${accessExpireTime}h`,
    }
  );
};

// Create a new access_token
exports.createRefreshToken = (email, id) => {
  return jwt.sign(
    {
      email: email,
      userId: id,
    },
    process.env.JWT_PRIVATE_KEY,
    {
      expiresIn: `${refreshExpireTime * accessExpireTime}h`,
    }
  );
};

// Parse token
exports.verify = (token) => {
  return jwt.verify(token, process.env.JWT_PRIVATE_KEY);
};

exports.decode = (token) => {
  return jwt.decode(token, process.env.JWT_PRIVATE_KEY);
};

// get token expiration
exports.getExpiration = () => {
  let time = moment.utc();
  console.log("time:", time);

  let startTime = time;
  let endTime = startTime.add(accessExpireTime, "hours");
  // console.log('startTime:', startTime, 'endTime:', endTime);
  //  console.log("Token ENDTIME", endTime)
  // let diff = endTime.diff(startTime, 'hours');
  // console.log('Dif:', diff);
  return endTime;
};
