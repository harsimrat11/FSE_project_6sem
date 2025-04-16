import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";

const Product = sequelize.define(
  "Product",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: DataTypes.STRING,
    color: DataTypes.STRING,
    mag_capacity: DataTypes.INTEGER,
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
    },
    specs: DataTypes.TEXT,
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, 
    },
  },
  {
    timestamps: true,
    tableName: "products",
  }
);

export default Product;
