import Partner from '../models/Partner';
import { uploadFile } from '../middleware/upload';

export const createPartner = async (req, res) => {
  try {
    const { name, contactName, contactEmail, websiteUrl, description, partnershipType } = req.body;
    
    // Handle file upload if exists
    let logoUrl = '';
    if (req.file) {
      const result = await uploadFile(req.file);
      logoUrl = result.secure_url;
    }

    const partner = new Partner({
      name,
      contactName,
      contactEmail,
      websiteUrl,
      description,
      partnershipType,
      logoUrl,
      isActive: false, // Needs admin approval
      featured: false
    });

    await partner.save();
    
    // In a real app, you might want to send an email notification here
    
    res.status(201).json({
      success: true,
      message: 'Partner application submitted successfully!',
      data: partner
    });
  } catch (error) {
    console.error('Error creating partner:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating partner'
    });
  }
};

export const createEventSponsor = async (req, res) => {
  try {
    const {
      eventName,
      companyName,
      contactName,
      contactEmail,
      phone,
      sponsorshipType,
      contributionDetails,
      message
    } = req.body;

    // In a real app, you would save this to a database
    // For now, we'll just log it and return success
    console.log('New sponsorship request:', {
      eventName,
      companyName,
      contactName,
      contactEmail,
      phone,
      sponsorshipType,
      contributionDetails,
      message,
      createdAt: new Date()
    });

    // In a real app, you might want to send an email notification here
    
    res.status(201).json({
      success: true,
      message: 'Sponsorship request submitted successfully!',
      data: {
        eventName,
        companyName,
        contactName,
        contactEmail,
        status: 'pending'
      }
    });
  } catch (error) {
    console.error('Error processing sponsorship request:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error processing sponsorship request'
    });
  }
};

export const getPartners = async (req, res) => {
  try {
    const partners = await Partner.find({ isActive: true });
    res.status(200).json({
      success: true,
      data: partners
    });
  } catch (error) {
    console.error('Error fetching partners:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching partners'
    });
  }
};
