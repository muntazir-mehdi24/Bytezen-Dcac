import React, { useState, useEffect } from 'react';
import { FaUsersCog, FaPlus, FaEdit, FaTrash, FaImage, FaSave, FaTimes, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const CouncilManagement = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    image: '',
    linkedin: '',
    twitter: '',
    github: '',
    isActive: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/council');
      setMembers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load council members');
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (editingMember) {
        await api.put(`/council/${editingMember._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Council member updated successfully!');
      } else {
        await api.post('/council', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Council member added successfully!');
      }

      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error(error.response?.data?.error || 'Failed to save member');
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      role: member.role || '',
      bio: member.bio || '',
      email: member.email || '',
      image: member.image || '',
      linkedin: member.linkedin || '',
      twitter: member.twitter || '',
      github: member.github || '',
      isActive: member.isActive !== false
    });
    setImagePreview(member.image || '');
    setShowModal(true);
  };

  const handleDelete = async (memberId) => {
    if (!window.confirm('Are you sure you want to delete this council member?')) return;

    try {
      await api.delete(`/council/${memberId}`);
      toast.success('Council member deleted successfully!');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      toast.error('Failed to delete member');
    }
  };

  const toggleStatus = async (member) => {
    try {
      await api.patch(`/council/${member._id}/toggle`);
      toast.success('Status updated successfully!');
      fetchMembers();
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      email: '',
      image: '',
      linkedin: '',
      twitter: '',
      github: '',
      isActive: true
    });
    setEditingMember(null);
    setImageFile(null);
    setImagePreview('');
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
          <h1 className="text-3xl font-bold text-gray-900">Council Management</h1>
          <p className="text-gray-600 mt-1">Manage your team members and leadership</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
        >
          <FaPlus /> Add Member
        </button>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member._id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            {/* Member Image */}
            <div className="relative h-48 bg-gradient-to-br from-pink-100 to-purple-100">
              {member.image ? (
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaUsersCog className="text-6xl text-pink-300" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  member.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Member Info */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-sm text-pink-600 font-medium">{member.role}</p>
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{member.bio}</p>

              {/* Social Links */}
              <div className="flex gap-3 mt-3">
                {member.linkedin && (
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                    <FaLinkedin size={20} />
                  </a>
                )}
                {member.twitter && (
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
                    <FaTwitter size={20} />
                  </a>
                )}
                {member.github && (
                  <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                    <FaGithub size={20} />
                  </a>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => toggleStatus(member)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium ${
                    member.isActive
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                  }`}
                >
                  {member.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(member._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaUsersCog className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No council members yet</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Add your first member
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingMember ? 'Edit Council Member' : 'Add Council Member'}
                </h2>
                <button onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Photo
                  </label>
                  <div className="flex items-center gap-4">
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
                      />
                    )}
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200">
                      <FaImage />
                      Choose Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role/Position *
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      required
                      placeholder="e.g., President, Vice President"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio/Description
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Brief description about the member..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Social Links (Optional)</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FaLinkedin className="text-blue-600" />
                      <input
                        type="url"
                        name="linkedin"
                        value={formData.linkedin}
                        onChange={handleInputChange}
                        placeholder="LinkedIn profile URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FaTwitter className="text-blue-400" />
                      <input
                        type="url"
                        name="twitter"
                        value={formData.twitter}
                        onChange={handleInputChange}
                        placeholder="Twitter profile URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FaGithub className="text-gray-700" />
                      <input
                        type="url"
                        name="github"
                        value={formData.github}
                        onChange={handleInputChange}
                        placeholder="GitHub profile URL"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">Active (visible on website)</label>
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700"
                  >
                    <FaSave /> {editingMember ? 'Update' : 'Add'} Member
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

export default CouncilManagement;
