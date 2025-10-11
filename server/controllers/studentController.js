import Student from '../models/Student.js';
import User from '../models/User.js';

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .populate('enrolledCourses.courseId', 'title')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: students
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch students'
    });
  }
};

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const { name, email, rollNumber, phone, department, division, year } = req.body;
    
    // Check if student already exists
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        error: 'Student with this email already exists'
      });
    }
    
    // Generate a unique UID
    const uid = `STU${Date.now()}`;
    
    const student = new Student({
      uid,
      name,
      email,
      rollNumber,
      phone,
      department,
      division,
      year
    });
    
    await student.save();
    
    // Also create a User account if it doesn't exist
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      const user = new User({
        uid,
        email,
        name,
        role: 'student',
        department,
        division,
        year
      });
      await user.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: student
    });
  } catch (error) {
    console.error('Error creating student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create student'
    });
  }
};

// Update a student
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, rollNumber, phone, department, division, year } = req.body;
    
    const student = await Student.findOne({ uid: id });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    // Update fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (rollNumber !== undefined) student.rollNumber = rollNumber;
    if (phone !== undefined) student.phone = phone;
    if (department !== undefined) student.department = department;
    if (division !== undefined) student.division = division;
    if (year !== undefined) student.year = year;
    
    await student.save();
    
    // Also update User if exists
    const user = await User.findOne({ uid: id });
    if (user) {
      if (name) user.name = name;
      if (email) user.email = email;
      if (department !== undefined) user.department = department;
      if (division !== undefined) user.division = division;
      if (year !== undefined) user.year = year;
      await user.save();
    }
    
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: student
    });
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update student'
    });
  }
};

// Delete a student
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOneAndDelete({ uid: id });
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    // Also delete User account
    await User.findOneAndDelete({ uid: id });
    
    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete student'
    });
  }
};

// Get student by ID
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const student = await Student.findOne({ uid: id })
      .populate('enrolledCourses.courseId', 'title');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      data: student
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student'
    });
  }
};
