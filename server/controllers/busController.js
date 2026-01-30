import asyncHandler from "express-async-handler";
import admin from "../config/firebaseAdmin.js";
import Bus from "../models/bus.js";
import FleetManager from "../models/fleetmanager.js";

// @desc Add a new bus
// @route POST /api/fleetmanagers/buses
// @access Private
const createBus = asyncHandler(async (req, res) => {
  if (req.user.status !== "approved") {
    res.status(403);
    throw new Error("Account pending approval. You cannot add buses yet.");
  }
  const { plateNumber, route, registrationCertificate, routePermit } = req.body;

  if (!plateNumber || !route || !registrationCertificate || !routePermit) {
    res.status(400);
    throw new Error("Please upload all required bus documents.");
  }

  const fleetManager = req.user;

  const busExists = await Bus.findOne({ plateNumber });
  if (busExists) {
    res.status(400);
    throw new Error("Bus with this license plate already exists");
  }

  const bus = await Bus.create({
    fleetManager: fleetManager._id,
    plateNumber,
    route: route,
    registrationCertificate,
    routePermit,
    verificationStatus: "pending",
    isActive: false,
  });

  res.status(201).json(bus);
});

// @desc Get all buses for the logged-in Fleet Manager
// @route GET /api/fleetmanager/buses
// @access Private
const getMyBuses = asyncHandler(async (req, res) => {
  const buses = await Bus.find({ fleetManager: req.user._id }).sort({ createdAt: -1 });
  res.status(200).json(buses);
});

// @desc Delete a bus
// @route DELETE /api/fleetmanagers/buses/:id
// @access Private
const deleteBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  if (bus.fleetManager.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  await bus.deleteOne();
  res.status(200).json({ id: req.params.id });
});

// @desc Get buses for device setup
// @route POST /api/fleetmanagers/setup/buses
// @access Public
const getBusesForSetup = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(401);
    throw new Error("No token provided");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const email = decodedToken.email;

    const manager = await FleetManager.findOne({ contactEmail: email });
    if (!manager) {
      res.status(404);
      throw new Error("Manager not found in database");
    }

    const buses = await Bus.find({ fleetManager: manager._id, verificationStatus: 'verified' 
    }).select(
      "plateNumber _id route",
    );

    res.json(buses);
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    res.status(401);
    throw new Error("Invalid or Expired Token");
  }
});

// @desc Get Bus Details with Route Path (Public)
// @route GET /api/buses/:id
// @access Public
const getBusById = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id)
    .populate('routeId')
    .select('-registrationCertificate -routePermit -fleetManager');

  if (bus) {
    res.json(bus);
  } else {
    res.status(404);
    throw new Error("Bus not found");
  }
});

export { createBus, getMyBuses, deleteBus, getBusesForSetup, getBusById };
