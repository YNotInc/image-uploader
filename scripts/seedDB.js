const { Sequelize, DataTypes } = require("sequelize");

const productsData = require("./products");

const usersData = require("./users");

// var basename = path.basename(module.filename);
var env = process.env.NODE_ENV || "development";

var prodConfig = require(__dirname + "/../config/config-deployed.json")[env];
var devConfig = require(__dirname + "/../config/config.json")[env];

var isDevActive = env === "development";
var config = isDevActive ? devConfig : prodConfig;

var db = {};
// console.log("Env:", "*" + env + "*");
// console.log(config);

var sequelize; // Define sequelize here


if (isDevActive) {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      dialect: "mysql",
      config,
    }
  );
} else {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
}

var db = require("../api/models");

const Users = db.user;
const Products = db.product;

const userData = usersData;

const productData = productsData;

async function seedDatabase() {
  try {
    await sequelize.sync(); // Sync the database schema (if not already done)
    await Products.bulkCreate(productData);
    await Users.bulkCreate(userData);
    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } finally {
    sequelize.close(); // Close the database connection
  }
}

seedDatabase();
