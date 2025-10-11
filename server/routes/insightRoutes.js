import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';
import Insight from '../models/Insight.js';
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

// @desc    Get all insights
// @route   GET /api/insights
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, published } = req.query;
    const query = {};
    
    if (published === 'true') {
      query.isPublished = true;
    }
    
    const insights = await Insight.find(query)
      .sort('-date')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('author', 'name')
      .lean();

    const count = await Insight.countDocuments(query);

    res.json({
      success: true,
      data: insights,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get single insight
// @route   GET /api/insights/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const insight = await Insight.findById(req.params.id)
      .populate('author', 'name email')
      .lean();

    if (!insight) {
      return res.status(404).json({
        success: false,
        error: 'Insight not found'
      });
    }

    // Increment view count if published and not an admin
    if (insight.isPublished && !req.user?.role === 'admin') {
      await Insight.findByIdAndUpdate(req.params.id, { $inc: { viewCount: 1 } });
    }

    res.json({
      success: true,
      data: insight
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Create new insight
// @route   POST /api/insights
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('thumbnail'),
  async (req, res, next) => {
    try {
      const { title, content, isPublished, tags } = req.body;
      
      let thumbnailUrl = '';
      
      // Upload thumbnail to Cloudinary if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/insights/thumbnails'
        });
        thumbnailUrl = result.secure_url;
      }
      
      const insight = await Insight.create({
        title,
        content,
        author: req.user.id,
        thumbnailUrl,
        isPublished: isPublished === 'true',
        tags: tags ? JSON.parse(tags) : []
      });
      
      res.status(201).json({
        success: true,
        data: insight
      });
    } catch (err) {
      next(err);
    }
  }
);

// @desc    Update insight
// @route   PUT /api/insights/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('thumbnail'),
  async (req, res, next) => {
    try {
      const { title, content, isPublished, tags } = req.body;
      
      let updateData = {
        title,
        content,
        isPublished: isPublished === 'true',
        tags: tags ? JSON.parse(tags) : []
      };
      
      // Upload new thumbnail if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/insights/thumbnails'
        });
        updateData.thumbnailUrl = result.secure_url;
      }
      
      const insight = await Insight.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!insight) {
        return res.status(404).json({
          success: false,
          error: 'Insight not found'
        });
      }
      
      res.json({
        success: true,
        data: insight
      });
    } catch (err) {
      next(err);
    }
  }
);

// @desc    Delete insight
// @route   DELETE /api/insights/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const insight = await Insight.findByIdAndDelete(req.params.id);
    
    if (!insight) {
      return res.status(404).json({
        success: false,
        error: 'Insight not found'
      });
    }
    
    // Delete thumbnail from Cloudinary if it exists
    if (insight.thumbnailUrl) {
      const publicId = insight.thumbnailUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`bytezen/insights/thumbnails/${publicId}`);
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

export default router;
