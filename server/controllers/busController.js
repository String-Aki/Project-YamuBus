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

// @desc    Update bus details (Plate or Route)
// @route   PUT /api/fleetmanagers/buses/:id
// @access  Private
const updateBus = asyncHandler(async (req, res) => {
  const bus = await Bus.findById(req.params.id);

  if (!bus) {
    res.status(404);
    throw new Error("Bus not found");
  }

  if (bus.fleetManager.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized");
  }

  bus.licensePlate = req.body.licensePlate || bus.licensePlate;
  bus.route = req.body.route || bus.route;

  const updatedBus = await bus.save();
  res.status(200).json(updatedBus);
});

// @desc    Delete a bus
// @route   DELETE /api/fleetmanagers/buses/:id
// @access  Private
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

export { createBus, getMyBuses, updateBus, deleteBus };
