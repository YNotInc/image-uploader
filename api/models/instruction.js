// import models
var db = require("../models");
// const { token } = require("morgan");

module.exports = function (sequelize, DataTypes) {
  var Instruction = sequelize.define("instruction", {
    instruction: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
    },
  });
  Instruction.associate = function (models) {
    // Each instruction belongs to one exercise
    Instruction.belongsTo(models.exercise, {
      foreignKey: {
        name: "exerciseId",
        allowNull: true,
        defaultValue: null,
      },
    });
  };
  Instruction.associate = function (models) {
    // Each instruction has many questions
    Instruction.hasMany(models.question, {
      foreignKey: {
        name: "instructionId",
        allowNull: true,
        defaultValue: null,
        onDelete: "cascade",
        hooks: true,
      },
    });
  };

  return Instruction;
};
