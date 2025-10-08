import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { FaSpinner, FaUpload } from 'react-icons/fa';
import partnerService from '../../services/partnerService';

const BecomePartnerForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      
      // Append all form data
      Object.keys(data).forEach(key => {
        if (data[key] !== '') {
          formData.append(key, data[key]);
        }
      });
      
      // Append logo file if exists
      if (logoFile) {
        formData.append('logo', logoFile);
      }
      
      // Submit the application
      await partnerService.submitApplication(formData);
      
      // Show success message
      toast.success('Your application has been submitted successfully! We will review it and get back to you soon.');
      
      // Reset form
      reset();
      setLogoPreview('');
      setLogoFile(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error(error.message || 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnershipTypes = [
    { value: 'sponsor', label: 'Sponsor' },
    { value: 'community', label: 'Community Partner' },
    { value: 'education', label: 'Education Partner' },
    { value: 'technology', label: 'Technology Partner' },
    { value: 'media', label: 'Media Partner' }
  ];

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Become a Partner</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organization Name */}
          <div className="col-span-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Organization Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Organization name is required' })}
              className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Your organization name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Website URL */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700 mb-1">
              Website URL *
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                https://
              </span>
              <input
                id="websiteUrl"
                type="text"
                {...register('websiteUrl', {
                  required: 'Website URL is required',
                  pattern: {
                    value: /^[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[a-zA-Z]{2,}/,
                    message: 'Please enter a valid domain (e.g., example.com)'
                  }
                })}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="yourwebsite.com"
              />
            </div>
            {errors.websiteUrl && (
              <p className="mt-1 text-sm text-red-600">{errors.websiteUrl.message}</p>
            )}
          </div>

          {/* Partnership Type */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-700 mb-1">
              Partnership Type *
            </label>
            <select
              id="partnershipType"
              {...register('partnershipType', { required: 'Please select a partnership type' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select partnership type</option>
              {partnershipTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
            {errors.partnershipType && (
              <p className="mt-1 text-sm text-red-600">{errors.partnershipType.message}</p>
            )}
          </div>

          {/* Contact Name */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Person Name *
            </label>
            <input
              id="contactName"
              type="text"
              {...register('contactName', { required: 'Contact name is required' })}
              className={`w-full px-3 py-2 border ${errors.contactName ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="John Doe"
            />
            {errors.contactName && (
              <p className="mt-1 text-sm text-red-600">{errors.contactName.message}</p>
            )}
          </div>

          {/* Contact Email */}
          <div className="col-span-2 md:col-span-1">
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email *
            </label>
            <input
              id="contactEmail"
              type="email"
              {...register('contactEmail', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Please enter a valid email address'
                }
              })}
              className={`w-full px-3 py-2 border ${errors.contactEmail ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="contact@example.com"
            />
            {errors.contactEmail && (
              <p className="mt-1 text-sm text-red-600">{errors.contactEmail.message}</p>
            )}
          </div>

          {/* Logo Upload */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization Logo
            </label>
            <div className="mt-1 flex items-center">
              <label className="group relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                <span>Upload Logo</span>
                <input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoChange}
                />
              </label>
              <p className="pl-1 text-sm text-gray-500">PNG, JPG, GIF up to 5MB</p>
            </div>
            {logoPreview && (
              <div className="mt-2 flex items-center">
                <div className="h-16 w-16 overflow-hidden rounded-md">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="h-full w-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLogoPreview('');
                    setLogoFile(null);
                  }}
                  className="ml-2 text-sm text-red-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Tell us about your organization and why you'd like to partner with us *
            </label>
            <textarea
              id="description"
              rows={4}
              {...register('description', {
                required: 'Please tell us about your organization',
                minLength: {
                  value: 50,
                  message: 'Please provide more details (at least 50 characters)'
                },
                maxLength: {
                  value: 1000,
                  message: 'Description cannot exceed 1000 characters'
                }
              })}
              className={`w-full px-3 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Please provide details about your organization, mission, and how you envision our partnership..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </button>
          <p className="mt-2 text-xs text-gray-500 text-center">
            We'll review your application and get back to you within 5-7 business days.
          </p>
        </div>
      </form>
    </div>
  );
};

export default BecomePartnerForm;
