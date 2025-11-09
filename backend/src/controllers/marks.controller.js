const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const calculateGrade = (marks) => {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B+';
  if (marks >= 60) return 'B';
  if (marks >= 50) return 'C+';
  if (marks >= 40) return 'C';
  if (marks >= 32) return 'D';
  return 'F';
};

const getAllMarks = async (req, res) => {
  try {
    const { studentId, subjectId, class: className, section, page = 1, limit = 10 } = req.query;

    const where = {};
    if (studentId) where.studentId = parseInt(studentId);
    if (subjectId) where.subjectId = parseInt(subjectId);

    // Build student filter for class and section
    const studentFilter = {};
    if (className) studentFilter.class = className;
    if (section) studentFilter.section = section;

    if (Object.keys(studentFilter).length > 0) {
      where.student = studentFilter;
    }

    const marks = await prisma.marks.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            class: true,
            section: true,
            school: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        subject: {
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
        { student: { class: 'asc' } },
        { student: { section: 'asc' } },
        { student: { rollNo: 'asc' } },
        { subject: { name: 'asc' } }
      ]
    });

    const total = await prisma.marks.count({ where });

    res.json({
      marks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get marks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createMarks = async (req, res) => {
  try {
    const { studentId, subjectId, marks } = req.body;

    // Check if marks already exist
    const existingMarks = await prisma.marks.findFirst({
      where: {
        studentId: parseInt(studentId),
        subjectId: parseInt(subjectId)
      }
    });

    if (existingMarks) {
      return res.status(409).json({ error: 'Marks already exist for this student-subject combination' });
    }

    // Verify student and subject exist
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) }
    });

    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(subjectId) }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const grade = calculateGrade(marks);

    const newMarks = await prisma.marks.create({
      data: {
        studentId: parseInt(studentId),
        subjectId: parseInt(subjectId),
        marks: parseFloat(marks),
        grade
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            class: true,
            section: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Marks created successfully',
      marks: newMarks
    });
  } catch (error) {
    console.error('Create marks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createBulkMarks = async (req, res) => {
  try {
    const { marks: marksData } = req.body;

    if (!Array.isArray(marksData) || marksData.length === 0) {
      return res.status(400).json({ error: 'Invalid marks data format' });
    }

    const processedMarks = marksData.map(mark => ({
      studentId: parseInt(mark.studentId),
      subjectId: parseInt(mark.subjectId),
      marks: parseFloat(mark.marks),
      grade: calculateGrade(parseFloat(mark.marks))
    }));

    const createdMarks = await prisma.marks.createMany({
      data: processedMarks,
      skipDuplicates: true
    });

    res.status(201).json({
      message: 'Bulk marks created successfully',
      count: createdMarks.count
    });
  } catch (error) {
    console.error('Create bulk marks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateMarks = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks } = req.body;

    const grade = calculateGrade(marks);

    const updatedMarks = await prisma.marks.update({
      where: { id: parseInt(id) },
      data: {
        marks: parseFloat(marks),
        grade
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            class: true,
            section: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    });

    res.json({
      message: 'Marks updated successfully',
      marks: updatedMarks
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Marks not found' });
    }
    console.error('Update marks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteMarks = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.marks.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Marks deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Marks not found' });
    }
    console.error('Delete marks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getStudentReport = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
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

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const marks = await prisma.marks.findMany({
      where: { studentId: parseInt(studentId) },
      include: {
        subject: true
      },
      orderBy: { subject: { name: 'asc' } }
    });

    const totalMarks = marks.reduce((sum, mark) => sum + mark.marks, 0);
    const averageMarks = marks.length > 0 ? totalMarks / marks.length : 0;
    const overallGrade = calculateGrade(averageMarks);

    // Calculate GPA (assuming 4.0 scale)
    const gradePoints = {
      'A+': 4.0,
      'A': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'C+': 2.7,
      'C': 2.3,
      'D': 2.0,
      'F': 0.0
    };

    const totalGradePoints = marks.reduce((sum, mark) => sum + (gradePoints[mark.grade] || 0), 0);
    const gpa = marks.length > 0 ? totalGradePoints / marks.length : 0;

    res.json({
      student,
      marks,
      summary: {
        totalSubjects: marks.length,
        totalMarks,
        averageMarks: parseFloat(averageMarks.toFixed(2)),
        overallGrade,
        gpa: parseFloat(gpa.toFixed(2))
      }
    });
  } catch (error) {
    console.error('Get student report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getMarksByClassSection = async (req, res) => {
  try {
    const { class: className, section, subjectId } = req.query;

    if (!className || !section) {
      return res.status(400).json({ error: 'Class and section are required' });
    }

    const where = {
      student: {
        class: className,
        section: section
      }
    };

    if (subjectId) {
      where.subjectId = parseInt(subjectId);
    }

    const marks = await prisma.marks.findMany({
      where,
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true
          }
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      },
      orderBy: [
        { student: { rollNo: 'asc' } },
        { subject: { name: 'asc' } }
      ]
    });

    res.json({ marks });
  } catch (error) {
    console.error('Get marks by class section error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllMarks,
  createMarks,
  createBulkMarks,
  updateMarks,
  deleteMarks,
  getStudentReport,
  getMarksByClassSection
};
