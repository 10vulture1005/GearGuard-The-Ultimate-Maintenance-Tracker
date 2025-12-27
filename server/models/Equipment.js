import mongoose from 'mongoose';

const equipmentSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  serialNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  // Link to Category
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'EquipmentCategory',
    required: true
  },
  // Dedicated Maintenance Team
  maintenanceTeam: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Team',
    required: true
  },
  // Default Technician (User)
  technician: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  // Ownership/Tracking
  department: { type: String }, // e.g., "Production"
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  
  // Technical Details
  purchaseDate: { type: Date },
  warrantyExpiration: { type: Date },
  location: { type: String }, // Physical location
  
  company: { type: String, default: 'My Company (San Francisco)' },
  
  // Status
  isScrapped: { type: Boolean, default: false }
}, { timestamps: true });

export const Equipment = mongoose.model('Equipment', equipmentSchema);
