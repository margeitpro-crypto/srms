const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllSubjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } }
      ];
    }

    const subjects = await prisma.subject.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { name: 'asc' }
    });

    const total = await prisma.subject.count({ where });

    res.json({
      subjects,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get subjects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            marks: true
          }
        }
      }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    res.json({ subject });
  } catch (error) {
    console.error('Get subject error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, code } = req.body;

    // Check if subject code exists
    const existingSubject = await prisma.subject.findFirst({
      where: { code }
    });

    if (existingSubject) {
      return res.status(409).json({ error: 'Subject code already exists' });
    }

    const subject = await prisma.subject.create({
      data: {
        name,
        code
      }
    });

    res.status(201).json({
      message: 'Subject created successfully',
      subject
    });
  } catch (error) {
    console.error('Create subject error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code } = req.body;

    const subject = await prisma.subject.update({
      where: { id: parseInt(id) },
      data: { name, code }
    });

    res.json({
      message: 'Subject updated successfully',
      subject
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Subject not found' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Subject code already exists' });
    }
    console.error('Update subject error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if subject has marks
    const markCount = await prisma.marks.count({
      where: { subjectId: parseInt(id) }
    });

    if (markCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete subject with existing marks',
        markCount
      });
    }

    await prisma.subject.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Subject deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Subject not found' });
    }
    console.error('Delete subject error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubjectStats = async (req, res) => {
  try {
    const { id } = req.params;

    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(id) }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const totalMarks = await prisma.marks.count({
      where: { subjectId: parseInt(id) }
    });

    const averageMarks = await prisma.marks.aggregate({
      where: { subjectId: parseInt(id) },
      _avg: { marks: true },
      _min: { marks: true },
      _max: { marks: true }
    });

    const gradeDistribution = await prisma.marks.groupBy({
      by: ['grade'],
      where: { subjectId: parseInt(id) },
      _count: { grade: true },
      orderBy: { grade: 'asc' }
    });

    res.json({
      subject,
      stats: {
        totalMarksEntries: totalMarks,
        averageMarks: averageMarks._avg.marks || 0,
        minMarks: averageMarks._min.marks || 0,
        maxMarks: averageMarks._max.marks || 0,
        gradeDistribution: gradeDistribution.map(item => ({
          grade: item.grade,
          count: item._count.grade
        }))
      }
    });
  } catch (error) {
    console.error('Get subject stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStats
};
