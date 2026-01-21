import asyncHandler from 'express-async-handler';
import Driver from '../models/driver.js';

// @desc    Register a new driver
// @route   POST /api/fleetmanagers/drivers
// @access  Private
const createDriver = asyncHandler(async (req, res) => {
    const { name, licenseNumber, phone, username, password } = req.body;

    if(!name || !licenseNumber || !phone || !username || !password){
        res.status(400);
        throw new Error('Please fill all fields');
    }

    // 1. Check if username is taken
    const driverExists = await Driver.findOne({ username });
    if(driverExists) {
        res.status(400);
        throw new Error('Username already taken. Please choose another.');
    }

    // 2. Create Driver linked to YOU
    const driver = await Driver.create({
        fleetManager: req.user._id,
        name,
        licenseNumber,
        phone,
        username,
        password 
    });

    if(driver) {
        res.status(201).json({
            _id: driver._id,
            name: driver.name,
            username: driver.username
        });
    } else {
        res.status(400);
        throw new Error('Invalid driver data');
    }
});

// @desc    Get all my drivers
// @route   GET /api/fleetmanagers/drivers
// @access  Private
const getMyDrivers = asyncHandler(async (req, res) => {
    const drivers = await Driver.find({ fleetManager: req.user._id }).select('-password'); // Don't send password back
    res.status(200).json(drivers);
});

// @desc    Delete a driver
// @route   DELETE /api/fleetmanagers/drivers/:id
// @access  Private
const deleteDriver = asyncHandler(async (req, res) => {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
        res.status(404);
        throw new Error("Driver not found");
    }

    // Security: Ensure you own this driver
    if (driver.fleetManager.toString() !== req.user.id) {
        res.status(401);
        throw new Error("Not authorized");
    }

    await driver.deleteOne();
    res.status(200).json({ id: req.params.id });
});

export { createDriver, getMyDrivers, deleteDriver };