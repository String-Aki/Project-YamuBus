import express from "express";
import {
  registerFleetManager,
  getMe,
} from "../controllers/fleetManagerController.js";
import {
  createBus,
  getMyBuses,
  deleteBus,
  getBusesForSetup,
} from "../controllers/busController.js";
import {
  createDriver,
  getMyDrivers,
  updateDriver,
  deleteDriver,
} from "../controllers/driverController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload, processCloudinaryUploads } from "../config/cloudinary.js";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "nicFrontImage", maxCount: 1 },
    { name: "nicBackImage", maxCount: 1 },
    { name: "verificationDocument", maxCount: 1 },
  ]),
  processCloudinaryUploads([
    "nicFrontImage",
    "nicBackImage",
    "verificationDocument",
  ]),
  registerFleetManager,
);
router.get("/me", protect, getMe);

// Bus Routes
router.post(
  "/buses",
  protect,
  upload.fields([
    { name: "registrationCertificate", maxCount: 1 },
    { name: "routePermit", maxCount: 1 },
  ]),
  processCloudinaryUploads(["registrationCertificate", "routePermit"]),
  createBus,
);
router.get("/buses", protect, getMyBuses);
router.delete("/buses/:id", protect, deleteBus);
router.post("/setup/buses", getBusesForSetup);

//Driver Routes
router.post("/drivers", protect, createDriver);
router.get("/drivers", protect, getMyDrivers);
router.put("/drivers/:id", protect, updateDriver);
router.delete("/drivers/:id", protect, deleteDriver);

export default router;
