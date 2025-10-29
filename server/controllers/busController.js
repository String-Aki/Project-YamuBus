import asyncHandler from 'express-async-handler';
import Bus from '../models/bus.js';
import Route from '../models/route.js';

const createBus = asyncHandler(async (req,res) => {
    
    const {licensePlate, capacity, routeId, firebaseUID } = req.body;

    if(!licensePlate || !routeId || !firebaseUID){
        res.status(400);
        throw new Error('Please provide license plate, routeId and firebaseUID');
    }

    const fleetManager = req.user;

    const route = await Route.findById(routeId);

    if(!routeId){
        res.status(404);
        throw new Error('Route not found');
    }

    if(route.fleetManager.toString() !== fleetManager._id.toString()){
        res.status(404);
        throw new Error('You are not authorized to assign a bus to this route');
    }

    const bus = await Bus.create({
        licensePlate,
        capacity,
        firebaseUID,
        fleetManager: fleetManager._id,
        route: routeId,
    })

    res.status(201).json(bus);
})

export { createBus };