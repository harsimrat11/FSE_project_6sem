import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { Op, fn, col, literal } from "sequelize";

export const getAnalyticsData = async () => {
  const totalUsers = await User.count();
  const totalProducts = await Product.count();
  const totalSales = await Order.count();

  const totalRevenueResult = await Order.findOne({
    attributes: [[fn("SUM", col("totalAmount")), "totalRevenue"]],
    raw: true,
  });

  const totalRevenue = totalRevenueResult.totalRevenue || 0;

  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
};

export const getDailySalesData = async (startDate, endDate) => {
  try {
    const dailySalesData = await Order.findAll({
      attributes: [
        [fn("DATE", col("createdAt")), "date"],
        [fn("COUNT", col("id")), "sales"],
        [fn("SUM", col("totalAmount")), "revenue"],
      ],
      where: {
        createdAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      group: [literal("DATE(createdAt)")],
      order: [[literal("DATE(createdAt)"), "ASC"]],
      raw: true,
    });

    const dateArray = getDatesInRange(startDate, endDate);

    return dateArray.map((date) => {
      const foundData = dailySalesData.find((item) => item.date === date);
      return {
        date,
        sales: foundData ? Number(foundData.sales) : 0,
        revenue: foundData ? Number(foundData.revenue) : 0,
      };
    });
  } catch (error) {
    throw error;
  }
};

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);

  while (currentDate <= new Date(endDate)) {
    dates.push(currentDate.toISOString().split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
