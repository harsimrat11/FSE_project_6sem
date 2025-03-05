// // import express from "express";
// // import { login, logout, signup, refreshToken, getProfile } from "../controllers/auth.controller.js";
// // import { protectRoute } from "../middleware/auth.middleware.js";

// // const router = express.Router();

// // router.post("/signup", signup);
// // router.post("/login", login);
// // router.post("/logout", logout);
// // router.post("/refresh-token", refreshToken);
// // router.get("/profile", protectRoute, getProfile);

// // export default router;
// import express from "express";
// // import { login, register, logout } from "../controllers/auth.controller.js";
// import { login, signup, logout } from "../controllers/auth.controller.js";

// import { verifyToken } from "../middleware/auth.middleware.js";

// const router = express.Router();

// router.post("/register", register);
// router.post("/login", login);
// router.post("/logout", verifyToken, logout);

// export default router;

import express from "express";
import { signup, login, logout, refreshToken, getProfile } from "../controllers/auth.controller.js";
import { protectRoute, adminRoute, checkRefreshToken, verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);

// Protected routes (need valid token)
router.get("/profile", verifyToken, getProfile); // Only verified users can access profile
router.post("/some-secure-route", verifyToken, (req, res) => {
  res.json({ message: "This is a secure route!" });
});

// Admin protected routes
router.post("/admin-only", verifyToken, adminRoute, (req, res) => {
  res.json({ message: "Welcome Admin!" });
});

export default router;
