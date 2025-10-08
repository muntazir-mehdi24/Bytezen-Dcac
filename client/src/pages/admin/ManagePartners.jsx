import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSpinner } from 'react-icons/fa';
import partnerService from '../../services/partnerService';

const ManagePartners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [partnerTypes, setPartnerTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    contactName: '',
    contactEmail: '',
    description: '',
    partnershipType: 'sponsor',
    isActive: true,
    featured: false,
    partnershipDate: new Date().toISOString().split('T')[0]
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPartners();
    fetchPartnerTypes();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const data = await partnerService.getAll();
      setPartners(data);
    } catch (error) {
      toast.error('Failed to load partners');
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartnerTypes = async () => {
    try {
      const types = await partnerService.getTypes();
      setPartnerTypes(types);
    } catch (error) {
      console.error('Error fetching partner types:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      websiteUrl: '',
      contactName: '',
      contactEmail: '',
      description: '',
      partnershipType: 'sponsor',
      isActive: true,
      featured: false,
      partnershipDate: new Date().toISOString().split('T')[0]
    });
    setLogoFile(null);
    setLogoPreview('');
    setCurrentPartner(null);
  };

  const handleEdit = (partner) => {
    setCurrentPartner(partner);
    setFormData({
      name: partner.name,
      websiteUrl: partner.websiteUrl || '',
      contactName: partner.contactName || '',
      contactEmail: partner.contactEmail || '',
      description: partner.description || '',
      partnershipType: partner.partnershipType || 'sponsor',
      isActive: partner.isActive,
      featured: partner.featured || false,
      partnershipDate: partner.partnershipDate 
        ? new Date(partner.partnershipDate).toISOString().split('T')[0] 
        : new Date().toISOString().split('T')[0]
    });
    if (partner.logoUrl) {
      setLogoPreview(partner.logoUrl);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add all form fields to FormData
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add logo file if it's a new file
      if (logoFile) {
        formDataToSend.append('logo', logoFile);
      }

      if (currentPartner) {
        await partnerService.update(currentPartner._id, formDataToSend);
        toast.success('Partner updated successfully');
      } else {
        await partnerService.create(formDataToSend);
        toast.success('Partner created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
      toast.error(error.response?.data?.message || 'Failed to save partner');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await partnerService.delete(id);
        toast.success('Partner deleted successfully');
        fetchPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
        toast.error('Failed to delete partner');
      }
    }
  };

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (partner.description && partner.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === 'all' || partner.partnershipType === filterType;
    const matchesFeatured = !showFeaturedOnly || partner.featured;
    const matchesActive = showInactive ? true : partner.isActive;
    
    return matchesSearch && matchesType && matchesFeatured && matchesActive;
  });

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Manage Partners</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Partner
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search partners..."
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          
          <select
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={handleFilterChange}
          >
            <option value="all">All Types</option>
            {partnerTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featuredOnly"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={showFeaturedOnly}
              onChange={() => setShowFeaturedOnly(!showFeaturedOnly)}
            />
            <label htmlFor="featuredOnly" className="ml-2 text-sm text-gray-700">
              Featured Only
            </label>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showInactive"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={showInactive}
              onChange={() => setShowInactive(!showInactive)}
            />
            <label htmlFor="showInactive" className="ml-2 text-sm text-gray-700">
              Show Inactive
            </label>
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : filteredPartners.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No partners found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Logo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPartners.map((partner) => (
                  <tr key={partner._id} className={!partner.isActive ? 'bg-gray-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {partner.logoUrl ? (
                        <img
                          className="h-10 w-10 rounded-full object-cover"
                          src={partner.logoUrl}
                          alt={partner.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 text-xs">No Logo</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{partner.name}</div>
                      {partner.websiteUrl && (
                        <div className="text-sm text-blue-600">
                          <a href={partner.websiteUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {new URL(partner.websiteUrl).hostname.replace('www.', '')}
                          </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        partner.partnershipType === 'sponsor' 
                          ? 'bg-green-100 text-green-800' 
                          : partner.partnershipType === 'partner' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-purple-100 text-purple-800'
                      }`}>
                        {partner.partnershipType}
                      </span>
                      {partner.featured && (
                        <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        partner.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {partner.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(partner)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <FaEdit className="inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(partner._id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash className="inline" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Partner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentPartner ? 'Edit Partner' : 'Add New Partner'}
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Logo
                    </label>
                    <div className="mt-1 flex items-center">
                      <div className="relative">
                        {logoPreview ? (
                          <img
                            src={logoPreview}
                            alt="Logo preview"
                            className="h-20 w-20 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-md bg-gray-200 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No logo</span>
                          </div>
                        )}
                        <label
                          htmlFor="logo-upload"
                          className="absolute -bottom-2 -right-2 bg-white rounded-full p-1 border border-gray-300 shadow-sm cursor-pointer hover:bg-gray-50"
                        >
                          <svg
                            className="h-4 w-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          <input
                            id="logo-upload"
                            name="logo"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleLogoChange}
                          />
                        </label>
                      </div>
                      <div className="ml-4 text-sm text-gray-500">
                        <p>Upload a square logo (JPG, PNG, or WebP)</p>
                        <p className="text-xs mt-1">Max size: 2MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Partner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="partnershipType" className="block text-sm font-medium text-gray-700">
                      Partnership Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="partnershipType"
                      name="partnershipType"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.partnershipType}
                      onChange={handleInputChange}
                    >
                      {partnerTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
                      Website URL
                    </label>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                        https://
                      </span>
                      <input
                        type="url"
                        name="websiteUrl"
                        id="websiteUrl"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="example.com"
                        value={formData.websiteUrl.replace('https://', '')}
                        onChange={(e) => {
                          const value = e.target.value.startsWith('http')
                            ? e.target.value
                            : `https://${e.target.value}`;
                          handleInputChange({
                            target: {
                              name: 'websiteUrl',
                              value: value
                            }
                          });
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="partnershipDate" className="block text-sm font-medium text-gray-700">
                      Partnership Date
                    </label>
                    <input
                      type="date"
                      name="partnershipDate"
                      id="partnershipDate"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.partnershipDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-medium text-gray-700">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      id="contactName"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.contactName}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      id="contactEmail"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={3}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <input
                          id="isActive"
                          name="isActive"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData.isActive}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                          Active
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          id="featured"
                          name="featured"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          checked={formData.featured}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                          Featured Partner
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {currentPartner ? 'Updating...' : 'Creating...'}
                      </>
                    ) : currentPartner ? (
                      'Update Partner'
                    ) : (
                      'Create Partner'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePartners;
