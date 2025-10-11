import Course from '../models/Course.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select('title description category duration level instructor image enrolledStudents rating reviews')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
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
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      data: course.modules || []
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
    const { title, description, duration, order } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const newWeek = {
      id: `week-${course.modules.length + 1}`,
      title,
      description,
      duration,
      order: order || course.modules.length + 1,
      lessons: []
    };
    
    course.modules.push(newWeek);
    await course.save();
    
    res.json({
      success: true,
      message: 'Week added successfully',
      data: newWeek
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
    const { title, description, duration } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const week = course.modules.id(weekId);
    if (!week) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    if (title) week.title = title;
    if (description) week.description = description;
    if (duration) week.duration = duration;
    
    await course.save();
    
    res.json({
      success: true,
      message: 'Week updated successfully',
      data: week
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
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    course.modules.id(weekId).remove();
    await course.save();
    
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
    const { title, type, content, duration, difficulty, points, order } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const week = course.modules.id(weekId);
    if (!week) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    // Handle image uploads if present
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        imageUrls.push(result.secure_url);
      }
    }
    
    // Insert images into content if it's an article
    let finalContent = content;
    if (type === 'article' && imageUrls.length > 0) {
      // Add images to the end of the content
      const imageMarkdown = imageUrls.map(url => `\n\n![Image](${url})`).join('');
      finalContent = content + imageMarkdown;
    }
    
    const newContent = {
      id: `${type}-${week.lessons.length + 1}`,
      title,
      type,
      content: finalContent,
      duration,
      difficulty: type === 'problem' ? difficulty : undefined,
      points: type === 'problem' ? points : undefined,
      order: order || week.lessons.length + 1,
      completed: false
    };
    
    week.lessons.push(newContent);
    await course.save();
    
    res.json({
      success: true,
      message: 'Content added successfully',
      data: newContent
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
    const { title, content, duration, difficulty, points } = req.body;
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const week = course.modules.id(weekId);
    if (!week) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    const contentItem = week.lessons.id(contentId);
    if (!contentItem) {
      return res.status(404).json({
        success: false,
        error: 'Content not found'
      });
    }
    
    // Handle image uploads if present
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.path);
        imageUrls.push(result.secure_url);
      }
    }
    
    if (title) contentItem.title = title;
    if (content) {
      let finalContent = content;
      if (contentItem.type === 'article' && imageUrls.length > 0) {
        const imageMarkdown = imageUrls.map(url => `\n\n![Image](${url})`).join('');
        finalContent = content + imageMarkdown;
      }
      contentItem.content = finalContent;
    }
    if (duration) contentItem.duration = duration;
    if (difficulty) contentItem.difficulty = difficulty;
    if (points) contentItem.points = points;
    
    await course.save();
    
    res.json({
      success: true,
      message: 'Content updated successfully',
      data: contentItem
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
    
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    const week = course.modules.id(weekId);
    if (!week) {
      return res.status(404).json({
        success: false,
        error: 'Week not found'
      });
    }
    
    week.lessons.id(contentId).remove();
    await course.save();
    
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
