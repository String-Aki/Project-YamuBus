import express from "express";
import {
  loginAdmin,
  getAdminDashboard,
  getAllManagers,
  updateManagerStatus,
  deleteManager,
  updateBusVerification,
} from "../controllers/adminController.js";
import { protectAdmin } from "../middleware/authAdminMiddleware.js";

const router = express.Router();
router.post("/login", loginAdmin);
router.get("/dashboard", protectAdmin, getAdminDashboard);
router.get("/managers", protectAdmin ,getAllManagers);
router.patch('/managers/:id/status', protectAdmin, updateManagerStatus);
router.patch('/buses/:id/verify', protectAdmin, updateBusVerification);
router.delete('/managers/:id', protectAdmin, deleteManager);

export default router;
