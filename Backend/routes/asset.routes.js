import express from 'express';
import Asset from '../models/asset.model.js';
import upload from '../middlewares/upload.middleware.js';

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

// POST new asset (Admin upload) and Add upload.single('file') middleware here!
router.post('/', upload.fields([
  {name: 'image', maxCount: 1},
  {name: 'document', maxCount:1}
      ]), async (req, res) => {
  try {
    const { assetId, title, batteryType,manufacturedDate, status } = req.body;
    
    //  req.file and req.body are correctly parsed by multer
    const imagePath = req.files?.image ? `/uploads/${req.files.image[0].filename}` : '';
    const documentPath = req.files?.document ? `/uploads/${req.files.document[0].filename}` : '';
    const newAsset = new Asset({
      assetId,
      title,
      image: imagePath,
      batteryType,
      manufacturedDate,
      document: documentPath || 'https://example.com/placeholder-file.pdf',
      status: status || 'Available'
    });

    const savedAsset = await newAsset.save();
    res.status(201).json(savedAsset);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;