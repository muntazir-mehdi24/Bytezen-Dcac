import React, { useState, useEffect } from 'react';
import { FaHandshake, FaEnvelope, FaPhone, FaBuilding, FaCheckCircle, FaTimesCircle, FaEye, FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api';

const PartnersManagement = () => {
  const [activeTab, setActiveTab] = useState('requests'); // requests, partners
  const [requests, setRequests] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch partner requests from contact form
      const requestsRes = await api.get('/partners/requests');
      setRequests(requestsRes.data.data || []);
      
      // Fetch active partners
      const partnersRes = await api.get('/partners');
      setPartners(partnersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await api.put(`/partners/requests/${requestId}/approve`);
      toast.success('Partner request approved!');
      fetchData();
    } catch (error) {
      toast.error('Failed to approve request');
    }
  };

  const handleReject = async (requestId) => {
    if (!window.confirm('Are you sure you want to reject this request?')) return;
    
    try {
      await api.put(`/partners/requests/${requestId}/reject`);
      toast.success('Partner request rejected');
      fetchData();
    } catch (error) {
      toast.error('Failed to reject request');
    }
  };

  const viewRequest = (request) => {
    setSelectedRequest(request);
    setShowModal(true);
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Partners & Sponsors Management</h1>
        <p className="text-gray-600 mt-1">Manage partnership requests and active partners</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'requests'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Partnership Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('partners')}
          className={`px-4 py-3 font-medium transition-colors border-b-2 ${
            activeTab === 'partners'
              ? 'border-teal-600 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Active Partners ({partners.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'requests' ? (
        <RequestsTab requests={requests} onView={viewRequest} onApprove={handleApprove} onReject={handleReject} />
      ) : (
        <PartnersTab partners={partners} onRefresh={fetchData} />
      )}

      {/* Request Detail Modal */}
      {showModal && selectedRequest && (
        <RequestDetailModal request={selectedRequest} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

// Requests Tab Component
const RequestsTab = ({ requests, onView, onApprove, onReject }) => {
  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-12 text-center">
        <FaHandshake className="mx-auto text-6xl text-gray-300 mb-4" />
        <p className="text-gray-500">No partnership requests yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact Person</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {requests.map((request) => (
            <tr key={request._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <FaBuilding className="text-teal-500 mr-2" />
                  <div className="text-sm font-medium text-gray-900">{request.companyName || 'N/A'}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{request.name}</div>
                <div className="text-sm text-gray-500">{request.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {request.partnershipType || 'General'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  request.status === 'approved' ? 'bg-green-100 text-green-800' :
                  request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {request.status || 'Pending'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onView(request)}
                  className="text-blue-600 hover:text-blue-900 mr-3"
                  title="View Details"
                >
                  <FaEye />
                </button>
                {request.status !== 'approved' && (
                  <button
                    onClick={() => onApprove(request._id)}
                    className="text-green-600 hover:text-green-900 mr-3"
                    title="Approve"
                  >
                    <FaCheckCircle />
                  </button>
                )}
                {request.status !== 'rejected' && (
                  <button
                    onClick={() => onReject(request._id)}
                    className="text-red-600 hover:text-red-900"
                    title="Reject"
                  >
                    <FaTimesCircle />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Partners Tab Component
const PartnersTab = ({ partners, onRefresh }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Active Partners</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
        >
          <FaPlus /> Add Partner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div key={partner._id} className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                {partner.logo ? (
                  <img src={partner.logo} alt={partner.name} className="h-16 w-auto mb-3" />
                ) : (
                  <div className="h-16 w-16 bg-teal-100 rounded-lg flex items-center justify-center mb-3">
                    <FaBuilding className="text-3xl text-teal-600" />
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{partner.type}</p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                  <FaEdit />
                </button>
                <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <FaTrash />
                </button>
              </div>
            </div>
            {partner.website && (
              <a
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-teal-600 hover:text-teal-700"
              >
                Visit Website →
              </a>
            )}
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <FaHandshake className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500">No active partners yet</p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
          >
            Add your first partner
          </button>
        </div>
      )}
    </div>
  );
};

// Request Detail Modal
const RequestDetailModal = ({ request, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Partnership Request Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FaTimesCircle size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
            <p className="text-gray-900">{request.companyName || 'N/A'}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
              <p className="text-gray-900">{request.name}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Partnership Type</label>
              <p className="text-gray-900">{request.partnershipType || 'General'}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <p className="text-gray-900 flex items-center gap-2">
                <FaEnvelope className="text-gray-400" />
                {request.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900 flex items-center gap-2">
                <FaPhone className="text-gray-400" />
                {request.phone || 'N/A'}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{request.message}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Submitted On</label>
            <p className="text-gray-900">{new Date(request.createdAt).toLocaleString()}</p>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <a
              href={`mailto:${request.email}`}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              <FaEnvelope /> Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnersManagement;
