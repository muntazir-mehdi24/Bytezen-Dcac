import admin from 'firebase-admin';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const db = admin.firestore();

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const coursesSnapshot = await db.collection('courses').get();
    const courses = [];
    
    coursesSnapshot.forEach(doc => {
      const courseData = doc.data();
      courses.push({
        id: doc.id,
        ...courseData,
        // Don't include full modules in list view
        moduleCount: courseData.modules ? courseData.modules.length : 0
      });
    });
    
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch courses'
    });
  }
};

// Get course with full content
export const getCourseContent = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const doc = await db.collection('courses').doc(courseId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch course content'
    });
  }
};

// Add a new week (module)
export const addWeek = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, order } = req.body;
    
    const docRef = db.collection('courses').doc(courseId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const courseData = doc.data();
    const modules = courseData.modules || [];
    
    const newModule = {
      id: `week_${Date.now()}`,
      title,
      description: description || '',
      order: order || modules.length + 1,
      lessons: []
    };
    
    modules.push(newModule);
    
    await docRef.update({
      modules,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({
      success: true,
      data: newModule
    });
  } catch (error) {
    console.error('Error adding week:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add week'
    });
  }
};

// Update a week
export const updateWeek = async (req, res) => {
  try {
    const { courseId, weekId } = req.params;
    const { title, description, order } = req.body;
    
    const docRef = db.collection('courses').doc(courseId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const courseData = doc.data();
    const modules = courseData.modules || [];
    
    const moduleIndex = modules.findIndex(m => m.id === weekId);
    
    if (moduleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    modules[moduleIndex] = {
      ...modules[moduleIndex],
      title: title || modules[moduleIndex].title,
      description: description !== undefined ? description : modules[moduleIndex].description,
      order: order !== undefined ? order : modules[moduleIndex].order
    };
    
    await docRef.update({
      modules,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      data: modules[moduleIndex]
    });
  } catch (error) {
    console.error('Error updating week:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update week'
    });
  }
};

// Delete a week
export const deleteWeek = async (req, res) => {
  try {
    const { courseId, weekId } = req.params;
    
    const docRef = db.collection('courses').doc(courseId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const courseData = doc.data();
    const modules = courseData.modules || [];
    
    const filteredModules = modules.filter(m => m.id !== weekId);
    
    if (filteredModules.length === modules.length) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    await docRef.update({
      modules: filteredModules,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: 'Week deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting week:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete week'
    });
  }
};

// Add content to a week (article, problem, or quiz)
export const addContent = async (req, res) => {
  try {
    const { courseId, weekId } = req.params;
    const { title, type, content, difficulty, points, timeEstimate, questions } = req.body;
    
    const docRef = db.collection('courses').doc(courseId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const courseData = doc.data();
    const modules = courseData.modules || [];
    
    const moduleIndex = modules.findIndex(m => m.id === weekId);
    
    if (moduleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    // Upload images to Cloudinary if any
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.path, 'bytezen/courses');
          imageUrls.push(result.secure_url);
        } catch (err) {
          console.error('Error uploading image:', err);
        }
      }
    }
    
    const newLesson = {
      id: `lesson_${Date.now()}`,
      title,
      type, // 'article', 'problem', 'quiz'
      content: content || '',
      difficulty: difficulty || 'medium',
      points: points ? parseInt(points) : 0,
      timeEstimate: timeEstimate ? parseInt(timeEstimate) : 0,
      images: imageUrls,
      order: modules[moduleIndex].lessons.length + 1
    };
    
    // Add quiz-specific data
    if (type === 'quiz' && questions) {
      newLesson.questions = typeof questions === 'string' ? JSON.parse(questions) : questions;
    }
    
    modules[moduleIndex].lessons.push(newLesson);
    
    await docRef.update({
      modules,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.status(201).json({
      success: true,
      data: newLesson
    });
  } catch (error) {
    console.error('Error adding content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add content'
    });
  }
};

// Update content
export const updateContent = async (req, res) => {
  try {
    const { courseId, weekId, contentId } = req.params;
    const { title, type, content, difficulty, points, timeEstimate, questions } = req.body;
    
    const docRef = db.collection('courses').doc(courseId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const courseData = doc.data();
    const modules = courseData.modules || [];
    
    const moduleIndex = modules.findIndex(m => m.id === weekId);
    
    if (moduleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    const lessonIndex = modules[moduleIndex].lessons.findIndex(l => l.id === contentId);
    
    if (lessonIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    const currentLesson = modules[moduleIndex].lessons[lessonIndex];
    
    // Upload new images if any
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const result = await uploadToCloudinary(file.path, 'bytezen/courses');
          newImageUrls.push(result.secure_url);
        } catch (err) {
          console.error('Error uploading image:', err);
        }
      }
    }
    
    // Update lesson
    modules[moduleIndex].lessons[lessonIndex] = {
      ...currentLesson,
      title: title || currentLesson.title,
      type: type || currentLesson.type,
      content: content !== undefined ? content : currentLesson.content,
      difficulty: difficulty || currentLesson.difficulty,
      points: points ? parseInt(points) : currentLesson.points,
      timeEstimate: timeEstimate ? parseInt(timeEstimate) : currentLesson.timeEstimate,
      images: newImageUrls.length > 0 ? [...(currentLesson.images || []), ...newImageUrls] : currentLesson.images
    };
    
    // Update quiz questions if provided
    if (type === 'quiz' && questions) {
      modules[moduleIndex].lessons[lessonIndex].questions = typeof questions === 'string' ? JSON.parse(questions) : questions;
    }
    
    await docRef.update({
      modules,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      data: modules[moduleIndex].lessons[lessonIndex]
    });
  } catch (error) {
    console.error('Error updating content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update content'
    });
  }
};

// Delete content
export const deleteContent = async (req, res) => {
  try {
    const { courseId, weekId, contentId } = req.params;
    
    const docRef = db.collection('courses').doc(courseId);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const courseData = doc.data();
    const modules = courseData.modules || [];
    
    const moduleIndex = modules.findIndex(m => m.id === weekId);
    
    if (moduleIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    const originalLength = modules[moduleIndex].lessons.length;
    modules[moduleIndex].lessons = modules[moduleIndex].lessons.filter(l => l.id !== contentId);
    
    if (modules[moduleIndex].lessons.length === originalLength) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    await docRef.update({
      modules,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    res.json({
      success: true,
      message: 'Content deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete content'
    });
  }
};
