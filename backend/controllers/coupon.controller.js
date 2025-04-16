import Coupon from "../models/coupon.model.js";
import { Op } from "sequelize";

export const getCoupon = async (req, res) => {
	try {
		const coupon = await Coupon.findOne({
			where: {
				userId: req.user.id,
				isActive: true,
			},
		});
		res.json(coupon || null);
	} catch (error) {
		console.log("Error in getCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const validateCoupon = async (req, res) => {
	try {
		const { code } = req.body;
		const coupon = await Coupon.findOne({
			where: {
				code: code,
				userId: req.user.id,
				isActive: true,
			},
		});

		if (!coupon) {
			return res.status(404).json({ message: "Coupon not found" });
		}

		if (new Date(coupon.expirationDate) < new Date()) {
			coupon.isActive = false;
			await coupon.save();
			return res.status(404).json({ message: "Coupon expired" });
		}

		res.json({
			message: "Coupon is valid",
			code: coupon.code,
			discountPercentage: coupon.discountPercentage,
		});
	} catch (error) {
		console.log("Error in validateCoupon controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
