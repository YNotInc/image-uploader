var db = require("../models");

module.exports = function (sequelize, DataTypes) {
  var Question = sequelize.define("question", {
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

  Question.associate = function (models) {
    // Each question belongs to one instruction
    Question.belongsTo(models.instruction, {
      foreignKey: {
        name: "instructionId",
        allowNull: true,
        defaultValue: null,
      },
    });
  };

  Question.associate = function (models) {
    // Each question has many choices
    Question.hasMany(models.choice, {
      foreignKey: {
        name: "questionId",
        allowNull: true,
        defaultValue: null,
        onDelete: "cascade",
        hooks: true,
      },
    });
  };

  Question.associate = function (models) {
    // Each question has one answer
    Question.hasOne(models.answer, {
      foreignKey: {
        name: "questionId",
        allowNull: true,
        defaultValue: null,
        onDelete: "cascade",
        hooks: true,
      },
    });
  };

  return Question;
};
