import express from "express";
import { registerFleetManager } from "../controllers/fleetManagerController.js";

const router = express.Router();

router.post("/register", registerFleetManager);

export default router;
