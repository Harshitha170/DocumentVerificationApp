import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  image: {type: String, required:true},
  batteryType: {type:String, required: true},
  manufacturedDate: {type: Date, required: true},
  document: { type: String, required: true },
  status:{type: String, enum: ['Available', 'NotAvailable'], default: 'Available'}, 
  createdAt: { type: Date, default: Date.now }
});

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;

