import mongoose from 'mongoose';

const equipmentCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  responsible: { 
    type: String 
  }, 
  company: { 
    type: String,
    default: 'My Company (San Francisco)' 
  }
}, { timestamps: true });

export const EquipmentCategory = mongoose.model('EquipmentCategory', equipmentCategorySchema);
