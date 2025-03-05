
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

export const storeRefreshToken = async (userId, refreshToken) => {
	const user = await User.findById(userId);
	user.refreshToken = refreshToken; // Store refresh token in User model
	await user.save();
};

//code for ADMIN PAGE (not working properly, main function w/o admin is commented)
export const signup = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User  already exists" });
        }

        // Assign admin role if the email is admin@gmail.com
        const role = email === "admin@gmail.com" ? "admin" : "customer";

        const user = await User.create({ name, email, password, role });

        // authenticate
        const { accessToken, refreshToken } = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: error.message });
    }
};

// export const signup = async (req, res) => {
// 	const { email, password, name } = req.body;
// 	try {
// 		const userExists = await User.findOne({ email });

// 		if (userExists) {
// 			return res.status(400).json({ message: "User already exists" });
// 		}
// 		const user = await User.create({ name, email, password });

// 		// authenticate
// 		const { accessToken, refreshToken } = generateTokens(user._id);
// 		await storeRefreshToken(user._id, refreshToken);

// 		res.cookie("accessToken", accessToken, {
// 			httpOnly: true, // prevent XSS attacks
// 			secure: process.env.NODE_ENV === "production",
// 			sameSite: "strict", // prevents CSRF attacks
// 			maxAge: 15 * 60 * 1000, // 15 minutes
// 		});
// 		res.cookie("refreshToken", refreshToken, {
// 			httpOnly: true, // prevent XSS attacks
// 			secure: process.env.NODE_ENV === "production",
// 			sameSite: "strict", // prevents CSRF attacks
// 			maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
// 		});

// 		res.status(201).json({
// 			_id: user._id,
// 			name: user.name,
// 			email: user.email,
// 			role: user.role,
// 		});
// 	} catch (error) {
// 		console.log("Error in signup controller", error.message);
// 		res.status(500).json({ message: error.message });
// 	}
// };

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);

			res.cookie("accessToken", accessToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 15 * 60 * 1000,
			});
			res.cookie("refreshToken", refreshToken, {
				httpOnly: true,
				secure: process.env.NODE_ENV === "production",
				sameSite: "strict",
				maxAge: 7 * 24 * 60 * 60 * 1000,
			});

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
				accessToken,
				refreshToken,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const user = await User.findOne({ refreshToken });
			if (user) {
				user.refreshToken = null; // Clear refresh token from User model
				await user.save();
			}
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const user = await User.findById(decoded.userId);

		if (user.refreshToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};
