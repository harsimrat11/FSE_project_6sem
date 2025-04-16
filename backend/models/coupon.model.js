import { DataTypes } from "sequelize";
import sequelize from '../lib/db.js';

import User from "./user.model.js"; // Make sure this file exports the User model

const Coupon = sequelize.define(
  "Coupon",
  {
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    discountPercentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
        max: 100,
      },
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "coupons",
  }
);

// Association (Each user gets one coupon)
Coupon.belongsTo(User, { foreignKey: { name: "userId", allowNull: false }, onDelete: "CASCADE" });
User.hasOne(Coupon, { foreignKey: "userId" });

export default Coupon;
