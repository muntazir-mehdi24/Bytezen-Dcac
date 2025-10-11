import React, { useState, useEffect } from 'react';
import { FaBook, FaPlus, FaEdit, FaTrash, FaChevronDown, FaChevronRight, FaCode, FaClipboardCheck, FaImage, FaSave, FaTimes, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';

const CourseContentManagement = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [loading, setLoading] = useState(true);
  const [showWeekModal, setShowWeekModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingWeek, setEditingWeek] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [contentType, setContentType] = useState('article'); // article, problem, quiz

  // Week form data
  const [weekFormData, setWeekFormData] = useState({
    title: '',
    description: '',
    duration: '',
    order: 1
  });

  // Content form data
  const [contentFormData, setContentFormData] = useState({
    title: '',
    type: 'article',
    content: '',
    duration: '',
    difficulty: 'Easy',
    points: 10,
    order: 1
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      // Fetch courses from your existing courses endpoint
      const response = await api.get('/courses');
      setCourses(response.data.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourseContent = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/content`);
      const courseData = response.data.data;
      setSelectedCourse({
        ...courseData,
        weeks: courseData.modules || [] // Firebase uses 'modules' instead of 'weeks'
      });
    } catch (error) {
      console.error('Error fetching course content:', error);
      toast.error('Failed to load course content');
    }
  };

  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  // Week Management
  const handleAddWeek = () => {
    setEditingWeek(null);
    setWeekFormData({
      title: '',
      description: '',
      duration: '',
      order: (selectedCourse?.weeks?.length || 0) + 1
    });
    setShowWeekModal(true);
  };

  const handleEditWeek = (week) => {
    setEditingWeek(week);
    setWeekFormData({
      title: week.title || '',
      description: week.description || '',
      duration: week.duration || '',
      order: week.order || 1
    });
    setShowWeekModal(true);
  };

  const handleSaveWeek = async (e) => {
    e.preventDefault();
    try {
      if (editingWeek) {
        await api.put(`/courses/${selectedCourse.id}/weeks/${editingWeek.id}`, weekFormData);
        toast.success('Week updated successfully!');
      } else {
        await api.post(`/courses/${selectedCourse.id}/weeks`, weekFormData);
        toast.success('Week added successfully!');
      }
      setShowWeekModal(false);
      fetchCourseContent(selectedCourse.id);
    } catch (error) {
      console.error('Error saving week:', error);
      toast.error('Failed to save week');
    }
  };

  const handleDeleteWeek = async (weekId) => {
    if (!window.confirm('Are you sure? This will delete all content in this week.')) return;
    
    try {
      await api.delete(`/courses/${selectedCourse.id}/weeks/${weekId}`);
      toast.success('Week deleted successfully!');
      fetchCourseContent(selectedCourse.id);
    } catch (error) {
      console.error('Error deleting week:', error);
      toast.error('Failed to delete week');
    }
  };

  // Content Management
  const handleAddContent = (week, type) => {
    setSelectedWeek(week);
    setContentType(type);
    setEditingContent(null);
    setContentFormData({
      title: '',
      type: type,
      content: '',
      duration: '',
      difficulty: 'Easy',
      points: 10,
      order: (week.lessons?.length || 0) + 1
    });
    setShowContentModal(true);
  };

  const handleEditContent = (week, content) => {
    setSelectedWeek(week);
    setEditingContent(content);
    setContentFormData({
      title: content.title || '',
      type: content.type || 'article',
      content: content.content || '',
      duration: content.duration || '',
      difficulty: content.difficulty || 'Easy',
      points: content.points || 10,
      order: content.order || 1
    });
    setShowContentModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
  };

  const handleSaveContent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(contentFormData).forEach(key => {
        formData.append(key, contentFormData[key]);
      });

      // Add images
      imageFiles.forEach((file, index) => {
        formData.append('images', file);
      });

      if (editingContent) {
        await api.put(
          `/courses/${selectedCourse.id}/weeks/${selectedWeek.id}/content/${editingContent.id}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Content updated successfully!');
      } else {
        await api.post(
          `/courses/${selectedCourse.id}/weeks/${selectedWeek.id}/content`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        toast.success('Content added successfully!');
      }

      setShowContentModal(false);
      setImageFiles([]);
      fetchCourseContent(selectedCourse.id);
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  const handleDeleteContent = async (weekId, contentId) => {
    if (!window.confirm('Are you sure you want to delete this content?')) return;
    
    try {
      await api.delete(`/courses/${selectedCourse.id}/weeks/${weekId}/content/${contentId}`);
      toast.success('Content deleted successfully!');
      fetchCourseContent(selectedCourse.id);
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Course Content Management</h1>
        <p className="text-gray-600 mt-1">Manage course weeks, articles, problems, and quizzes</p>
      </div>

      {!selectedCourse ? (
        // Course Selection
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => fetchCourseContent(course.id)}
              className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all cursor-pointer hover:border-[#2f8d46]"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <FaBook className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                  <p className="text-sm text-gray-600">{course.category}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{course.description}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>📅 {course.duration}</span>
                <span>📊 {course.level}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Course Content Management
        <div>
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <button
                  onClick={() => setSelectedCourse(null)}
                  className="text-sm text-gray-600 hover:text-gray-900 mb-2"
                >
                  ← Back to Courses
                </button>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                <p className="text-gray-600 mt-1">{selectedCourse.description}</p>
              </div>
              <button
                onClick={handleAddWeek}
                className="flex items-center gap-2 bg-[#2f8d46] text-white px-4 py-2 rounded-lg hover:bg-[#267a3a]"
              >
                <FaPlus /> Add Week
              </button>
            </div>
          </div>

          {/* Weeks List */}
          <div className="space-y-4">
            {selectedCourse.weeks?.map((week) => (
              <div key={week.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Week Header */}
                <div className="bg-gradient-to-r from-[#2f8d46] to-[#1e6b32] text-white p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 flex-1">
                      <button
                        onClick={() => toggleWeek(week.id)}
                        className="text-white hover:bg-white/20 p-2 rounded"
                      >
                        {expandedWeeks[week.id] ? <FaChevronDown /> : <FaChevronRight />}
                      </button>
                      <div>
                        <h3 className="text-lg font-bold">{week.title}</h3>
                        <p className="text-sm text-green-100">{week.duration}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditWeek(week)}
                        className="p-2 hover:bg-white/20 rounded"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteWeek(week.id)}
                        className="p-2 hover:bg-white/20 rounded"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Week Content */}
                {expandedWeeks[week.id] && (
                  <div className="p-6">
                    {/* Add Content Buttons */}
                    <div className="flex gap-3 mb-6">
                      <button
                        onClick={() => handleAddContent(week, 'article')}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                      >
                        <FaBook /> Add Article
                      </button>
                      <button
                        onClick={() => handleAddContent(week, 'problem')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        <FaCode /> Add Problem
                      </button>
                      <button
                        onClick={() => handleAddContent(week, 'quiz')}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200"
                      >
                        <FaClipboardCheck /> Add Quiz
                      </button>
                    </div>

                    {/* Content List */}
                    <div className="space-y-3">
                      {week.lessons?.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                {lesson.type === 'article' && <FaBook className="text-blue-500" />}
                                {lesson.type === 'problem' && <FaCode className="text-green-500" />}
                                {lesson.type === 'quiz' && <FaClipboardCheck className="text-purple-500" />}
                                <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  lesson.type === 'article' ? 'bg-blue-100 text-blue-700' :
                                  lesson.type === 'problem' ? 'bg-green-100 text-green-700' :
                                  'bg-purple-100 text-purple-700'
                                }`}>
                                  {lesson.type}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600">{lesson.duration}</p>
                              {lesson.difficulty && (
                                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                  lesson.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                  lesson.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {lesson.difficulty}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditContent(week, lesson)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteContent(week.id, lesson.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!week.lessons || week.lessons.length === 0) && (
                        <p className="text-center text-gray-500 py-8">No content yet. Add articles, problems, or quizzes above.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {(!selectedCourse.weeks || selectedCourse.weeks.length === 0) && (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FaBook className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">No weeks yet</p>
              <button
                onClick={handleAddWeek}
                className="text-[#2f8d46] hover:text-[#267a3a] font-medium"
              >
                Create your first week
              </button>
            </div>
          )}
        </div>
      )}

      {/* Week Modal */}
      {showWeekModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">
              {editingWeek ? 'Edit Week' : 'Add New Week'}
            </h2>
            <form onSubmit={handleSaveWeek} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Week Title *</label>
                <input
                  type="text"
                  value={weekFormData.title}
                  onChange={(e) => setWeekFormData({ ...weekFormData, title: e.target.value })}
                  required
                  placeholder="e.g., Week 1: Introduction to Python"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={weekFormData.description}
                  onChange={(e) => setWeekFormData({ ...weekFormData, description: e.target.value })}
                  rows="3"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Duration</label>
                <input
                  type="text"
                  value={weekFormData.duration}
                  onChange={(e) => setWeekFormData({ ...weekFormData, duration: e.target.value })}
                  placeholder="e.g., 7 days"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowWeekModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#2f8d46] text-white rounded-lg hover:bg-[#267a3a]"
                >
                  <FaSave className="inline mr-2" />
                  {editingWeek ? 'Update Week' : 'Add Week'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Content Modal */}
      {showContentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-5xl w-full my-8">
            <div className="p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  {editingContent ? 'Edit' : 'Add'} {contentFormData.type.charAt(0).toUpperCase() + contentFormData.type.slice(1)}
                </h2>
                <div className="flex gap-2">
                  {contentFormData.type === 'article' && (
                    <button
                      type="button"
                      onClick={() => setShowPreview(!showPreview)}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                    >
                      <FaEye className="inline mr-2" />
                      {showPreview ? 'Edit' : 'Preview'}
                    </button>
                  )}
                </div>
              </div>

              {!showPreview ? (
                <form onSubmit={handleSaveContent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Title *</label>
                    <input
                      type="text"
                      value={contentFormData.title}
                      onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                    />
                  </div>

                  {contentFormData.type === 'article' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Content (Markdown) *</label>
                        <textarea
                          value={contentFormData.content}
                          onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                          required
                          rows="20"
                          placeholder="# Heading&#10;&#10;Your content here...&#10;&#10;## Subheading&#10;&#10;- Bullet point&#10;- Another point"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46] font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Supports Markdown: # Headings, **bold**, *italic*, `code`, ```code blocks```, - lists, [links](url)
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Add Images</label>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Upload images and they'll be automatically inserted into your article
                        </p>
                      </div>
                    </>
                  )}

                  {contentFormData.type === 'problem' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium mb-1">Problem Description *</label>
                        <textarea
                          value={contentFormData.content}
                          onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                          required
                          rows="8"
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Difficulty</label>
                          <select
                            value={contentFormData.difficulty}
                            onChange={(e) => setContentFormData({ ...contentFormData, difficulty: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                          >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Points</label>
                          <input
                            type="number"
                            value={contentFormData.points}
                            onChange={(e) => setContentFormData({ ...contentFormData, points: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {contentFormData.type === 'quiz' && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Quiz Description *</label>
                      <textarea
                        value={contentFormData.content}
                        onChange={(e) => setContentFormData({ ...contentFormData, content: e.target.value })}
                        required
                        rows="5"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">Duration</label>
                    <input
                      type="text"
                      value={contentFormData.duration}
                      onChange={(e) => setContentFormData({ ...contentFormData, duration: e.target.value })}
                      placeholder="e.g., 30 min, 1 hour"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#2f8d46]"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                      type="button"
                      onClick={() => {
                        setShowContentModal(false);
                        setImageFiles([]);
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#2f8d46] text-white rounded-lg hover:bg-[#267a3a]"
                    >
                      <FaSave className="inline mr-2" />
                      {editingContent ? 'Update' : 'Add'} {contentFormData.type}
                    </button>
                  </div>
                </form>
              ) : (
                // Preview Mode
                <div className="prose max-w-none">
                  <h1>{contentFormData.title}</h1>
                  <ReactMarkdown>{contentFormData.content}</ReactMarkdown>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="mt-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Back to Edit
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseContentManagement;
