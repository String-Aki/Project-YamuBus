import mongoose from "mongoose";
import FleetManager from "./fleetmanager";
const { Schema } = mongoose;

const pointSchema = new Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

const routeSchema = new Schema({
    routeNumber: {
        type: String,
        required: true,
        trim: true,
    },
    routeName: {
        type: String,
        required: true,
        trim: true,
    },
    fleetManager: {
        type: Schema.Types.ObjectId,
        ref: 'FleetManager',
        required: true
    },
    stops: [
        {
        type: String,
        trim: true,
        }
    ],
    path: [pointSchema],
},
    {
        timestamps:true
    }
);

const Route = mongoose.model('Route', routeSchema);
export default Route;