var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Answer = sequelize.define("answer", {
    answer: {
      type: DataTypes.STRING,
      unique: false,
      // Require type to be present
      allowNull: true,
    },
  });

  Answer.associate = function (models) {
    // Each answer belongs to one question
    Answer.belongsTo(models.question, {
      foreignKey: {
        name: "questionId",
        allowNull: true,
        defaultValue: null,
      },
    });
  };
  return Answer;
};
