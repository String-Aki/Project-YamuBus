import asyncHandler from "express-async-handler";
import FleetManager from "../models/fleetmanager.js";

const registerFleetManager = asyncHandler(async (req, res) => {
  const { fullName, contactEmail, companyName, contactPhone, nicNumber, nicFrontImage, nicBackImage, firebaseUID } = req.body;

  if (!fullName || !companyName || !contactEmail || !contactPhone || !firebaseUID || !nicNumber || !nicFrontImage || !nicBackImage) {
    res.status(400);
    throw new Error("Please Provide All Required Fields");
  }

  const emailExists = await FleetManager.findOne({ contactEmail });
  const uidExists = await FleetManager.findOne({ firebaseUID });
  const nicExists = await FleetManager.findOne({ nicNumber });

  if (emailExists || uidExists || nicExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const fleetManager = await FleetManager.create({
    fullName,
    companyName,
    contactEmail,
    contactPhone,
    nicNumber,
    nicFrontImage,
    nicBackImage,
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

// @desc Get current fleet manager data
// @route Get /api/fleetmanagers/me
// @acces Private

const getMe = asyncHandler(async(req, res) =>{
  res.status(200).json(req.user);
});

export { registerFleetManager, getMe };
