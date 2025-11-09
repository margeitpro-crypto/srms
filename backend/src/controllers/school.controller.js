const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getAllSchools = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    const schools = await prisma.school.findMany({
      where,
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { name: 'asc' }
    });

    const total = await prisma.school.count({ where });

    res.json({
      schools,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSchoolById = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await prisma.school.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: {
            students: true
          }
        }
      }
    });

    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    res.json({ school });
  } catch (error) {
    console.error('Get school error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createSchool = async (req, res) => {
  try {
    const { name, code, address } = req.body;

    // Check if school code exists
    const existingSchool = await prisma.school.findUnique({
      where: { code }
    });

    if (existingSchool) {
      return res.status(409).json({ error: 'School code already exists' });
    }

    const school = await prisma.school.create({
      data: {
        name,
        code,
        address
      }
    });

    res.status(201).json({
      message: 'School created successfully',
      school
    });
  } catch (error) {
    console.error('Create school error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, address } = req.body;

    const school = await prisma.school.update({
      where: { id: parseInt(id) },
      data: { name, code, address }
    });

    res.json({
      message: 'School updated successfully',
      school
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'School not found' });
    }
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'School code already exists' });
    }
    console.error('Update school error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteSchool = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if school has students
    const studentCount = await prisma.student.count({
      where: { schoolId: parseInt(id) }
    });

    if (studentCount > 0) {
      return res.status(400).json({
        error: 'Cannot delete school with existing students',
        studentCount
      });
    }

    await prisma.school.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'School deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'School not found' });
    }
    console.error('Delete school error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSchoolStats = async (req, res) => {
  try {
    const { id } = req.params;

    const school = await prisma.school.findUnique({
      where: { id: parseInt(id) }
    });

    if (!school) {
      return res.status(404).json({ error: 'School not found' });
    }

    const totalStudents = await prisma.student.count({
      where: { schoolId: parseInt(id) }
    });

    const studentsByClass = await prisma.student.groupBy({
      by: ['class'],
      where: { schoolId: parseInt(id) },
      _count: { id: true },
      orderBy: { class: 'asc' }
    });

    const studentsBySection = await prisma.student.groupBy({
      by: ['class', 'section'],
      where: { schoolId: parseInt(id) },
      _count: { id: true },
      orderBy: [
        { class: 'asc' },
        { section: 'asc' }
      ]
    });

    res.json({
      school,
      stats: {
        totalStudents,
        byClass: studentsByClass.map(item => ({
          class: item.class,
          count: item._count.id
        })),
        bySection: studentsBySection.map(item => ({
          class: item.class,
          section: item.section,
          count: item._count.id
        }))
      }
    });
  } catch (error) {
    console.error('Get school stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user's school (for school admins)
const getMySchool = async (req, res) => {
  try {
    // For school admins, we need to determine their school
    // Since there's no direct relationship in the current schema, 
    // we'll implement a placeholder that returns the first school
    // In a production environment, you would:
    // 1. Add a schoolId column to the users table
    // 2. Update the Prisma schema to reflect this relationship
    // 3. Query based on req.user.schoolId
    
    // For now, we'll return the first school as an example
    const school = await prisma.school.findFirst({
      orderBy: { id: 'asc' }
    });

    if (!school) {
      return res.status(404).json({ error: 'No schools found in the system' });
    }

    // Get statistics for the school
    const totalStudents = await prisma.student.count({
      where: { schoolId: school.id }
    });

    // Get classes count
    const classes = await prisma.student.groupBy({
      by: ['class'],
      where: { schoolId: school.id },
      _count: { id: true }
    });

    // Get teachers count (users with teacher role associated with this school)
    // Note: This is a simplified approach since we don't have a direct relationship
    const teachersCount = await prisma.user.count({
      where: { 
        role: 'TEACHER'
        // In a real implementation: schoolId: school.id
      }
    });

    res.json({
      school,
      stats: {
        totalStudents,
        classesCount: classes.length,
        teachersCount
      }
    });
  } catch (error) {
    console.error('Get my school error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolStats,
  getMySchool
};
