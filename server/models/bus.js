import mongoose from "mongoose";
const { Schema } = mongoose;

const busSchema = new Schema(
  {
    licensePlate: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    fleetManager: {
      type: Schema.Types.ObjectId,
      ref: "FleetManager",
      required: true,
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
    status: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
  },
  {
    timestamps: true,
  },
);

const Bus = mongoose.model("Bus", busSchema);
export default Bus;
