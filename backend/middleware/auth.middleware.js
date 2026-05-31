import jwt from "jsonwebtoken";
import User from "../models/user.models.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // 1. Extract token from cookies OR safely from the Authorization header
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        
        if (!token) {
            // Utilizing ApiError instead of res.status to maintain consistency with the asyncHandler
            throw new ApiError(401, "Unauthorized request. No token found.");
        }

        // 2. Updated the fallback secret to match the AI Code Reviewer configuration
        const decodedToken = jwt.verify(
            token, 
            process.env.ACCESS_TOKEN_SECRET || "aiReviewerSuperSecretAccessTokenKey2026"
        );

        // 3. Fetch user while stripping out password and refresh token for security
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token. User not found.");
        }

        // 4. Attach the sanitized user object to the request bundle
        req.user = user;
        
        // 5. Execute next() to transfer control to your controller safely
        next();

    } catch (error) {
        console.error("🔥 Error in verifyJWT middleware:", error.message);
        throw new ApiError(401, error?.message || "Invalid access token");
    }
});