import mongoose from 'mongoose';

const workCentreSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  tag: { type: String },
  alternativeWorkcenters: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'WorkCentre' 
  }],
  costPerHour: { type: Number, default: 0 },
  capacity: { type: Number, default: 1.0 },
  timeEfficiency: { type: Number, default: 100.0 },
  oeeTarget: { type: Number, default: 0 }
}, { timestamps: true });

export const WorkCentre = mongoose.model('WorkCentre', workCentreSchema);
