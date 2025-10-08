import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaTimes, FaLinkedin, FaGithub, FaTwitter, FaGlobe, FaImage } from 'react-icons/fa';
import councilService from '../../services/councilService';

const CouncilMemberForm = ({ onSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    image: null,
    imagePreview: '',
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    },
    isActive: true,
    order: 0
  });

  useEffect(() => {
    if (id) {
      const fetchMember = async () => {
        try {
          const member = await councilService.getById(id);
          setFormData({
            ...member,
            imagePreview: member.image,
            image: null // We'll handle this separately
          });
        } catch (error) {
          console.error('Error fetching council member:', error);
          toast.error('Failed to load council member data');
          navigate('/admin/council');
        } finally {
          setLoading(false);
        }
      };

      fetchMember();
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: reader.result
          }));
        };
        reader.readAsDataURL(file);
      }
    } else if (name.startsWith('socialLinks.')) {
      const socialLinkField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [socialLinkField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Append all fields to form data
      Object.keys(formData).forEach(key => {
        if (key === 'socialLinks') {
          formDataToSend.append('socialLinks', JSON.stringify(formData.socialLinks));
        } else if (key !== 'imagePreview' && formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (id) {
        await councilService.update(id, formDataToSend);
        toast.success('Council member updated successfully');
      } else {
        await councilService.create(formDataToSend);
        toast.success('Council member created successfully');
      }

      if (onSuccess) {
        onSuccess();
      } else {
        navigate('/admin/council');
      }
    } catch (error) {
      console.error('Error saving council member:', error);
      toast.error(error.message || 'Failed to save council member');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {id ? 'Edit Council Member' : 'Add New Council Member'}
        </h2>
        <button
          onClick={() => navigate('/admin/council')}
          className="text-gray-500 hover:text-gray-700"
        >
          <FaTimes className="h-6 w-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="mt-1 flex items-center">
                <div className="relative rounded-full overflow-hidden h-32 w-32 border-2 border-dashed border-gray-300">
                  {formData.imagePreview ? (
                    <>
                      <img
                        src={formData.imagePreview}
                        alt="Profile preview"
                        className="h-full w-full object-cover"
                      />
                      <label className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <FaImage className="text-white text-xl" />
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          className="hidden"
                          onChange={handleInputChange}
                        />
                      </label>
                    </>
                  ) : (
                    <label className="h-full w-full flex items-center justify-center cursor-pointer">
                      <div className="text-center">
                        <FaImage className="mx-auto h-8 w-8 text-gray-400" />
                        <span className="mt-2 block text-sm text-gray-600">
                          Click to upload
                        </span>
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          className="hidden"
                          onChange={handleInputChange}
                        />
                      </div>
                    </label>
                  )}
                </div>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Recommended size: 400x400px
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="isActive" className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Active Member</span>
                </label>
              </div>

              <div>
                <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Role/Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleInputChange}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p className="mt-1 text-xs text-gray-500">
                A short bio about the council member (max 1000 characters)
              </p>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Social Links</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8">
                    <FaLinkedin className="h-5 w-5 text-[#0077B5]" />
                  </div>
                  <input
                    type="url"
                    name="socialLinks.linkedin"
                    value={formData.socialLinks.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/username"
                    className="ml-2 flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8">
                    <FaGithub className="h-5 w-5 text-gray-800" />
                  </div>
                  <input
                    type="url"
                    name="socialLinks.github"
                    value={formData.socialLinks.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/username"
                    className="ml-2 flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8">
                    <FaTwitter className="h-5 w-5 text-[#1DA1F2]" />
                  </div>
                  <input
                    type="url"
                    name="socialLinks.twitter"
                    value={formData.socialLinks.twitter}
                    onChange={handleInputChange}
                    placeholder="https://twitter.com/username"
                    className="ml-2 flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center">
                  <div className="flex-shrink-0 w-8">
                    <FaGlobe className="h-5 w-5 text-gray-700" />
                  </div>
                  <input
                    type="url"
                    name="socialLinks.website"
                    value={formData.socialLinks.website}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    className="ml-2 flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/admin/council')}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {id ? 'Updating...' : 'Creating...'}
              </>
            ) : id ? (
              'Update Member'
            ) : (
              'Create Member'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CouncilMemberForm;
