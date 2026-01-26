import asyncHandler from "express-async-handler";
import SuperAdmin from "../models/SuperAdmin.js";
import FleetManager from "../models/fleetmanager.js";
import generateToken from "../utils/generateToken.js"; 

// @desc Auth Admin & Get Token
// @route POST /api/admin/login
const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await SuperAdmin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
        res.json({
            _id: admin._id,
            email: admin.email,
            role: admin.role,
            token: generateToken(admin._id),
        });
    } else {
        res.status(401);
        throw new Error("Invalid Admin Credentials");
    }
});

// @desc Get All Fleet Managers
// @route GET /api/admin/managers
const getManagers = asyncHandler(async (req, res) => {
    const managers = await FleetManager.find({}).select("-password");
    res.json(managers);
});

// @desc Approve or Reject Manager
// @route PUT /api/admin/managers/:id/status
const updateManagerStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const manager = await FleetManager.findById(req.params.id);

    if (manager) {
        manager.status = status;
        await manager.save();
        res.json({ message: `Manager marked as ${status}`, manager });
    } else {
        res.status(404);
        throw new Error("Manager not found");
    }
});

export { loginAdmin, getManagers, updateManagerStatus };