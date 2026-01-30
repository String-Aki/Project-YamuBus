import mongoose from "mongoose";

const routeSchema = new mongoose.Schema({
  routeNumber: { type: String, required: true, unique: true },
  routeName: { type: String, required: true },
  
  stops: [{
    name: { type: String },
    location: { lat: Number, lng: Number }
  }],

  path: {
    type: [[Number]],
    required: true
  },
  
  color: { type: String, default: "#3b82f6" }
}, { timestamps: true });

const Route = mongoose.model("Route", routeSchema);
export default Route;