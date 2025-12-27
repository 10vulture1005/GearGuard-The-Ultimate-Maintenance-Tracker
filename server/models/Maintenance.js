import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  subject: { type: String, required: true }, // e.g., "Leaking Oil"
  
  // Who created it
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Target Asset
  maintenanceFor: { type: String, enum: ['Equipment', 'Work Center'], default: 'Equipment' },
  equipment: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Equipment' 
  },
  workCentre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'WorkCentre'
  },
  
  // Assignment
  maintenanceTeam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team' 
  },
  technician: { 
    type: String 
  },
  
  // Workflow
  requestDate: { type: Date, default: Date.now },
  scheduledDate: { type: Date }, // For Preventive
  durationHours: { type: Number }, // Actual time spent
  
  maintenanceType: { 
    type: String, 
    enum: ['Corrective', 'Preventive'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Medium' 
  },
  status: { 
    type: String, 
    enum: ['New Request', 'In Progress', 'Repaired', 'Scrap', 'Blocked', 'Ready for Next Stage'], 
    default: 'New Request' 
  },
  
  notes: { type: String },
  instructions: { type: String },
  company: { type: String }
}, { timestamps: true });

export const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
