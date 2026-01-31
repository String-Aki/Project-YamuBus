import mongoose from "mongoose";
const { Schema } = mongoose;

const busSchema = new Schema(
  {
    fleetManager: {
      type: Schema.Types.ObjectId,
      ref: "FleetManager",
      required: true,
    },
    plateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    currentDriver: {
      type: String,
      default: null,
    },
    route: {
      type: String,
      required: true,
      trim: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: "Route",
      default: null,
    },
    registrationCertificate: {
      type: String,
      required: true,
    },
    routePermit: {
      type: String,
      required: true,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "banned"],
      default: "pending",
    },

    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
