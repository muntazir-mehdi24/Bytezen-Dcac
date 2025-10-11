import React, { useState, useEffect } from 'react';
import { FaNewspaper, FaPlus, FaEdit, FaTrash, FaImage, FaEye, FaTags, FaUser } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const ByteLogManagement = () => {
  const [bytelogs, setBytelogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBytelog, setEditingBytelog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    tags: '',
    isPublished: true
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');

  useEffect(() => {
    fetchBytelogs();
  }, []);

  const fetchBytelogs = async () => {
    try {
      setLoading(true);
      const response = await api.get('/insights');
      setBytelogs(response.data.data || []);
    } catch (error) {
      console.error('Error fetching bytelogs:', error);
      toast.error('Failed to load bytelogs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('author', formData.author);
      submitData.append('isPublished', formData.isPublished);
      
      // Handle tags
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      submitData.append('tags', JSON.stringify(tagsArray));
      
      if (thumbnailFile) {
        submitData.append('thumbnail', thumbnailFile);
      }

      if (editingBytelog) {
        await api.put(`/insights/${editingBytelog._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('ByteLog updated successfully!');
      } else {
        await api.post('/insights', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('ByteLog created successfully!');
      }

      resetForm();
      fetchBytelogs();
    } catch (error) {
      console.error('Error saving bytelog:', error);
      toast.error(error.response?.data?.error || 'Failed to save bytelog');
    }
  };

  const handleEdit = (bytelog) => {
    setEditingBytelog(bytelog);
    setFormData({
      title: bytelog.title || '',
      content: bytelog.content || '',
      author: bytelog.author || '',
      tags: bytelog.tags?.join(', ') || '',
      isPublished: bytelog.isPublished !== false
    });
    setThumbnailPreview(bytelog.thumbnailUrl || '');
    setShowModal(true);
  };

  const handleDelete = async (bytelogId) => {
    if (!window.confirm('Are you sure you want to delete this ByteLog?')) return;

    try {
      await api.delete(`/insights/${bytelogId}`);
      toast.success('ByteLog deleted successfully!');
      fetchBytelogs();
    } catch (error) {
      console.error('Error deleting bytelog:', error);
      toast.error('Failed to delete bytelog');
    }
  };

  const togglePublish = async (bytelog) => {
    try {
      await api.patch(`/insights/${bytelog._id}/publish`, {
        isPublished: !bytelog.isPublished
      });
      toast.success('ByteLog status updated!');
      fetchBytelogs();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      author: '',
      tags: '',
      isPublished: true
    });
    setEditingBytelog(null);
    setThumbnailFile(null);
    setThumbnailPreview('');
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2f8d46]"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">ByteLog Management</h1>
          <p className="text-gray-600 mt-1">Create and manage blog posts and articles</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          <FaPlus /> New ByteLog
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border-2 border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Total ByteLogs</p>
          <p className="text-2xl font-bold text-indigo-600">{bytelogs.length}</p>
        </div>
        <div className="bg-white border-2 border-green-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Published</p>
          <p className="text-2xl font-bold text-green-600">
            {bytelogs.filter(b => b.isPublished).length}
          </p>
        </div>
        <div className="bg-white border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-gray-600">Drafts</p>
          <p className="text-2xl font-bold text-yellow-600">
            {bytelogs.filter(b => !b.isPublished).length}
          </p>
        </div>
      </div>

      {/* ByteLogs List */}
      <div className="space-y-4">
        {bytelogs.map((bytelog) => (
          <div key={bytelog._id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex gap-6">
              {/* Thumbnail */}
              <div className="flex-shrink-0">
                {bytelog.thumbnailUrl ? (
                  <img
                    src={bytelog.thumbnailUrl}
                    alt={bytelog.title}
                    className="w-48 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-48 h-32 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg flex items-center justify-center">
                    <FaNewspaper className="text-4xl text-indigo-300" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{bytelog.title}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FaUser className="text-indigo-500" />
                        {bytelog.author || 'Anonymous'}
                      </span>
                      <span>
                        {new Date(bytelog.createdAt).toLocaleDateString()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        bytelog.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {bytelog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-3 line-clamp-2">{bytelog.content}</p>

                {/* Tags */}
                {bytelog.tags && bytelog.tags.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <FaTags className="text-indigo-500 text-sm" />
                    <div className="flex flex-wrap gap-2">
                      {bytelog.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => togglePublish(bytelog)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium ${
                      bytelog.isPublished
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {bytelog.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button
                    onClick={() => handleEdit(bytelog)}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(bytelog._id)}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bytelogs.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaNewspaper className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No ByteLogs yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Create your first ByteLog
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                {editingBytelog ? 'Edit ByteLog' : 'Create New ByteLog'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Thumbnail Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail Image</label>
                  <div className="flex items-center gap-4">
                    {thumbnailPreview && (
                      <img src={thumbnailPreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">
                      <FaImage /> Choose Thumbnail
                      <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Author</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    placeholder="Author name"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content *</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    rows="12"
                    placeholder="Write your ByteLog content here..."
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">Supports Markdown formatting</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Tags</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="python, machine-learning, tutorial (comma-separated)"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">Publish immediately</label>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    {editingBytelog ? 'Update ByteLog' : 'Create ByteLog'}
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

export default ByteLogManagement;
