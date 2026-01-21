import express from "express";
import {
  registerFleetManager,
  getMe,
} from "../controllers/fleetManagerController.js";
import {
  createBus,
  getMyBuses,
  updateBus,
  deleteBus,
} from "../controllers/busController.js";
import {
  createDriver,
  getMyDrivers,
  deleteDriver,
} from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerFleetManager);
router.get("/me", protect, getMe);

// Bus Routes
router.post("/buses", protect, createBus);
router.get("/buses", protect, getMyBuses);
router.put("/buses/:id", protect, updateBus);
router.delete("/buses/:id", protect, deleteBus);

//Driver Routes
router.post("/drivers", protect, createDriver); // Add Driver
router.get("/drivers", protect, getMyDrivers); // List Drivers
router.delete("/drivers/:id", protect, deleteDriver); // Delete Driver

export default router;
