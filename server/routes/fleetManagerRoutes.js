import express from "express";
import {
  registerFleetManager,
  getMe,
} from "../controllers/fleetManagerController.js";
import {
  createBus,
  getMyBuses,
  deleteBus,
  getBusesForSetup
} from "../controllers/busController.js";
import {
  createDriver,
  getMyDrivers,
  updateDriver,
  deleteDriver,
} from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerFleetManager);
router.get("/me", protect, getMe);

// Bus Routes
router.post("/buses", protect, createBus);
router.get("/buses", protect, getMyBuses);
router.delete("/buses/:id", protect, deleteBus);
router.post("/setup/buses", getBusesForSetup);

//Driver Routes
router.post("/drivers", protect, createDriver); 
router.get("/drivers", protect, getMyDrivers);
router.put("/drivers/:id", protect, updateDriver);
router.delete("/drivers/:id", protect, deleteDriver);

export default router;
