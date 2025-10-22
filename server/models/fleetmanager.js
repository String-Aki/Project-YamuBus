import mongoose from "mongoose";
const { Schema } = mongoose;
const fleetManagerSchema = new Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
        },
        contactEmail:{
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true
        },
        contactPhone:{
            type: String,
            required: true
        },
        firebaseUID: {
            type: String,
            required: true,
            unique: true,
        },
        status:{
            type: String,
            enum: ['pending','approved','rejected'],
            default: 'pending'
        },
    },
    {
        timestamps: true,
    }
);

const FleetManager = mongoose.model('FleetManager', fleetManagerSchema);
export default FleetManager;