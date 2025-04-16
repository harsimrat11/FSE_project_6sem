import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import { stripe } from "../lib/stripe.js";
import { Op } from "sequelize";

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body;

		if (!Array.isArray(products) || products.length === 0) {
			return res.status(400).json({ error: "Invalid or empty products array" });
		}

		let totalAmount = 0;

		const lineItems = products.map((product) => {
			const amount = Math.round(product.price * 100);
			totalAmount += amount * product.quantity;

			return {
				price_data: {
					currency: "inr",
					product_data: {
						name: product.name,
						images: [product.image],
					},
					unit_amount: amount,
				},
				quantity: product.quantity || 1,
			};
		});

		let coupon = null;

		if (couponCode) {
			coupon = await Coupon.findOne({
				where: {
					code: couponCode,
					userId: req.user.id,
					isActive: true,
				},
			});
			if (coupon) {
				totalAmount -= Math.round((totalAmount * coupon.discountPercentage) / 100);
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			metadata: {
				userId: req.user.id.toString(),
				couponCode: couponCode || "",
				products: JSON.stringify(
					products.map((p) => ({
						id: p.id,
						quantity: p.quantity,
						price: p.price,
					}))
				),
			},
		});

		if (totalAmount >= 20000) {
			await createNewCoupon(req.user.id);
		}

		res.status(200).json({ id: session.id, totalAmount: totalAmount / 100 });
	} catch (error) {
		console.error("Error processing checkout:", error);
		res.status(500).json({ message: "Error processing checkout", error: error.message });
	}
};

export const checkoutSuccess = async (req, res) => {
	try {
		const { sessionId } = req.body;
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status === "paid") {
			if (session.metadata.couponCode) {
				await Coupon.update(
					{ isActive: false },
					{
						where: {
							code: session.metadata.couponCode,
							userId: session.metadata.userId,
						},
					}
				);
			}

			const products = JSON.parse(session.metadata.products);

			const newOrder = await Order.create({
				userId: session.metadata.userId,
				totalAmount: session.amount_total / 100,
				stripeSessionId: sessionId,
			});

			await Promise.all(
				products.map((product) =>
					newOrder.createOrderItem({
						productId: product.id,
						quantity: product.quantity,
						price: product.price,
					})
				)
			);

			res.status(200).json({
				success: true,
				message: "Payment successful, order created.",
				orderId: newOrder.id,
			});
		}
	} catch (error) {
		console.error("Error processing successful checkout:", error);
		res.status(500).json({ message: "Error processing successful checkout", error: error.message });
	}
};

async function createNewCoupon(userId) {
	await Coupon.destroy({ where: { userId } }); // one coupon per user

	const newCoupon = await Coupon.create({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: 10,
		expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
		userId: userId,
	});
}
