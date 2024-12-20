var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Token = sequelize.define("token", {
    access: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    refresh: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  });
  Token.associate = function (models) {
    //A Token belongs to a User
    Token.belongsTo(models.user, {
      foreignKey: {
        name: "userId",
        allowNull: true,
        defaultValue: null,
      },
    });
  };
  return Token;
};
