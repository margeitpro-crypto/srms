const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const studentService = require('../services/student.service');

const getAllStudents = async (req, res) => {
  try {
    const { page = 1, limit = 10, class: className, section, schoolId, search } = req.query;

    // Apply role-based filtering
    const filters = { class: className, section, schoolId, search };
    if (req.user.role === 'SCHOOL_ADMIN') {
      filters.schoolId = req.user.schoolId;
    } else if (req.user.role === 'TEACHER') {
      filters.schoolId = req.user.schoolId;
    }

    const result = await studentService.getAllStudents(filters, page, limit);

    res.json(result);
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await studentService.getStudentById(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check if user has permission to access this student
    if ((req.user.role === 'SCHOOL_ADMIN' || req.user.role === 'TEACHER') && 
        student.schoolId !== req.user.schoolId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ student });
  } catch (error) {
    console.error('Get student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createStudent = async (req, res) => {
  try {
    const { name, rollNo, class: className, section, schoolId, dateOfBirth, gender, address, 
            phone, email, parentName, parentPhone, parentEmail } = req.body;

    // Check permissions
    if (req.user.role === 'SCHOOL_ADMIN' && schoolId !== req.user.schoolId) {
      return res.status(403).json({ error: 'You can only create students for your school' });
    }

    const studentData = {
      name,
      rollNo,
      class: className,
      section,
      schoolId: parseInt(schoolId),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender,
      address,
      phone,
      email,
      parentName,
      parentPhone,
      parentEmail,
      createdById: req.user.id
    };

    const student = await studentService.createStudent(studentData);

    res.status(201).json({
      message: 'Student created successfully',
      student
    });
  } catch (error) {
    if (error.message === 'Roll number already exists in this class and section') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Create student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rollNo, class: className, section, schoolId, dateOfBirth, gender, address, 
            phone, email, parentName, parentPhone, parentEmail } = req.body;

    // Check if student exists and user has permission
    const existingStudent = await studentService.getStudentById(id);
    if (!existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check permissions
    if (req.user.role === 'SCHOOL_ADMIN' && existingStudent.schoolId !== req.user.schoolId) {
      return res.status(403).json({ error: 'You can only update students from your school' });
    }

    const studentData = {
      name,
      rollNo,
      class: className,
      section,
      schoolId: schoolId ? parseInt(schoolId) : undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      gender,
      address,
      phone,
      email,
      parentName,
      parentPhone,
      parentEmail,
      updatedById: req.user.id
    };

    const student = await studentService.updateStudent(id, studentData);

    res.json({
      message: 'Student updated successfully',
      student
    });
  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Roll number already exists in this class and section') {
      return res.status(409).json({ error: error.message });
    }
    console.error('Update student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if student exists and user has permission
    const existingStudent = await studentService.getStudentById(id);
    if (!existingStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Check permissions
    if (req.user.role === 'SCHOOL_ADMIN' && existingStudent.schoolId !== req.user.schoolId) {
      return res.status(403).json({ error: 'You can only delete students from your school' });
    }

    await studentService.deleteStudent(id);

    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    if (error.message === 'Student not found') {
      return res.status(404).json({ error: error.message });
    }
    console.error('Delete student error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudentsByClass = async (req, res) => {
  try {
    const { class: className, section, schoolId } = req.query;

    // Apply role-based filtering
    const filters = { class: className, section, schoolId };
    if (req.user.role === 'SCHOOL_ADMIN') {
      filters.schoolId = req.user.schoolId;
    } else if (req.user.role === 'TEACHER') {
      filters.schoolId = req.user.schoolId;
    }

    const students = await studentService.getStudentsByClass(filters);

    res.json({ students });
  } catch (error) {
    if (error.message === 'Class is required') {
      return res.status(400).json({ error: error.message });
    }
    console.error('Get students by class error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByClass
};