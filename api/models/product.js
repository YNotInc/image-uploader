module.exports = function (sequelize, DataTypes) {
  var Product = sequelize.define("product", {
    name: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      unique: false,
      allowNull: false,
    },
    productImage: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
    cloudId: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
    },
  });
  return Product;
};
