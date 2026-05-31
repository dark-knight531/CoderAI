import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// --- Self-contained helper that signs JWTs inline with fallback variables ---
const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(404, "User not found for token validation");
        }

        const accessToken = jwt.sign(
            {
                _id: user._id,
                email: user.email,
                username: user.username,
            },
            process.env.ACCESS_TOKEN_SECRET || "aiReviewerSuperSecretAccessTokenKey2026",
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d" }
        );

        const refreshToken = jwt.sign(
            { _id: user._id },
            process.env.REFRESH_TOKEN_SECRET || "aiReviewerSuperSecretRefreshTokenKey2026",
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d" }
        );

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("🔥 INTERNAL TOKEN GENERATION DETAILS:", error.message);
        throw new ApiError(500, "Token compilation loop failure: " + error.message);
    }
};

// Cookies for localhost; Bearer token in Authorization header is used for Vercel + Render
const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
};

// 1. REGISTER USER
const registerUser = asyncHandler(async (req, res) => {
    const { email, password, username } = req.body;

    if ([email, password, username].some((field) => !field || field.trim() === "")) {
        throw new ApiError(400, "Username, Email, and Password are required");
    }

    const existedUser = await User.findOne({ email: email.toLowerCase() });
    if (existedUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        username,
        email: email.toLowerCase(),
        password, // Note: Ensure you have a pre('save') hook in user.model.js to hash this using bcrypt!
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered successfully")
    );
});

// 2. LOGIN USER
const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            throw new ApiError(400, "Email and password are required");
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            throw new ApiError(404, "User does not exist");
        }


        // Note: Ensure you have a method named `isPasswordCorrect` defined on your User schema
        const isPasswordValid = await user.isPasswordCorrect(password);
        if (!isPasswordValid) {
            throw new ApiError(401, "Invalid user credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { user: loggedInUser, accessToken, refreshToken },
                    "User logged in successfully"
                )
            );
    } catch (error) {
        console.error("🔥 CRITICAL LOGIN CONTROLLER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error during token verification loop."
        });
    }
});

// 3. LOGOUT USER
const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user?._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );

    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
});

// 4. GET CURRENT USER
const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

// 5. REFRESH ACCESS TOKEN
const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET || "aiReviewerSuperSecretRefreshTokenKey2026"
        );

        const user = await User.findById(decodedToken?._id);

        if (!user || incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid or expired refresh token");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

        return res
            .status(200)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed"
                )
            );
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token");
    }
});

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getCurrentUser
};