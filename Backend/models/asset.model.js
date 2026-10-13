import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema({
  assetId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  fileUrl: { type: String, required: true }, // Stores the file URL or file path
  createdAt: { type: Date, default: Date.now }
});

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;

