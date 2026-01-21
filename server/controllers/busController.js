import asyncHandler from "express-async-handler";
import Bus from "../models/bus.js";
import Route from "../models/route.js";

// @desc    Add a new bus
// @route   POST /api/fleetmanagers/buses
// @access  Private
const createBus = asyncHandler(async (req, res) => {
  const { licensePlate, route } = req.body;

  if (!licensePlate || !route) {
    res.status(400);
    throw new Error("Please provide license plate and route");
  }

  const fleetManager = req.user;

  const busExists = await Bus.findOne({ licensePlate });
  if (busExists) {
    res.status(400);
    throw new Error("Bus with this license plate already exists");
  }

  const bus = await Bus.create({
    licensePlate,
    fleetManager: fleetManager._id,
    route: route,
    status: "offline",
  });

  res.status(201).json(bus);
});

// @desc Get all buses for the logged-in Fleet Manager
// @route GET /api/fleetmanager/buses
// @access Private

const getMyBuses = asyncHandler(async (req, res) => {
  const buses = await Bus.findOne({ fleetManager: req.user._id });
  res.status(200).json(buses);
});

export { createBus, getMyBuses };
