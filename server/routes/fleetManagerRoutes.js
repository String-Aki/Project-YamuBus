import express from "express";
import { registerFleetManager, getMe } from "../controllers/fleetManagerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerFleetManager);
router.get("/me", protect, getMe);

export default router;
