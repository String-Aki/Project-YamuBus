import Trip from '../models/trip.js';
import Bus from '../models/bus.js'; 
import asyncHandler from 'express-async-handler';

// @desc Start a new trip
// @route POST /api/trips/start
// @access Private 
const startTrip = asyncHandler(async (req, res) => {
    const { busId } = req.body;
    const driverId = req.user._id;

    const existingTrip = await Trip.findOne({ driver: driverId, status: 'active' });
    if (existingTrip) {
        res.status(400);
        throw new Error("You already have an active trip!");
    }

    const busInUse = await Trip.findOne({ bus: busId, status: 'active' });
    if (busInUse) {
         res.status(400);
         throw new Error("This bus is currently being driven by someone else!");
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
        res.status(404);
        throw new Error("Bus not found");
    }

    const trip = await Trip.create({
        driver: driverId,
        bus: busId,
        route: bus.route || "Unassigned Route",
    });

    res.status(201).json(trip);
});

// @desc End the current trip
// @route POST /api/trips/end
// @access Private
const endTrip = asyncHandler(async (req, res) => {
    const driverId = req.user._id;

    const trip = await Trip.findOne({ driver: driverId, status: 'active' });

    if (!trip) {
        res.status(404);
        throw new Error("No active trip found");
    }

    trip.status = 'completed';
    trip.endTime = Date.now();
    await trip.save();

    const io = req.app.get('io');
  if (io) {
      console.log(`📢 TRIPS: Bus ${trip.bus} went offline.`); // Remove on deployment

      io.emit('busOffline', { busId: trip.bus.toString() });
  } else {
      console.log("⚠️ Socket.io not found in request!");// Remove on deployment
  }

    res.status(200).json(trip);
});

export { startTrip, endTrip };