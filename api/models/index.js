"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");

var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";

var prodConfig = require(__dirname + "/../../config/config-deployed.json")[env];
var devConfig = require(__dirname + "/../../config/config.json")[env];

var isDevActive = env === "development";
var config = isDevActive ? devConfig : prodConfig;

var db = {};
// console.log("Env:", "*" + env + "*");
// console.log(config);

if (isDevActive) {
  var sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
} else {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
}

fs.readdirSync(__dirname)
  .filter(function (file) {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach(function (file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
