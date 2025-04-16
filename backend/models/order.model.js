import { DataTypes } from "sequelize";
import sequelize from '../lib/db.js';

import User from "./user.model.js";
import Product from "./product.model.js";

const Order = sequelize.define(
  "Order",
  {
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    stripeSessionId: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    timestamps: true,
    tableName: "orders",
  }
);

// Order belongs to a user
Order.belongsTo(User, { foreignKey: { name: "userId", allowNull: false }, onDelete: "CASCADE" });
User.hasMany(Order, { foreignKey: "userId" });

// Define a join table for order items
const OrderProduct = sequelize.define(
  "OrderProduct",
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
  },
  {
    timestamps: false,
    tableName: "order_products",
  }
);

// Many-to-many relation with extra fields (quantity, price)
Order.belongsToMany(Product, {
  through: OrderProduct,
  foreignKey: "orderId",
  otherKey: "productId",
});
Product.belongsToMany(Order, {
  through: OrderProduct,
  foreignKey: "productId",
  otherKey: "orderId",
});

export default Order;
export { OrderProduct };
