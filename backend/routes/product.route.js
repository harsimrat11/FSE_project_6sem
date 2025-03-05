
// export default router;
import express from "express";
import {
	getAllProducts,
	getFeaturedProducts,
	createProduct,
	updateProduct,
	deleteProduct,
	getProductsByCategory,
} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.get("/category/:category",getProductsByCategory);

export default router;