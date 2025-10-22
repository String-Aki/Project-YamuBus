import mongoose from "mongoose";
import FleetManager from "./fleetmanager";
const { Schema } = mongoose;
const driverSchema = new Schema(
    {
        fullName: {
            type: String,
            required: true,
            unique: true
        },
        firebaseUID: {
            type: String,
            required: true,
            unique: true
        },
        FleetManager: {
            type: Schema.Types.ObjectId,
            ref: 'FleetManager',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;