var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Exercise = sequelize.define("exercise", {
    name: {
      type: DataTypes.STRING,
      unique: true,
      // Require type to be present
      allowNull: false,
    },
  });
  Exercise.associate = function (models) {
    // Each exercise has one lesson
    Exercise.belongsTo(models.lesson, {
      foreignKey: {
        name: "lessonId",
        allowNull: true,
        defaultValue: null,
      },
    });
  };

  Exercise.associate = function (models) {
    // Each exercise has one instruction
    Exercise.hasOne(models.instruction, {
      foreignKey: {
        name: "exerciseId",
        allowNull: true,
        defaultValue: null,
        onDelete: "cascade",
        hooks: true,
      },
    });
  };
  return Exercise;
};
