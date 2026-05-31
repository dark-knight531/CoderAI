import generateResponse from "../src/services/ai.service.js";
import Review from "../models/review.model.js"; 
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// --- 1. POST ROUTE: Generate Review & Save to History ---
export const getReview = asyncHandler(async (req, res) => {
    const { code, language, prompt } = req.body;
    const userId = req.user?._id || req.user?.id; 

    if (!code || code.trim() === '') {
        throw new ApiError(400, "Please provide a code snippet for the AI to review.");
    }

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID is missing.");
    }

    let finalAIPrompt = `Here is my ${language || 'programming'} code:\n\n${code}`;
    
    if (prompt && prompt.trim() !== '') {
        finalAIPrompt += `\n\nSpecific Request from the user: "${prompt}"\n\nPlease prioritize answering this specific request in your review.`;
    }

    const aiResponseData = await generateResponse(finalAIPrompt);

    if (!aiResponseData.success) {
        throw new ApiError(500, aiResponseData.message || "AI service failed to generate a response.");
    }

    const aiFeedbackText = aiResponseData.data; 

    const savedReview = await Review.create({
        userId,
        language: language || "javascript",
        promptCode: code, 
        aiResponse: aiFeedbackText
    });

    if (!savedReview) {
        throw new ApiError(500, "AI responded, but failed to save the review to history.");
    }

    return res.status(200).json(
        new ApiResponse(200, { review: aiFeedbackText, ...savedReview._doc }, "Code reviewed successfully")
    );
});

// --- 2. GET ROUTE: Fetch History for the Sidebar ---
export const getHistory = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized: User ID is missing.");
    }

    // Fetch from DB, newest first
    const history = await Review.find({ userId }).sort({ createdAt: -1 });

    // Send directly as the data payload
    return res.status(200).json(
        new ApiResponse(200, history, "History fetched successfully")
    );
});

// Export both just in case your routes file imports them differently
export default { getReview, getHistory };