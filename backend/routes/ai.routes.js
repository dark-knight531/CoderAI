import express from "express";
import {getReview , getHistory} from "../controller/ai.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();


router.post("/review", verifyJWT, getReview);
router.get("/history", verifyJWT, getHistory);

export default router;