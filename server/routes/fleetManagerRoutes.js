import express from "express";
import { registerFleetManager, getMe } from "../controllers/fleetManagerController.js";
import { createBus, getMyBuses } from "../controllers/busController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerFleetManager);
router.get("/me", protect, getMe);

router.post("/buses", protect ,createBus);
router.get("buses", protect ,getMyBuses)

export default router;
