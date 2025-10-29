import asyncHandler from "express-async-handler";
import Route from "../models/route.js";

const createRoute = asyncHandler(async (req, res) => {
  const { routeNumber, routeName, stops } = req.body;

  if (!routeNumber || !routeName) {
    res.status(404);
    throw new Error("Please provide route number and name");
  }

  const fleetManager = req.user;

  const route = await Route.create({
    routeNumber,
    routeName,
    stops,
    fleetManager: fleetManager._id,
  });

  res.status(201).json(route);
});

export { createRoute };
