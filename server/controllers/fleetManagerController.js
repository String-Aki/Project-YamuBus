import asyncHandler from "express-async-handler";
import FleetManager from "../models/fleetmanager.js";

const registerFleetManager = asyncHandler(async (req, res) => {
  const { companyName, contactEmail, contactPhone, firebaseUID } = req.body;

  if (!companyName || !contactEmail || !contactPhone || !firebaseUID) {
    res.status(400);
    throw new Error("Please Provide All Required Fields");
  }

  const emailExists = await FleetManager.findOne({ contactEmail });
  const uidExists = await FleetManager.findOne({ firebaseUID });

  if (emailExists || uidExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const fleetManager = await FleetManager.create({
    companyName,
    contactEmail,
    contactPhone,
    firebaseUID,
  });

  if (fleetManager) {
    res.status(201).json({
      _id: fleetManager._id,
      companyName: fleetManager.companyName,
      contactEmail: fleetManager.contactEmail,
      status: fleetManager.status,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export { registerFleetManager };
