import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaPlus, FaEdit, FaTrash, FaGripVertical, FaSearch, FaSpinner } from 'react-icons/fa';
import CouncilMemberForm from '../../components/admin/CouncilMemberForm';
import councilService from '../../services/councilService';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const ManageCouncil = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch all council members
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const data = await councilService.getAll();
      setMembers(data);
      setFilteredMembers(data);
    } catch (error) {
      console.error('Error fetching council members:', error);
      toast.error('Failed to load council members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Filter members based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = members.filter(
      (member) =>
        member.name.toLowerCase().includes(lowercasedSearch) ||
        member.role.toLowerCase().includes(lowercasedSearch) ||
        (member.bio && member.bio.toLowerCase().includes(lowercasedSearch))
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      
      if (selectedMember) {
        // Update existing member
        await councilService.update(selectedMember._id, formData);
        toast.success('Council member updated successfully');
      } else {
        // Create new member
        await councilService.create(formData);
        toast.success('Council member added successfully');
      }
      
      setShowForm(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Error saving council member:', error);
      toast.error(error.message || 'Failed to save council member');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await councilService.remove(selectedMember._id);
      toast.success('Council member deleted successfully');
      setShowDeleteDialog(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Error deleting council member:', error);
      toast.error('Failed to delete council member');
    }
  };

  // Handle drag end for reordering
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = filteredMembers.findIndex((m) => m._id === active.id);
    const newIndex = filteredMembers.findIndex((m) => m._id === over.id);

    const items = arrayMove(filteredMembers, oldIndex, newIndex);

    // Update local state immediately for better UX
    setFilteredMembers(items);

    try {
      // Update order in the database
      const orderedIds = items.map((item) => item._id);
      await councilService.reorder(orderedIds);
      
      // Refresh the list to ensure consistency
      fetchMembers();
    } catch (error) {
      console.error('Error reordering members:', error);
      toast.error('Failed to update member order');
      // Revert to original order on error
      fetchMembers();
    }
  };

  // Open edit form
  const handleEdit = (member) => {
    setSelectedMember(member);
    setShowForm(true);
  };

  // Open delete confirmation
  const confirmDelete = (member) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  // Close form and reset selection
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedMember(null);
  };

  // Toggle active status
  const toggleStatus = async (member) => {
    try {
      await councilService.update(member._id, {
        ...member,
        isActive: !member.isActive
      });
      toast.success(`Member ${member.isActive ? 'deactivated' : 'activated'} successfully`);
      fetchMembers();
    } catch (error) {
      console.error('Error updating member status:', error);
      toast.error('Failed to update member status');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Manage Council Members</h1>
        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <FaPlus className="mr-2" /> Add Member
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search members..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <FaSpinner className="animate-spin text-4xl text-blue-600" />
        </div>
      ) : (
        <>
          {/* Empty State */}
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchTerm ? 'No members match your search.' : 'No council members found.'}
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <FaPlus className="mr-2" /> Add Your First Member
                </Button>
              )}
            </div>
          ) : (
            /* Members List */
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredMembers.map((m) => m._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <ul className="divide-y divide-gray-200">
                    {filteredMembers.map((member) => (
                      <SortableItem
                        key={member._id}
                        member={member}
                        onEdit={handleEdit}
                        onDelete={confirmDelete}
                        onToggleStatus={toggleStatus}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      <Modal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setSelectedMember(null);
        }}
        title={selectedMember ? 'Edit Council Member' : 'Add Council Member'}
      >
        <CouncilMemberForm
          member={selectedMember}
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedMember(null);
          }}
          isSubmitting={isSubmitting}
        />
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedMember(null);
        }}
        onConfirm={handleDelete}
        title="Delete Council Member"
        message={`Are you sure you want to delete ${selectedMember?.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

// Sortable Item Component
const SortableItem = ({ member, onEdit, onDelete, onToggleStatus }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: member._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} className="bg-white hover:bg-gray-50">
      <div className="px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 min-w-0">
            <div
              {...attributes}
              {...listeners}
              className="mr-3 text-gray-400 hover:text-gray-600 cursor-move"
            >
              <FaGripVertical />
            </div>
            <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden">
              <img
                className="h-full w-full object-cover"
                src={member.image || '/images/avatar-placeholder.png'}
                alt={member.name}
              />
            </div>
            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center">
                <h2 className="text-lg font-medium text-gray-900 truncate">
                  {member.name}
                </h2>
                <span
                  className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    member.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {member.role}
              </p>
            </div>
          </div>
          <div className="ml-4 flex-shrink-0 flex space-x-2">
            <button
              onClick={() => onToggleStatus(member)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                member.isActive
                  ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                  : 'bg-green-100 text-green-800 hover:bg-green-200'
              }`}
            >
              {member.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => onEdit(member)}
              className="p-2 text-blue-600 hover:text-blue-900"
              title="Edit"
            >
              <FaEdit />
            </button>
            <button
              onClick={() => onDelete(member)}
              className="p-2 text-red-600 hover:text-red-900"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ManageCouncil;
