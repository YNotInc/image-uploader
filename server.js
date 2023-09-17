// Dependencies
/*************************/
// import dotenv
require("dotenv").config();

//require routes
const routes = require("./api/routes");

// import express
const express = require("express");

// import model's index.js
var db = require("./api/models");

//Setup Express:
/******************* */
const app = express();

// Set port
const PORT = process.env.PORT || 3001;
// const PORT = process.env.PORT || 3000;
/******************** */

// use multipart data 5/17/2020
const formData = require("express-form-data");

// import required modules
const morgan = require("morgan");
const bodyParser = require("body-parser");

const path = require("path");

//5/17/2020:
// Parse the Application body
/*************************** */
app.use(formData.parse());

app.use(express.json({ limit: "5024mb" }));
app.use(express.urlencoded({ limit: "5024mb", extended: true }));

// Append headers to any response sent back, before routes, to disable cors errors
app.use((req, res, next) => {
  // Header 1: restrict to certain URL
  // res.header('Access-Control-Allow-Origin', 'http://my-cool-page.com');

  // Set Cross Access Control Header to all incoming URLS
  res.header("Access-Control-Allow-Origin", "*");

  // Header 2: Set which Headers can be accepted along with a request
  res.header("Access-Control-Allow-Headers", "*");

  // Header 3: An options incoming request.method is equal to options.  A browser will always send an options request first when you make an HTTP request, where the browser determines if he is allowed to make the actual request (Post Flight Check);
  if (req.method === "OPTIONS") {
    // Allow all HTTP REQUESTS
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  /*************************** */
  // Header 4: Call next, so that other routes can handle the next (real) request
  next();
});

// Serve up static assets
// ************************************************
if (process.env.NODE_ENV === "production") {
  app.use(express.static("./client/build"));
}

// Define routes here to get body parser working/*************************************/

// add routes, bot API and View
app.use(routes);
/*************************************/
app.use(morgan("dev"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// STOP SEQUELIZE FROM OVERWRITING MY DATA: or comment out lines 97 and 104
/************************************************/
// Do not Drop Tables, in Production
var syncOptions = { force: false };

// var syncOptions = { force: true }; //Drop Table

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Start the API server
// ************************************************
// Syncing our sequelize models and then starting our express app
db.sequelize.sync(syncOptions).then(function () {
  app.listen(PORT, function () {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});
// ************************************************
