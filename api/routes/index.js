// Import product routes.
const router = require("express").Router();
const productRoutes = require("./products");
const userRoutes = require("./user");

/************************************
 * RouteHandler 2: Product routes
 * Purpose: Handles "/api/products" URLS
 * Description: First Parameter is a filter: '/api/',
 * requests followed by "/products" will
 * be handled by the second argument "productRoutes".
 * *******************************************/
// Addroutes, both api and view
router.use("/api/products", productRoutes);
router.use("/api/user", userRoutes);

module.exports = router;
