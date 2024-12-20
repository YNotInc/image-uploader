const express = require("express");

// Conveniently handles routes with different endpoints
const router = express.Router();

const UserController = require("../controllers/user");

//Import check Auth MiddleWare
const checkAuth = require("../authenticators/check-auth");

/****************************************
 * Purpose: Get user login info and role
 * API URL: '/api/user/information/:userEmail'
 * Access: User/Admin - Requires Check Auth, because there is no reason to check a user role only user has a login
 * **************************************/
router.get("/information/:userEmail", checkAuth, UserController.users_get_user);

/********************************
 * Purpose: Register user new user
 * API URL: '/api/user/register'
 * Access: All - No Check Auth req
 ********************************/
router.post("/register", UserController.user_register); // post

/**********************************
 * Purpose: Refresh a users cred
 * API URL: '/api/user/login/refresh'
 * Access: User/Admin - Check Auth req
 **********************************/
router.post("/login/refresh", checkAuth, UserController.user_refreshTokens);

/*******************************
 * Purpose: User login, create token
 * API URL: '/api/user/login'
 * Access: All - No Check Auth req
 * ******************************/
router.post("/login", UserController.user_login);

/********************************
 * Purpose: Delete a user
 * API URL: '/api/user/:userId'
 * Access: Admin - Check Auth req
 * Status: Not in use
 * *******************************/
// router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;
