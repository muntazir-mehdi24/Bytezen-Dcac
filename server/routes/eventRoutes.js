import express from 'express';
import multer from 'multer';
import Event from '../models/Event.js';
import { protect, authorize } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

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
  upload.single('image'), // Single image for event banner
  async (req, res, next) => {
    try {
      const { 
        title, 
        description, 
        date, 
        time, 
        location, 
        eventType, 
        mode, 
        registrationLink, 
        maxParticipants, 
        isPublished 
      } = req.body;
      
      // Upload image to Cloudinary
      let imageUrl = '';
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/events',
          resource_type: 'auto'
        });
        imageUrl = result.secure_url;
      }

      const event = await Event.create({
        title,
        description,
        date,
        time,
        location,
        eventType,
        mode,
        registrationLink,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
        isPublished: isPublished === 'true' || isPublished === true,
        images: imageUrl ? [imageUrl] : [],
        createdBy: req.user._id || req.user.id
      });

      res.status(201).json({
        success: true,
        data: event
      });
    } catch (err) {
      console.error('Error creating event:', err);
      next(err);
    }
  }
);

// Update event - Protected & Admin only
router.put('/:id', 
  protect, 
  authorize('admin'),
  upload.single('image'),
  async (req, res, next) => {
    try {
      let event = await Event.findById(req.params.id);

      if (!event) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      const { 
        title, 
        description, 
        date, 
        time, 
        location, 
        eventType, 
        mode, 
        registrationLink, 
        maxParticipants, 
        isPublished 
      } = req.body;

      // Upload new image to Cloudinary if provided
      let imageUrl = event.images && event.images.length > 0 ? event.images[0] : '';
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/events',
          resource_type: 'auto'
        });
        imageUrl = result.secure_url;
      }

      // Update event data
      event = await Event.findByIdAndUpdate(
        req.params.id,
        { 
          title, 
          description, 
          date, 
          time, 
          location, 
          eventType, 
          mode, 
          registrationLink, 
          maxParticipants: maxParticipants ? parseInt(maxParticipants) : undefined,
          isPublished: isPublished === 'true' || isPublished === true,
          images: imageUrl ? [imageUrl] : []
        },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: event
      });
    } catch (err) {
      console.error('Error updating event:', err);
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

      await Event.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        data: {}
      });
    } catch (err) {
      next(err);
    }
  }
);

// Toggle publish status - Protected & Admin only
router.patch('/:id/toggle', 
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

      event.isPublished = !event.isPublished;
      await event.save();

      res.status(200).json({
        success: true,
        data: event
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
