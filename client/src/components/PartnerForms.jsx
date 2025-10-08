import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PartnerForms = () => {
  const [activeTab, setActiveTab] = useState('partner');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Partner form state
  const [partnerForm, setPartnerForm] = useState({
    name: '',
    contactName: '',
    contactEmail: '',
    websiteUrl: '',
    description: '',
    partnershipType: 'sponsor',
    logo: null,
  });

  // Sponsor form state
  const [sponsorForm, setSponsorForm] = useState({
    eventName: '',
    companyName: '',
    contactName: '',
    contactEmail: '',
    phone: '',
    sponsorshipType: 'financial',
    contributionDetails: '',
    message: ''
  });

  const handlePartnerChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'logo') {
      setPartnerForm(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setPartnerForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSponsorChange = (e) => {
    const { name, value } = e.target;
    setSponsorForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePartnerSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      Object.keys(partnerForm).forEach(key => {
        if (partnerForm[key] !== null) {
          formData.append(key, partnerForm[key]);
        }
      });

      const response = await axios.post('/api/partners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Partner application submitted successfully!');
      setPartnerForm({
        name: '',
        contactName: '',
        contactEmail: '',
        websiteUrl: '',
        description: '',
        partnershipType: 'sponsor',
        logo: null,
      });
    } catch (error) {
      console.error('Error submitting partner application:', error);
      toast.error(error.response?.data?.message || 'Failed to submit application');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSponsorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await axios.post('/api/partners/sponsor-event', sponsorForm);
      
      toast.success('Sponsorship request submitted successfully!');
      setSponsorForm({
        eventName: '',
        companyName: '',
        contactName: '',
        contactEmail: '',
        phone: '',
        sponsorshipType: 'financial',
        contributionDetails: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting sponsorship request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'partner'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('partner')}
        >
          Become a Partner
        </button>
        <button
          className={`flex-1 py-4 px-6 text-center font-medium ${
            activeTab === 'sponsor'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('sponsor')}
        >
          Sponsor an Event
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'partner' ? (
          <form onSubmit={handlePartnerSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={partnerForm.name}
                  onChange={handlePartnerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Partnership <span className="text-red-500">*</span>
                </label>
                <select
                  id="partnershipType"
                  name="partnershipType"
                  value={partnerForm.partnershipType}
                  onChange={handlePartnerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="sponsor">Sponsor</option>
                  <option value="community">Community</option>
                  <option value="education">Education</option>
                  <option value="technology">Technology</option>
                  <option value="media">Media</option>
                </select>
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={partnerForm.contactName}
                  onChange={handlePartnerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={partnerForm.contactEmail}
                  onChange={handlePartnerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  name="websiteUrl"
                  value={partnerForm.websiteUrl}
                  onChange={handlePartnerChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
                  Logo <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="logo"
                  name="logo"
                  accept="image/*"
                  onChange={handlePartnerChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">PNG, JPG, or JPEG (Max 2MB)</p>
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Tell us about your organization <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={partnerForm.description}
                onChange={handlePartnerChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of your organization and why you'd like to partner with us..."
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSponsorSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
                  Company/Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={sponsorForm.companyName}
                  onChange={handleSponsorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-1">
                  Event to Sponsor <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="eventName"
                  name="eventName"
                  value={sponsorForm.eventName}
                  onChange={handleSponsorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Annual Tech Conference 2023"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="contactName"
                  name="contactName"
                  value={sponsorForm.contactName}
                  onChange={handleSponsorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={sponsorForm.contactEmail}
                  onChange={handleSponsorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={sponsorForm.phone}
                  onChange={handleSponsorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label htmlFor="sponsorshipType" className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Sponsorship <span className="text-red-500">*</span>
                </label>
                <select
                  id="sponsorshipType"
                  name="sponsorshipType"
                  value={sponsorForm.sponsorshipType}
                  onChange={handleSponsorChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="financial">Financial</option>
                  <option value="in-kind">In-Kind</option>
                  <option value="media">Media/PR</option>
                  <option value="venue">Venue/Logistics</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contributionDetails" className="block text-sm font-medium text-gray-700 mb-1">
                Sponsorship Details <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contributionDetails"
                name="contributionDetails"
                value={sponsorForm.contributionDetails}
                onChange={handleSponsorChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., $5000, 100 T-shirts, etc."
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={sponsorForm.message}
                onChange={handleSponsorChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any additional details or questions..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Sponsorship Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PartnerForms;
