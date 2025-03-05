// // import jwt from "jsonwebtoken";
// // import User from "../models/user.model.js";

// // export const protectRoute = async (req, res, next) => {
// // 	try {
// // 		const accessToken = req.cookies.accessToken;

// // 		if (!accessToken) {
// // 			return res.status(401).json({ message: "Unauthorized - No access token provided" });
// // 		}

// // 		try {
// // 			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
// // 			const user = await User.findById(decoded.userId).select("-password");

// // 			if (!user) {
// // 				return res.status(401).json({ message: "User not found" });
// // 			}

// // 			req.user = user;

// // 			next();
// // 		} catch (error) {
// // 			if (error.name === "TokenExpiredError") {
// // 				return res.status(401).json({ message: "Unauthorized - Access token expired" });
// // 			}
// // 			throw error;
// // 		}
// // 	} catch (error) {
// // 		console.log("Error in protectRoute middleware", error.message);
// // 		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
// // 	}
// // };

// // export const adminRoute = (req, res, next) => {
// // 	if (req.user && req.user.role === "admin") {
// // 		next();
// // 	} else {
// // 		return res.status(403).json({ message: "Access denied - Admin only" });
// // 	}
// // };
// import jwt from "jsonwebtoken";
// import User from "../models/user.model.js";

// export const protectRoute = async (req, res, next) => {
// 	try {
// 		const accessToken = req.cookies.accessToken;

// 		if (!accessToken) {
// 			return res.status(401).json({ message: "Unauthorized - No access token provided" });
// 		}

// 		try {
// 			const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
// 			const user = await User.findById(decoded.userId).select("-password");

// 			if (!user) {
// 				return res.status(401).json({ message: "User  not found" });
// 			}

// 			req.user = user;

// 			next();
// 		} catch (error) {
// 			if (error.name === "TokenExpiredError") {
// 				return res.status(401).json({ message: "Unauthorized - Access token expired" });
// 			}
// 			throw error;
// 		}
// 	} catch (error) {
// 		console.log("Error in protectRoute middleware", error.message);
// 		return res.status(401).json({ message: "Unauthorized - Invalid access token" });
// 	}
// };

// export const adminRoute = (req, res, next) => {
// 	if (req.user && req.user.role === "admin") {
// 		next();
// 	} else {
// 		return res.status(403).json({ message: "Access denied - Admin only" });
// 	}
// };

// export const checkRefreshToken = async (req, res, next) => {
// 	const refreshToken = req.cookies.refreshToken;
// 	if (!refreshToken) return res.status(403).json({ message: "Refresh token not found" });

// 	const user = await User.findOne({ refreshToken });
// 	if (!user) return res.status(403).json({ message: "Invalid refresh token" });

// 	req.user = user;
// 	next();
// };





import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to protect routes by verifying the access token
export const protectRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken || req.headers["authorization"];

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized - No access token provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Unauthorized - Access token expired" });
      }
      throw error;
    }
  } catch (error) {
    console.log("Error in protectRoute middleware", error.message);
    return res.status(401).json({ message: "Unauthorized - Invalid access token" });
  }
};

// Middleware to allow only admin users
export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
};

// Middleware to verify the refresh token
export const checkRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.status(403).json({ message: "Refresh token not found" });

  const user = await User.findOne({ refreshToken });
  if (!user) return res.status(403).json({ message: "Invalid refresh token" });

  req.user = user;
  next();
};

// Middleware to verify the access token for API routes
export const verifyToken = async (req, res, next) => {
  try {

    console.log(req.headers);

    const token = req.headers["authorization"];

    console.log("Token", token);

    if (!token) {
      return res.status(403).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    console.log("Error in verifyToken middleware", error.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};
