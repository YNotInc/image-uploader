// import models
var db = require("../models");
const { token } = require("morgan");
// Sequelize migration: Change schema without losing data:
// http://docs.sequelizjs.com/en/latest/docs/migrations
//when you instal sequelize, you must have mysql2,  mysql is not compatible with sequelize

// 6/13/20: Create a User model that maps to the user table, We are offloading the responsibility of creating the tables to the model files themselves

//table names should be lowercase.  The model name will be referenced by whatever is passed in "user"

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("user", {
    email: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      // Require pw to be present
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      unique: false,
      // Require role to be present
      allowNull: false,
      defaultValue: "user",
    },
  });
  // ,
  // {
  //     //Model Users will be the same as the model name instead of being pluralized
  //     freezeUsers: true
  // });
  User.associate = function (models) {
    // Each Token should belong to a user
    // A Post can't be created without an Author due to the foreign key constraint
    User.hasOne(models.token, {
      foreignKey: {
        name: "userId", //step 1
        allowNull: true,
        defaultValue: null,
        onDelete: "cascade",
        hooks: true,
      },
    });
  };

  return User;
};
