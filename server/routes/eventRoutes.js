import express from 'express';
import Event from '../models/Event.js';
import { protect, authorize } from '../middleware/auth.js';
import { fileUpload } from '../middleware/upload.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Get all events - Public access
router.get('/', async (req, res, next) => {
  try {
    const events = await Event.find().sort('-date');
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    next(err);
  }
});

// Create new event - Protected & Admin only
router.post('/', 
  protect, 
  authorize('admin'), 
  fileUpload.array('images', 10), // Max 10 images
  async (req, res, next) => {
    try {
      const { title, description, date } = req.body;
      
      // Upload images to Cloudinary
      const imageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'bytezen/events',
            resource_type: 'auto'
          });
          imageUrls.push(result.secure_url);
        }
      }

      const event = await Event.create({
        title,
        description,
        date,
        images: imageUrls,
        createdBy: req.user.id
      });

      res.status(201).json({
        success: true,
        data: event
      });
    } catch (err) {
      next(err);
    }
  }
);

// Update event - Protected & Admin only
router.put('/:id', 
  protect, 
  authorize('admin'),
  fileUpload.array('images', 10),
  async (req, res, next) => {
    try {
      let event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      // Upload new images to Cloudinary if any
      const newImageUrls = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'bytezen/events',
            resource_type: 'auto'
          });
          newImageUrls.push(result.secure_url);
        }
      }

      // Update event data
      const { title, description, date, images: existingImages = [] } = req.body;
      const images = [...existingImages, ...newImageUrls];

      event = await Event.findByIdAndUpdate(
        req.params.id,
        { title, description, date, images },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: event
      });
    } catch (err) {
      next(err);
    }
  }
);

// Delete event - Protected & Admin only
router.delete('/:id', 
  protect, 
  authorize('admin'), 
  async (req, res, next) => {
    try {
      const event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      // Delete images from Cloudinary
      if (event.images && event.images.length > 0) {
        for (const imageUrl of event.images) {
          const publicId = imageUrl.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`bytezen/events/${publicId}`);
        }
      }

      await event.remove();

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get single event - Public access
router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (err) {
    next(err);
  }
});

export default router;
