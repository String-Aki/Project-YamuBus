import asyncHandler from "express-async-handler";
import FleetManager from "../models/fleetmanager.js";

const registerFleetManager = asyncHandler(async (req, res) => {

  const { fullName,organizationName, operatorType, contactEmail, contactPhone, nicNumber,firebaseUID } = req.body;

  const nicFrontImage = req.files?.["nicFrontImage"]?.[0]?.path;
  const nicBackImage = req.files?.["nicBackImage"]?.[0]?.path;
  const verificationDocument = req.files?.["verificationDocument"]?.[0]?.path;

  if (!fullName || !organizationName || !contactEmail || !contactPhone || !firebaseUID || !nicNumber || !nicFrontImage || !nicBackImage || !verificationDocument) {
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
    organizationName,
    operatorType: operatorType || 'private',
    contactEmail,
    contactPhone,
    nicNumber,
    nicFrontImage,
    nicBackImage,
    verificationDocument,
    firebaseUID,
  });

  if (fleetManager) {
    res.status(201).json({
      _id: fleetManager._id,
      companyName: fleetManager.companyName,
      contactEmail: fleetManager.contactEmail,
      organizationName: fleetManager.organizationName,
      operatorType: fleetManager.operatorType,
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
  const user = {
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.contactEmail,
    organizationName: req.user.organizationName,
    status: req.user.status,
  };
  res.status(200).json(req.user);
});

export { registerFleetManager, getMe };
