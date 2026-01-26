import Driver from "../models/driver.js";
import Trip from "../models/trip.js";
import Bus from "../models/bus.js";
import asyncHandler from "express-async-handler";
import generateToken from "../utils/generateToken.js";

// @desc Register a new driver
// @route POST /api/fleetmanagers/drivers
// @access Private
const createDriver = asyncHandler(async (req, res) => {

  if (req.user.status !== 'approved') {
        res.status(403);
        throw new Error("Account pending approval. You cannot add drivers yet.");
    }

  const { name, licenseNumber, phone, username, password } = req.body;

  if (!name || !licenseNumber || !phone || !username || !password) {
    res.status(400);
    throw new Error("Please fill all fields");
  }

  const driverExists = await Driver.findOne({ username });
  if (driverExists) {
    res.status(400);
    throw new Error("Username already taken. Please choose another.");
  }

  const driver = await Driver.create({
    fleetManager: req.user._id,
    name,
    licenseNumber,
    phone,
    username,
    password,
  });

  if (driver) {
    res.status(201).json({
      _id: driver._id,
      name: driver.name,
      username: driver.username,
      licenseNumber: driver.licenseNumber,
      phone: driver.phone,
    });
  } else {
    res.status(400);
    throw new Error("Invalid driver data");
  }
});

// @desc Get all my drivers
// @route GET /api/fleetmanagers/drivers
// @access Private
const getMyDrivers = asyncHandler(async (req, res) => {
  const drivers = await Driver.find({ fleetManager: req.user._id }).select(
    "-password",
  );
  res.status(200).json(drivers);
});

// @desc Update driver details
// @route PUT /api/fleetmanagers/drivers/:id
// @access Private
const updateDriver = asyncHandler(async (req, res) => {
  const { name, licenseNumber, phone } = req.body;
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  if (driver.fleetManager.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  driver.name = name || driver.name;
  driver.licenseNumber = licenseNumber || driver.licenseNumber;
  driver.phone = phone || driver.phone;

  const updatedDriver = await driver.save();

  res.json({
    _id: updatedDriver._id,
    name: updatedDriver.name,
    username: updatedDriver.username,
    licenseNumber: updatedDriver.licenseNumber,
    phone: updatedDriver.phone,
  });
});

// @desc Delete a driver
// @route DELETE /api/fleetmanagers/drivers/:id
// @access Private
const deleteDriver = asyncHandler(async (req, res) => {
  const driver = await Driver.findById(req.params.id);

  if (!driver) {
    res.status(404);
    throw new Error("Driver not found");
  }

  if (driver.fleetManager.toString() !== req.user.id) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await driver.deleteOne();
  res.status(200).json({ id: req.params.id });
});

// @desc Auth Driver & get token
// @route POST /api/drivers/login
// @access Public
const loginDriver = asyncHandler(async (req, res) => {
  const { username, password, busId } = req.body; 

  if (!busId) {
      res.status(400);
      throw new Error('Device Error: No Bus ID found. Please re-bind device.');
  }

  const bus = await Bus.findById(busId);
  if (!bus) {
      res.status(404);
      throw new Error('Bus not found');
  }

  const driver = await Driver.findOne({ username });

  if (driver && (await driver.matchPassword(password))) {

    if (driver.status === 'inactive') {
        res.status(401);
        throw new Error('Driver account is inactive');
    }

    if (driver.fleetManager.toString() !== bus.fleetManager.toString()) {
        res.status(403);
        throw new Error('SECURITY ALERT: You are not authorized to operate this bus.');
    }

    const activeTrip = await Trip.findOne({ 
        driver: driver._id, 
        status: 'active' 
    }).populate('bus', 'licensePlate');

    if (activeTrip && activeTrip.bus._id.toString() !== busId) {
         res.status(400);
         throw new Error(`You have an active trip on another bus (${activeTrip.bus.licensePlate}). End that first.`);
    }

    if (activeTrip) {
        res.status(400);
        throw new Error(`You are already active on this bus. Resume your trip.`);
    }

    res.json({
      _id: driver._id,
      name: driver.name,
      username: driver.username,
      fleetManager: driver.fleetManager,
      token: generateToken(driver._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

export { createDriver, getMyDrivers, deleteDriver, updateDriver, loginDriver };
