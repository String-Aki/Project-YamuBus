import mongoose from 'mongoose';

const tripSchema = mongoose.Schema(
  {
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Driver',
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Bus',
    },
    route: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['active', 'completed'],
      default: 'active',
    },
    startTime: {
      type: Date,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    locations: [
      {
        lat: Number,
        lng: Number,
        timestamp: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true,
  }
);

const Trip = mongoose.model('Trip', tripSchema);

export default Trip;