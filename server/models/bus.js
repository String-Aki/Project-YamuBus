import mongoose from "mongoose";
const { Schema } = mongoose;

const busSchema = new Schema(
    {
        licensePlate: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        capacity: {
            type: Number,
            default: 52,
        },
        fleetManager: {
            type: Schema.Types.ObjectId,
            ref: 'FleetManager',
            required: true
        },
        route: {
            type: Schema.Types.ObjectId,
            ref: 'Route'
        },
        Driver: {
            type: Schema.Types.ObjectId,
            ref: 'Driver',
        },
        currentLocation: {
            lat: {
                type:Number,
            },
            lng:{
                type:Number,
            }
        },
    },
    {
        timestamps: true,
    }
);

const Bus = mongoose.model('Bus', busSchema);
export default Bus;