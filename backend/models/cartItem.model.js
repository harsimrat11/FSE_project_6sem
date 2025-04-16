// import User from "./user.model.js";
// import Product from "./product.model.js";
// import CartItem from "./cartItem.model.js";

// // Associations
// User.hasMany(CartItem, { foreignKey: "userId", onDelete: "CASCADE" });
// CartItem.belongsTo(User, { foreignKey: "userId" });

// Product.hasMany(CartItem, { foreignKey: "productId", onDelete: "CASCADE" });
// CartItem.belongsTo(Product, { foreignKey: "productId" });

import { DataTypes } from "sequelize";
import sequelize from "../lib/db.js";
import User from "./user.model.js";
import Product from "./product.model.js";

// Define CartItem Model
const CartItem = sequelize.define("CartItem", {
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1, // Ensure that quantity cannot be less than 1
    },
  },
});

// Associations
User.belongsToMany(Product, {
  through: CartItem,
  foreignKey: "userId",
  otherKey: "productId",
  onDelete: "CASCADE",
});

Product.belongsToMany(User, {
  through: CartItem,
  foreignKey: "productId",
  otherKey: "userId",
  onDelete: "CASCADE",
});

export default CartItem;
