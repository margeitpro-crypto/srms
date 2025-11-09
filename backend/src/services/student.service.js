const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Student Management Service
 * Handles all business logic for student operations
 */

class StudentService {
  /**
   * Get all students with filtering and pagination
   * @param {Object} filters - Filtering options
   * @param {number} page - Page number
   * @param {number} limit - Number of items per page
   * @returns {Object} Students and pagination info
   */
  async getAllStudents(filters = {}, page = 1, limit = 10) {
    const { class: className, section, schoolId, search } = filters;

    const where = {};
    if (className) where.class = className;
    if (section) where.section = section;
    if (schoolId) where.schoolId = parseInt(schoolId);
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { rollNo: { contains: search, mode: 'insensitive' } }
      ];
    }

    const students = await prisma.student.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: [
        { class: 'asc' },
        { section: 'asc' },
        { rollNo: 'asc' }
      ]
    });

    const total = await prisma.student.count({ where });

    return {
      students,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Get student by ID
   * @param {number} id - Student ID
   * @returns {Object} Student data
   */
  async getStudentById(id) {
    return await prisma.student.findUnique({
      where: { id: parseInt(id) },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true,
            address: true
          }
        }
      }
    });
  }

  /**
   * Create a new student
   * @param {Object} studentData - Student information
   * @returns {Object} Created student
   */
  async createStudent(studentData) {
    const { name, rollNo, class: className, section, schoolId, dateOfBirth, gender, address, 
            phone, email, parentName, parentPhone, parentEmail, createdById } = studentData;

    // Check if roll number exists in the same class and section
    const existingStudent = await prisma.student.findFirst({
      where: {
        rollNo,
        class: className,
        section,
        schoolId: parseInt(schoolId)
      }
    });

    if (existingStudent) {
      throw new Error('Roll number already exists in this class and section');
    }

    return await prisma.student.create({
      data: {
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
        createdById
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });
  }

  /**
   * Update student information
   * @param {number} id - Student ID
   * @param {Object} studentData - Updated student information
   * @returns {Object} Updated student
   */
  async updateStudent(id, studentData) {
    const { name, rollNo, class: className, section, schoolId, dateOfBirth, gender, address, 
            phone, email, parentName, parentPhone, parentEmail, updatedById } = studentData;

    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStudent) {
      throw new Error('Student not found');
    }

    // Check if roll number exists in the same class and section (excluding current student)
    if (rollNo && className && section) {
      const duplicateStudent = await prisma.student.findFirst({
        where: {
          rollNo,
          class: className,
          section,
          schoolId: schoolId ? parseInt(schoolId) : existingStudent.schoolId,
          NOT: {
            id: parseInt(id)
          }
        }
      });

      if (duplicateStudent) {
        throw new Error('Roll number already exists in this class and section');
      }
    }

    return await prisma.student.update({
      where: { id: parseInt(id) },
      data: {
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
        updatedById
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });
  }

  /**
   * Delete a student
   * @param {number} id - Student ID
   * @returns {Object} Deletion result
   */
  async deleteStudent(id) {
    // Check if student exists
    const existingStudent = await prisma.student.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingStudent) {
      throw new Error('Student not found');
    }

    return await prisma.student.delete({
      where: { id: parseInt(id) }
    });
  }

  /**
   * Get students by class with optional section and school filtering
   * @param {Object} filters - Filtering options
   * @returns {Array} Students in the specified class
   */
  async getStudentsByClass(filters = {}) {
    const { class: className, section, schoolId } = filters;

    if (!className) {
      throw new Error('Class is required');
    }

    const where = {
      class: className,
      ...(section && { section }),
      ...(schoolId && { schoolId: parseInt(schoolId) })
    };

    return await prisma.student.findMany({
      where,
      select: {
        id: true,
        name: true,
        rollNo: true,
        class: true,
        section: true
      },
      orderBy: [
        { section: 'asc' },
        { rollNo: 'asc' }
      ]
    });
  }

  /**
   * Check if a roll number is available in a specific class and section
   * @param {string} rollNo - Roll number to check
   * @param {string} className - Class name
   * @param {string} section - Section name
   * @param {number} schoolId - School ID
   * @param {number} excludeId - Student ID to exclude from check (for updates)
   * @returns {boolean} True if roll number is available
   */
  async isRollNoAvailable(rollNo, className, section, schoolId, excludeId = null) {
    const where = {
      rollNo,
      class: className,
      section,
      schoolId: parseInt(schoolId)
    };

    if (excludeId) {
      where.NOT = { id: parseInt(excludeId) };
    }

    const existingStudent = await prisma.student.findFirst({ where });
    return !existingStudent;
  }
}

module.exports = new StudentService();