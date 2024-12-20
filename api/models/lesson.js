// import models
var db = require("../models");
const { token } = require("morgan");

module.exports = function (sequelize, DataTypes) {
  var Lesson = sequelize.define("lesson", {
    lesson: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
    },
  });

  Lesson.associate = function (models) {
    // Each lesson has many exercises
    Lesson.hasMany(models.exercise, {
      foreignKey: {
        name: "lessonId", //step 1
        allowNull: true,
        defaultValue: null,
        onDelete: "cascade",
        hooks: true,
      },
    });
  };

  return Lesson;
};
