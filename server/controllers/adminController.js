import asyncHandler from "express-async-handler";
import SuperAdmin from "../models/SuperAdmin.js";
import FleetManager from "../models/fleetmanager.js";
import Bus from "../models/bus.js";
import Driver from "../models/driver.js";
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

// @desc Get Admin Dashboard (Stats + Pending Items)
// @route GET /api/admin/dashboard
// @access Private
const getAdminDashboard = asyncHandler(async (req, res) => {
  const stats = {
    totalManagers: await FleetManager.countDocuments({ status: "approved" }),
    pendingManagers: await FleetManager.countDocuments({ status: "pending" }),
    totalBuses: await Bus.countDocuments({ verificationStatus: "verified" }),
    pendingBuses: await Bus.countDocuments({ verificationStatus: "pending" }),
  };

  const pendingManagers = await FleetManager.find({ status: "pending" }).sort({
    createdAt: -1,
  });

  const allPendingBuses = await Bus.find({ verificationStatus: "pending" })
    .populate(
      "fleetManager",
      "organizationName contactPhone status nicNumber email nicFrontImage nicBackImage verificationDocument",
    )
    .sort({ createdAt: -1 });

  const pendingBuses = allPendingBuses.filter(
    (bus) => bus.fleetManager && bus.fleetManager.status === "approved",
  );

  res.json({ stats, pendingManagers, pendingBuses });
});

// @desc Get ALL Verified Fleet Managers
// @route GET /api/admin/managers
// @access Private
const getAllManagers = asyncHandler(async (req, res) => {
  const managers = await FleetManager.find({ status: "approved" })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(managers);
});

// @desc Get Buses and Drivers for a specific Manager
// @route GET /api/admin/managers/:id/assets
// @access Private
const getManagerAssets = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const [buses, drivers] = await Promise.all([
    Bus.find({ fleetManager: id }).sort({ createdAt: -1 }),
    Driver.find({ fleetManager: id }).sort({ createdAt: -1 }),
  ]);

  res.json({ buses, drivers });
});

// @desc Approve or Reject a Fleet Manager
// @route PATCH /api/admin/managers/:id/status
// @access Private
const updateManagerStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const manager = await FleetManager.findById(req.params.id);
  if (!manager) {
    res.status(404);
    throw new Error("Manager not found");
  }

  manager.status = status;
  await manager.save();

  res.json({ message: `Manager ${status}`, id: manager._id });
});

// @desc Verify or Reject a Bus & Assign Route
// @route PATCH /api/admin/buses/:id/verify
// @access Private
const updateBusVerification = asyncHandler(async (req, res) => {
  const { status, routeId } = req.body;

  const bus = await Bus.findById(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  if (status === "verified" && routeId) {
    bus.routeId = routeId;
  }

  bus.verificationStatus = status;
  await bus.save();

  res.json({ message: `Bus ${status}`, id: bus._id });
});

// @desc Update Bus Route or Status (Ban/Unban)
// @route PATCH /api/admin/buses/:id
// @access Private
const updateBus = asyncHandler(async (req, res) => {
  const { route, verificationStatus } = req.body;
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  if (route) bus.route = route;
  if (verificationStatus) bus.verificationStatus = verificationStatus;

  await bus.save();
  res.json(bus);
});

// @desc Delete a Fleet Manager and ALL their assets (Cascading Delete)
// @route DELETE /api/admin/managers/:id
// @access Private
const deleteManager = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await Driver.deleteMany({ fleetManager: id });
  await Bus.deleteMany({ fleetManager: id });

  const manager = await FleetManager.findByIdAndDelete(id);

  if (!manager) {
    res.status(404);
    throw new Error("Manager not found");
  }

  res.json({
    message: "Manager and all associated assets deleted successfully",
  });
});

// @desc Delete a specific Bus (Admin Override)
// @route DELETE /api/admin/buses/:id
// @access Private
const deleteBusAdmin = asyncHandler(async (req, res) => {
  const bus = await Bus.findByIdAndDelete(req.params.id);
  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }
  res.json({ message: "Bus deleted" });
});

// @desc Delete a specific Driver (Admin Override)
// @route DELETE /api/admin/drivers/:id
// @access Private
const deleteDriverAdmin = asyncHandler(async (req, res) => {
  const driver = await Driver.findByIdAndDelete(req.params.id);
  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }
  res.json({ message: "Driver deleted" });
});

export {
  loginAdmin,
  getAdminDashboard,
  getAllManagers,
  getManagerAssets,
  updateManagerStatus,
  updateBusVerification,
  updateBus,
  deleteManager,
  deleteBusAdmin,
  deleteDriverAdmin,
};
