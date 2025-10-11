import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth.js';
import Partner from '../models/Partner.js';
import { v2 as cloudinary } from 'cloudinary';
import { createPartner, createEventSponsor, getPartners } from '../controllers/partnerController.js';

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

// @desc    Create a new partner
// @route   POST /api/partners
// @access  Public
router.post('/', upload.single('logo'), createPartner);

// @desc    Create a new event sponsor
// @route   POST /api/partners/sponsor-event
// @access  Public
router.post('/sponsor-event', createEventSponsor);

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
router.get('/', getPartners);

// @desc    Get partner by ID
// @route   GET /api/partners/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const { type, featured } = req.query;
    let query = { isActive: true };
    
    if (type) {
      query.partnershipType = type;
    }
    
    if (featured === 'true') {
      query.featured = true;
    }
    
    const partners = await Partner.find(query).sort('-partnershipDate');
    
    res.json({
      success: true,
      count: partners.length,
      data: partners
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get single partner
// @route   GET /api/partners/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const partner = await Partner.findById(req.params.id);
    
    if (!partner || !partner.isActive) {
      return res.status(404).json({
        success: false,
        error: 'Partner not found'
      });
    }
    
    res.json({
      success: true,
      data: partner
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Create new partner
// @route   POST /api/partners
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('logo'),
  async (req, res, next) => {
    try {
      const {
        name,
        websiteUrl,
        contactName,
        contactEmail,
        description,
        partnershipType,
        isActive,
        featured,
        partnershipDate
      } = req.body;
      
      let logoUrl = '';
      
      // Upload logo to Cloudinary if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/partners/logos'
        });
        logoUrl = result.secure_url;
      }
      
      const partner = await Partner.create({
        name,
        logoUrl,
        websiteUrl,
        contactName,
        contactEmail,
        description,
        partnershipType: partnershipType || 'sponsor',
        isActive: isActive === 'true',
        featured: featured === 'true',
        partnershipDate: partnershipDate || Date.now()
      });
      
      res.status(201).json({
        success: true,
        data: partner
      });
    } catch (err) {
      next(err);
    }
  }
);

// @desc    Update partner
// @route   PUT /api/partners/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('logo'),
  async (req, res, next) => {
    try {
      const {
        name,
        websiteUrl,
        contactName,
        contactEmail,
        description,
        partnershipType,
        isActive,
        featured,
        partnershipDate
      } = req.body;
      
      let updateData = {
        name,
        websiteUrl,
        contactName,
        contactEmail,
        description,
        partnershipType: partnershipType || 'sponsor',
        isActive: isActive === 'true',
        featured: featured === 'true',
        partnershipDate: partnershipDate || Date.now()
      };
      
      // Upload new logo if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/partners/logos'
        });
        updateData.logoUrl = result.secure_url;
      }
      
      const partner = await Partner.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );
      
      if (!partner) {
        return res.status(404).json({
          success: false,
          error: 'Partner not found'
        });
      }
      
      res.json({
        success: true,
        data: partner
      });
    } catch (err) {
      next(err);
    }
  }
);

// @desc    Delete partner
// @route   DELETE /api/partners/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    
    if (!partner) {
      return res.status(404).json({
        success: false,
        error: 'Partner not found'
      });
    }
    
    // Delete logo from Cloudinary if it exists
    if (partner.logoUrl) {
      const publicId = partner.logoUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`bytezen/partners/logos/${publicId}`);
    }
    
    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Get partner types
// @route   GET /api/partners/types
// @access  Public
router.get('/types', async (req, res, next) => {
  try {
    const types = await Partner.schema.path('partnershipType').enumValues;
    
    res.json({
      success: true,
      data: types
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Apply to become a partner
// @route   POST /api/partners/apply
// @access  Public
router.post(
  '/apply',
  upload.single('logo'),
  async (req, res, next) => {
    try {
      const {
        name,
        websiteUrl,
        contactName,
        contactEmail,
        description,
        partnershipType
      } = req.body;
      
      let logoUrl = '';
      
      // Upload logo to Cloudinary if provided
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'bytezen/partners/applications'
        });
        logoUrl = result.secure_url;
      }
      
      // In a real application, you might want to:
      // 1. Save this to a separate collection for applications
      // 2. Send an email notification to admins
      // 3. Send a confirmation email to the applicant
      
      // For now, we'll just return the data that would be saved
      const application = {
        name,
        logoUrl,
        websiteUrl,
        contactName,
        contactEmail,
        description: description || '',
        partnershipType: partnershipType || 'sponsor',
        isActive: false, // Applications are inactive by default
        featured: false,
        status: 'pending',
        appliedAt: new Date()
      };
      
      // TODO: Uncomment this to actually save the application
      // const partner = await Partner.create(application);
      
      res.status(201).json({
        success: true,
        message: 'Your application has been submitted successfully. We will review it and get back to you soon.',
        data: application
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
