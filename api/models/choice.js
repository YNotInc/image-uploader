var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Choice = sequelize.define("choice", {
    text: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
    },
    imageName: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
    },
    imageNames: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
      get() {
        return this.getDataValue("favColors").split(";");
      },
      set(val) {
        this.setDataValue("favColors", val.join(";"));
      },
    },
    hint: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
    },
    objectType: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
    },
    ElementType: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
    },
  });

  Choice.associate = function (models) {
    // Each choice belongs to one question
    Choice.belongsTo(models.question, {
      foreignKey: {
        name: "questionId",
        allowNull: true,
        defaultValue: null,
      },
    });
  };
  return Choice;
};
