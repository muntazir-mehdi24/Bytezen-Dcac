import express from 'express';
import multer from 'multer';
import admin from 'firebase-admin';
import { protect, authorize } from '../middleware/auth.js';
import { v2 as cloudinary } from 'cloudinary';

const db = admin.firestore();

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
    const eventsSnapshot = await db.collection('events').orderBy('date', 'desc').get();
    const events = [];
    eventsSnapshot.forEach(doc => {
      events.push({ id: doc.id, ...doc.data() });
    });
    
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (err) {
    console.error('Error fetching events:', err);
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

      const eventData = {
        title,
        description,
        date: new Date(date),
        time,
        location,
        eventType,
        mode,
        registrationLink,
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        isPublished: isPublished === 'true' || isPublished === true,
        images: imageUrl ? [imageUrl] : [],
        createdBy: req.user.uid || req.user._id || req.user.id,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      const docRef = await db.collection('events').add(eventData);

      res.status(201).json({
        success: true,
        data: { id: docRef.id, ...eventData }
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
      const docRef = db.collection('events').doc(req.params.id);
      const doc = await docRef.get();

      if (!doc.exists) {
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

      const eventData = doc.data();
      
      // Upload new image to Cloudinary if provided
      let imageUrl = eventData.images && eventData.images.length > 0 ? eventData.images[0] : '';
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/events',
          resource_type: 'auto'
        });
        imageUrl = result.secure_url;
      }

      // Update event data
      const updateData = {
        title, 
        description, 
        date: new Date(date), 
        time, 
        location, 
        eventType, 
        mode, 
        registrationLink, 
        maxParticipants: maxParticipants ? parseInt(maxParticipants) : null,
        isPublished: isPublished === 'true' || isPublished === true,
        images: imageUrl ? [imageUrl] : [],
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      };

      await docRef.update(updateData);

      res.status(200).json({
        success: true,
        data: { id: req.params.id, ...updateData }
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
      const docRef = db.collection('events').doc(req.params.id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      const eventData = doc.data();
      
      // Delete images from Cloudinary
      if (eventData.images && eventData.images.length > 0) {
        for (const imageUrl of eventData.images) {
          try {
            const publicId = imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`bytezen/events/${publicId}`);
          } catch (err) {
            console.error('Error deleting image:', err);
          }
        }
      }

      await docRef.delete();

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
      const docRef = db.collection('events').doc(req.params.id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return res.status(404).json({
          success: false,
          error: 'Event not found'
        });
      }

      const eventData = doc.data();
      await docRef.update({
        isPublished: !eventData.isPublished,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(200).json({
        success: true,
        data: { id: req.params.id, ...eventData, isPublished: !eventData.isPublished }
      });
    } catch (err) {
      next(err);
    }
  }
);

// Get single event - Public access
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await db.collection('events').doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { id: doc.id, ...doc.data() }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
