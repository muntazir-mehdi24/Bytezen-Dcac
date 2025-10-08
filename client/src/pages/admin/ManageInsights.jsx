import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaSpinner, FaImage } from 'react-icons/fa';
import insightService from '../../services/insightService';

const ManageInsights = () => {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentInsight, setCurrentInsight] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    thumbnailUrl: '',
    isPublished: false,
    tags: []
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const data = await insightService.getAll();
      setInsights(data);
    } catch (error) {
      toast.error('Failed to load insights');
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim().toLowerCase())) {
        setFormData({
          ...formData,
          tags: [...formData.tags, tagInput.trim().toLowerCase()]
        });
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      thumbnailUrl: '',
      isPublished: false,
      tags: []
    });
    setThumbnailFile(null);
    setThumbnailPreview('');
    setCurrentInsight(null);
    setTagInput('');
  };

  const handleEdit = (insight) => {
    setCurrentInsight(insight);
    setFormData({
      title: insight.title,
      content: insight.content,
      author: insight.author,
      thumbnailUrl: insight.thumbnailUrl || '',
      isPublished: insight.isPublished || false,
      tags: insight.tags || []
    });
    if (insight.thumbnailUrl) {
      setThumbnailPreview(insight.thumbnailUrl);
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
        if (key === 'tags') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      // Add thumbnail file if it's a new file
      if (thumbnailFile) {
        formDataToSend.append('thumbnail', thumbnailFile);
      }

      if (currentInsight) {
        await insightService.update(currentInsight._id, formDataToSend);
        toast.success('Insight updated successfully');
      } else {
        await insightService.create(formDataToSend);
        toast.success('Insight created successfully');
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchInsights();
    } catch (error) {
      console.error('Error saving insight:', error);
      toast.error(error.response?.data?.message || 'Failed to save insight');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this insight?')) {
      try {
        await insightService.delete(id);
        toast.success('Insight deleted successfully');
        fetchInsights();
      } catch (error) {
        console.error('Error deleting insight:', error);
        toast.error('Failed to delete insight');
      }
    }
  };

  const togglePublishStatus = async (id, currentStatus) => {
    try {
      await insightService.togglePublishStatus(id, !currentStatus);
      toast.success(`Insight ${!currentStatus ? 'published' : 'unpublished'} successfully`);
      fetchInsights();
    } catch (error) {
      console.error('Error toggling publish status:', error);
      toast.error('Failed to update insight status');
    }
  };

  const filteredInsights = insights.filter(insight => 
    insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insight.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (insight.tags && insight.tags.some(tag => 
      tag.toLowerCase().includes(searchTerm.toLowerCase())
    ))
  );

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Manage Insights</h1>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
        >
          <FaPlus className="mr-2" /> Add Insight
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search insights by title, content, author, or tags..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Insights Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
          </div>
        ) : filteredInsights.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No insights found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thumbnail
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
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
                {filteredInsights.map((insight) => (
                  <tr key={insight._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {insight.thumbnailUrl ? (
                        <img
                          className="h-10 w-10 rounded-md object-cover"
                          src={insight.thumbnailUrl}
                          alt={insight.title}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center">
                          <FaImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{insight.title}</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {insight.tags && insight.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {tag}
                          </span>
                        ))}
                        {insight.tags && insight.tags.length > 3 && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{insight.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{insight.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full cursor-pointer ${
                          insight.isPublished 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        }`}
                        onClick={() => togglePublishStatus(insight._id, insight.isPublished)}
                        title={insight.isPublished ? 'Click to unpublish' : 'Click to publish'}
                      >
                        {insight.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(insight)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                        title="Edit"
                      >
                        <FaEdit className="inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(insight._id)}
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

      {/* Add/Edit Insight Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {currentInsight ? 'Edit Insight' : 'Add New Insight'}
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
                <div className="grid grid-cols-1 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="mb-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          id="title"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.title}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                          Author <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="author"
                          id="author"
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.author}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                          Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          rows={8}
                          required
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          value={formData.content}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="mb-4">
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                          Tags
                        </label>
                        <div className="mt-1">
                          <div className="flex flex-wrap gap-2 mb-2">
                            {formData.tags.map((tag, index) => (
                              <span 
                                key={index}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                              >
                                {tag}
                                <button
                                  type="button"
                                  className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-600 hover:bg-blue-300 focus:outline-none"
                                  onClick={() => removeTag(tag)}
                                >
                                  <span className="sr-only">Remove tag</span>
                                  <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                                    <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                          </div>
                          <input
                            type="text"
                            id="tags"
                            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            placeholder="Type a tag and press Enter"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleTagInputKeyDown}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Thumbnail
                        </label>
                        <div className="mt-1 flex flex-col items-center">
                          <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden">
                            {thumbnailPreview ? (
                              <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FaImage className="h-12 w-12" />
                              </div>
                            )}
                            <label
                              htmlFor="thumbnail-upload"
                              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              <span className="bg-white rounded-full p-2">
                                <svg
                                  className="h-6 w-6 text-gray-700"
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
                              </span>
                              <input
                                id="thumbnail-upload"
                                name="thumbnail"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleThumbnailChange}
                              />
                            </label>
                          </div>
                          <p className="mt-2 text-xs text-gray-500 text-center">
                            Recommended size: 800x450px (16:9 aspect ratio)
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex items-center">
                          <input
                            id="isPublished"
                            name="isPublished"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            checked={formData.isPublished}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-700">
                            Publish this insight
                          </label>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {formData.isPublished 
                            ? 'This insight will be visible to all users.' 
                            : 'This insight will be saved as a draft.'}
                        </p>
                      </div>

                      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Make sure to proofread your content before publishing. Published insights will be visible to all users.
                            </p>
                          </div>
                        </div>
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
                        {currentInsight ? 'Updating...' : 'Creating...'}
                      </>
                    ) : currentInsight ? (
                      'Update Insight'
                    ) : (
                      'Create Insight'
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

export default ManageInsights;
