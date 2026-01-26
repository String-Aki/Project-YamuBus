import mongoose from "mongoose";
const { Schema } = mongoose;
const fleetManagerSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    organizationName: {
      type: String,
      required: true,
      trim: true,
    },
    operatorType: {
      type: String,
      enum: ["private", "sltb"],
      default: "private",
    },
    contactEmail: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    nicNumber: {
      type: String,
      required: true,
      unique: true,
    },
    nicFrontImage: {
      type: String,
      required: true,
    },
    nicBackImage: {
      type: String,
      required: true,
    },
    firebaseUID: {
      type: String,
      required: true,
      unique: true,
    },
    verificationDocument: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

const FleetManager = mongoose.model("FleetManager", fleetManagerSchema);
export default FleetManager;
