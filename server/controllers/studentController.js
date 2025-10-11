import admin from 'firebase-admin';

const db = admin.firestore();

// Get all students
export const getAllStudents = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users')
      .where('role', '==', 'student')
      .get();
    
    const students = [];
    usersSnapshot.forEach(doc => {
      students.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
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
    const existingUsers = await db.collection('users').where('email', '==', email).get();
    if (!existingUsers.empty) {
      return res.status(400).json({
        success: false,
        error: 'Student with this email already exists'
      });
    }
    
    // Create student in Firestore
    const studentData = {
      name,
      email,
      rollNumber: rollNumber || '',
      phone: phone || '',
      department: department || '',
      division: division || '',
      year: year || '',
      role: 'student',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    const docRef = await db.collection('users').add(studentData);
    
    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { id: docRef.id, ...studentData }
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
    
    const docRef = db.collection('users').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (rollNumber !== undefined) updateData.rollNumber = rollNumber;
    if (phone !== undefined) updateData.phone = phone;
    if (department !== undefined) updateData.department = department;
    if (division !== undefined) updateData.division = division;
    if (year !== undefined) updateData.year = year;
    
    await docRef.update(updateData);
    
    res.json({
      success: true,
      message: 'Student updated successfully',
      data: { id, ...doc.data(), ...updateData }
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
    
    const docRef = db.collection('users').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    await docRef.delete();
    
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
    
    const doc = await db.collection('users').doc(id).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Student not found'
      });
    }
    
    res.json({
      success: true,
      data: { id: doc.id, ...doc.data() }
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch student'
    });
  }
};
