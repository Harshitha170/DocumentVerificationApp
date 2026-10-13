import express from 'express';
import Asset from '../models/asset.model.js';

const router = express.Router();

// GET all published assets (used by Admin and User dashboards)
router.get('/', async (req, res) => {
  try {
    const assets = await Asset.find().sort({ createdAt: -1 });
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new asset (Admin upload)
router.post('/', async (req, res) => {
  try {
    const { assetId, title } = req.body;
    
    // If you are handling files via multer, req.file will contain the upload details
    // For now, mapping the uploaded file URL or path:
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : req.body.fileUrl;

    const newAsset = new Asset({
      assetId,
      title,
      fileUrl: fileUrl || 'https://example.com/placeholder-file.pdf'
    });

    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;