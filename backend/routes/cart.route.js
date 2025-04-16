// import express from "express";
// import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
// import { protectRoute } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.get("/", protectRoute, getCartProducts);
// router.post("/", protectRoute, addToCart);
// router.delete("/", protectRoute, removeAllFromCart);
// router.put("/:id", protectRoute, updateQuantity);

// export default router;
import express from "express";
import { addToCart, getCartProducts, removeAllFromCart, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts); // GET cart items
router.post("/", protectRoute, addToCart);      // POST add to cart
router.delete("/", protectRoute, removeAllFromCart); // DELETE remove all items from cart
router.put("/:id", protectRoute, updateQuantity); // PUT update cart item quantity

export default router;
