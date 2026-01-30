import asyncHandler from "express-async-handler";
import Route from "../models/route.js";

// @desc    Create a new Route
// @route   POST /api/routes
const createRoute = asyncHandler(async (req, res) => {
  const { routeNumber, routeName, stops, path, color } = req.body;

  const routeExists = await Route.findOne({ routeNumber });
  if (routeExists) {
    res.status(400);
    throw new Error("Route number already exists");
  }

  const route = await Route.create({ routeNumber, routeName, stops, path, color });
  res.status(201).json(route);
});

// @desc    Get All Routes
// @route   GET /api/routes
const getRoutes = asyncHandler(async (req, res) => {
  const routes = await Route.find({});
  res.json(routes);
});

// @desc    Delete Route
// @route   DELETE /api/routes/:id
const deleteRoute = asyncHandler(async (req, res) => {
  const route = await Route.findById(req.params.id);
  if (route) {
    await route.deleteOne();
    res.json({ message: "Route removed" });
  } else {
    res.status(404);
    throw new Error("Route not found");
  }
});

export { createRoute, getRoutes, deleteRoute };