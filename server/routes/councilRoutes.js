import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';
import CouncilMember from '../models/CouncilMember.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Get all council members
// @route   GET /api/council
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { active } = req.query;
    let query = {};
    
    if (active === 'true') {
      query.isActive = true;
    }
    
    const members = await CouncilMember.find(query).sort('order name');
    res.json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get single council member
// @route   GET /api/council/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const member = await CouncilMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Council member not found'
      });
    }
    
    res.json({
      success: true,
      data: member
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Create new council member
// @route   POST /api/council
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('image'),
  async (req, res, next) => {
    try {
      const { name, role, bio, email, socialLinks, isActive, order } = req.body;
      
      let imageUrl = '';
      
      // Upload image to Cloudinary if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/council'
        });
        imageUrl = result.secure_url;
      }
      
      const member = await CouncilMember.create({
        name,
        role,
        bio,
        email,
        image: imageUrl,
        socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
        isActive: isActive === 'true',
        order: order || 0
      });
      
      res.status(201).json({
        success: true,
        data: member
      });
    } catch (err) {
      next(err);
    }
  }
);

// @desc    Update council member
// @route   PUT /api/council/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('image'),
  async (req, res, next) => {
    try {
      const { name, role, bio, email, socialLinks, isActive, order } = req.body;
      
      let updateData = {
        name,
        role,
        bio,
        email,
        socialLinks: socialLinks ? JSON.parse(socialLinks) : {},
        isActive: isActive === 'true',
        order: order || 0
      };
      
      // Upload new image if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/council'
        });
        updateData.image = result.secure_url;
      }
      
      const member = await CouncilMember.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!member) {
        return res.status(404).json({
          success: false,
          error: 'Council member not found'
        });
      }
      
      res.json({
        success: true,
        data: member
      });
    } catch (err) {
      next(err);
    }
  }
);

// @desc    Delete council member
// @route   DELETE /api/council/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const member = await CouncilMember.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Council member not found'
      });
    }
    
    // Delete image from Cloudinary if it exists
    if (member.image) {
      const publicId = member.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`bytezen/council/${publicId}`);
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Reorder council members
// @route   PUT /api/council/reorder
// @access  Private/Admin
router.put('/reorder', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { orderedIds } = req.body;
    
    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid orderedIds array'
      });
    }
    
    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id },
        update: { $set: { order: index } }
      }
    }));
    
    await CouncilMember.bulkWrite(bulkOps);
    
    const members = await CouncilMember.find().sort('order name');
    
    res.json({
      success: true,
      data: members
    });
  } catch (err) {
    next(err);
  }
});

export default router;
