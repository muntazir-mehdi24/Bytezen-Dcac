import React, { useState } from 'react';
import { FaBook, FaCode, FaClipboardCheck, FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { toast } from 'react-toastify';

const CourseManagement = () => {
  const [activeTab, setActiveTab] = useState('articles'); // articles, problems, quizzes
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // article, problem, quiz

  const tabs = [
    { id: 'articles', label: 'Articles', icon: FaBook, color: 'blue' },
    { id: 'problems', label: 'Problems', icon: FaCode, color: 'green' },
    { id: 'quizzes', label: 'Quizzes', icon: FaClipboardCheck, color: 'purple' }
  ];

  const openModal = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Course Management</h1>
        <p className="text-gray-600 mt-1">Manage articles, coding problems, and quizzes</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
              activeTab === tab.id
                ? `border-${tab.color}-600 text-${tab.color}-600`
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        {activeTab === 'articles' && <ArticlesManager onAdd={() => openModal('article')} />}
        {activeTab === 'problems' && <ProblemsManager onAdd={() => openModal('problem')} />}
        {activeTab === 'quizzes' && <QuizzesManager onAdd={() => openModal('quiz')} />}
      </div>

      {/* Modals */}
      {showModal && modalType === 'article' && (
        <ArticleModal onClose={() => setShowModal(false)} />
      )}
      {showModal && modalType === 'problem' && (
        <ProblemModal onClose={() => setShowModal(false)} />
      )}
      {showModal && modalType === 'quiz' && (
        <QuizModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

// Articles Manager Component
const ArticlesManager = ({ onAdd }) => {
  const [articles, setArticles] = useState([
    { id: 1, title: 'Introduction to Python', category: 'Tutorial', status: 'Published', views: 1234 },
    { id: 2, title: 'Data Structures Basics', category: 'Guide', status: 'Draft', views: 567 }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Learning Articles</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus /> Add Article
        </button>
      </div>

      <div className="space-y-4">
        {articles.map(article => (
          <div key={article.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{article.title}</h3>
                <div className="flex gap-4 mt-2 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <FaBook className="text-blue-500" /> {article.category}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    article.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {article.status}
                  </span>
                  <span>{article.views} views</span>
                </div>
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
          </div>
        ))}
      </div>
    </div>
  );
};

// Problems Manager Component
const ProblemsManager = ({ onAdd }) => {
  const [problems, setProblems] = useState([
    { id: 1, title: 'Two Sum', difficulty: 'Easy', points: 10, submissions: 234, solved: 189 },
    { id: 2, title: 'Binary Search', difficulty: 'Medium', points: 20, submissions: 156, solved: 98 }
  ]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Coding Problems</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          <FaPlus /> Add Problem
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {problems.map(problem => (
          <div key={problem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
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
            <div className="grid grid-cols-3 gap-2 text-sm text-gray-600">
              <div>
                <p className="font-semibold text-[#2f8d46]">{problem.points}</p>
                <p className="text-xs">Points</p>
              </div>
              <div>
                <p className="font-semibold">{problem.submissions}</p>
                <p className="text-xs">Submissions</p>
              </div>
              <div>
                <p className="font-semibold text-green-600">{problem.solved}</p>
                <p className="text-xs">Solved</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Quizzes Manager Component
const QuizzesManager = ({ onAdd }) => {
  const [quizzes, setQuizzes] = useState([
    { id: 1, title: 'Python Basics Quiz', questions: 10, duration: 15, attempts: 45, avgScore: 78 },
    { id: 2, title: 'Data Structures Quiz', questions: 15, duration: 20, attempts: 32, avgScore: 65 }
  ]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Quizzes</h2>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          <FaPlus /> Add Quiz
        </button>
      </div>

      <div className="space-y-4">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                  <div>
                    <p className="text-gray-600">Questions</p>
                    <p className="font-semibold">{quiz.questions}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold">{quiz.duration} min</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Attempts</p>
                    <p className="font-semibold">{quiz.attempts}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg Score</p>
                    <p className="font-semibold text-blue-600">{quiz.avgScore}%</p>
                  </div>
                </div>
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
          </div>
        ))}
      </div>
    </div>
  );
};

// Article Modal (Placeholder)
const ArticleModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add Article</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Tutorial</option>
              <option>Guide</option>
              <option>Reference</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea rows="10" className="w-full px-3 py-2 border rounded-lg" placeholder="Article content..."></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Featured Image</label>
            <input type="file" accept="image/*" className="w-full px-3 py-2 border rounded-lg" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Save Article</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Problem Modal (Placeholder)
const ProblemModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add Coding Problem</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select className="w-full px-3 py-2 border rounded-lg">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows="5" className="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Starter Code</label>
            <textarea rows="8" className="w-full px-3 py-2 border rounded-lg font-mono text-sm" placeholder="def solution():&#10;    pass"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Test Cases (JSON)</label>
            <textarea rows="5" className="w-full px-3 py-2 border rounded-lg font-mono text-sm" placeholder='[{"input": [1,2], "output": 3}]'></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save Problem</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quiz Modal (Placeholder)
const QuizModal = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Add Quiz</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Quiz Title</label>
              <input type="text" className="w-full px-3 py-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration (minutes)</label>
              <input type="number" className="w-full px-3 py-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows="3" className="w-full px-3 py-2 border rounded-lg"></textarea>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Questions</h3>
            <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">+ Add Question</button>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">Save Quiz</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseManagement;
