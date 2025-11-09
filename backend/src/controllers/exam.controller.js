const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllExams = async (req, res) => {
  try {
    const { page = 1, limit = 10, schoolId, examType, status, search } = req.query;

    const where = {};
    if (schoolId) where.schoolId = parseInt(schoolId);
    if (examType) where.examType = examType;
    if (status === 'active') where.isActive = true;
    if (status === 'published') where.isPublished = true;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const exams = await prisma.exam.findMany({
      where,
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        _count: {
          select: {
            results: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.exam.count({ where });

    res.json({
      exams,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get exams error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExamById = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.findUnique({
      where: { id: parseInt(id) },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        results: {
          include: {
            student: {
              select: {
                id: true,
                name: true,
                rollNo: true,
                class: true,
                section: true
              }
            }
          }
        },
        _count: {
          select: {
            results: true
          }
        }
      }
    });

    if (!exam) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    res.json({ exam });
  } catch (error) {
    console.error('Get exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createExam = async (req, res) => {
  try {
    const {
      name,
      code,
      description,
      examType,
      startDate,
      endDate,
      schoolId,
      subjects = []
    } = req.body;

    // Check if exam code exists
    const existingExam = await prisma.exam.findUnique({
      where: { code }
    });

    if (existingExam) {
      return res.status(409).json({ error: 'Exam code already exists' });
    }

    // Create exam with subjects
    const exam = await prisma.exam.create({
      data: {
        name,
        code,
        description,
        examType,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        schoolId: schoolId ? parseInt(schoolId) : null,
        createdById: req.user.id,
        subjects: {
          create: subjects.map(subject => ({
            subjectId: subject.subjectId,
            maxMarks: subject.maxMarks || 100,
            minMarks: subject.minMarks || 0,
            examDate: subject.examDate ? new Date(subject.examDate) : null,
            duration: subject.duration,
            instructions: subject.instructions
          }))
        }
      },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: 'Exam created successfully',
      exam
    });
  } catch (error) {
    console.error('Create exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateExam = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      examType,
      startDate,
      endDate,
      isActive,
      subjects = []
    } = req.body;

    // Update exam
    const exam = await prisma.exam.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description,
        examType,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        isActive
      }
    });

    // Update subjects if provided
    if (subjects.length > 0) {
      // Delete existing subjects
      await prisma.examSubject.deleteMany({
        where: { examId: parseInt(id) }
      });

      // Create new subjects
      await prisma.examSubject.createMany({
        data: subjects.map(subject => ({
          examId: parseInt(id),
          subjectId: subject.subjectId,
          maxMarks: subject.maxMarks || 100,
          minMarks: subject.minMarks || 0,
          examDate: subject.examDate ? new Date(subject.examDate) : null,
          duration: subject.duration,
          instructions: subject.instructions
        }))
      });
    }

    const updatedExam = await prisma.exam.findUnique({
      where: { id: parseInt(id) },
      include: {
        school: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        subjects: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      }
    });

    res.json({
      message: 'Exam updated successfully',
      exam: updatedExam
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Exam not found' });
    }
    console.error('Update exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteExam = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if exam has results
    const resultCount = await prisma.examResult.count({
      where: { examId: parseInt(id) }
    });

    if (resultCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete exam with existing results',
        resultCount
      });
    }

    await prisma.exam.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Exam not found' });
    }
    console.error('Delete exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const publishExam = async (req, res) => {
  try {
    const { id } = req.params;

    const exam = await prisma.exam.update({
      where: { id: parseInt(id) },
      data: {
        isPublished: true,
        publishedAt: new Date()
      }
    });

    res.json({
      message: 'Exam published successfully',
      exam
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Exam not found' });
    }
    console.error('Publish exam error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getExamResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, status, class: className, section } = req.query;

    const where = {
      examId: parseInt(id)
    };

    if (status) where.status = status;
    if (className || section) {
      where.student = {};
      if (className) where.student.class = className;
      if (section) where.student.section = section;
    }

    const results = await prisma.examResult.findMany({
      where,
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
        subjectResults: {
          include: {
            subject: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: [
        { student: { class: 'asc' } },
        { student: { section: 'asc' } },
        { student: { rollNo: 'asc' } }
      ]
    });

    const total = await prisma.examResult.count({ where });

    res.json({
      results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get exam results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const processExamResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { results } = req.body;

    if (!Array.isArray(results) || results.length === 0) {
      return res.status(400).json({ error: 'Results array is required' });
    }

    // Process results in transaction
    const processedResults = await prisma.$transaction(async (tx) => {
      const processed = [];

      for (const result of results) {
        const { studentId, subjectResults } = result;

        // Calculate total marks and percentage
        const totalObtained = subjectResults.reduce((sum, sr) => sum + sr.marks, 0);
        const totalMax = subjectResults.reduce((sum, sr) => sum + (sr.maxMarks || 100), 0);
        const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;

        // Calculate grade and grade points
        const grade = calculateGrade(percentage);
        const gradePoints = calculateGradePoints(grade);

        // Create or update exam result
        const examResult = await tx.examResult.upsert({
          where: {
            examId_studentId: {
              examId: parseInt(id),
              studentId: parseInt(studentId)
            }
          },
          update: {
            status: 'PROCESSING',
            totalMarks: totalMax,
            obtainedMarks: totalObtained,
            percentage: parseFloat(percentage.toFixed(2)),
            grade,
            gradePoints
          },
          create: {
            examId: parseInt(id),
            studentId: parseInt(studentId),
            status: 'PROCESSING',
            totalMarks: totalMax,
            obtainedMarks: totalObtained,
            percentage: parseFloat(percentage.toFixed(2)),
            grade,
            gradePoints
          }
        });

        // Delete existing subject results
        await tx.examSubjectResult.deleteMany({
          where: { examResultId: examResult.id }
        });

        // Create subject results
        await tx.examSubjectResult.createMany({
          data: subjectResults.map(sr => ({
            examResultId: examResult.id,
            subjectId: sr.subjectId,
            marks: sr.marks,
            maxMarks: sr.maxMarks || 100,
            grade: calculateGrade((sr.marks / (sr.maxMarks || 100)) * 100),
            gradePoints: calculateGradePoints(calculateGrade((sr.marks / (sr.maxMarks || 100)) * 100)),
            isAbsent: sr.isAbsent || false,
            remarks: sr.remarks
          }))
        });

        processed.push(examResult);
      }

      return processed;
    });

    res.json({
      message: 'Exam results processed successfully',
      processedCount: processedResults.length
    });
  } catch (error) {
    console.error('Process exam results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const publishResults = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentIds = [] } = req.body;

    const where = {
      examId: parseInt(id),
      status: 'COMPLETED'
    };

    if (studentIds.length > 0) {
      where.studentId = { in: studentIds.map(id => parseInt(id)) };
    }

    const updatedResults = await prisma.examResult.updateMany({
      where,
      data: {
        isPublished: true,
        publishedAt: new Date()
      }
    });

    res.json({
      message: 'Results published successfully',
      publishedCount: updatedResults.count
    });
  } catch (error) {
    console.error('Publish results error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper functions
const calculateGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C+';
  if (percentage >= 40) return 'C';
  if (percentage >= 32) return 'D';
  return 'F';
};

const calculateGradePoints = (grade) => {
  const gradePoints = {
    'A+': 4.0,
    'A': 3.6,
    'B+': 3.2,
    'B': 2.8,
    'C+': 2.4,
    'C': 2.0,
    'D+': 1.6,
    'D': 1.2,
    'F': 0.0
  };
  return gradePoints[grade] || 0.0;
};

module.exports = {
  getAllExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  publishExam,
  getExamResults,
  processExamResults,
  publishResults
};
