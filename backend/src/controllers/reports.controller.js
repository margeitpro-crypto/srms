const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getSummaryReport = async (req, res) => {
  try {
    const { class: className, section, schoolId } = req.query;

    // Get total counts
    const totalStudents = await prisma.student.count({
      where: {
        ...(className && { class: className }),
        ...(section && { section }),
        ...(schoolId && { schoolId: parseInt(schoolId) })
      }
    });

    const totalSubjects = await prisma.subject.count();
    const totalMarks = await prisma.marks.count();

    // Get average performance
    const averageMarksResult = await prisma.marks.aggregate({
      _avg: { marks: true },
      where: {
        student: {
          ...(className && { class: className }),
          ...(section && { section }),
          ...(schoolId && { schoolId: parseInt(schoolId) })
        }
      }
    });

    // Get grade distribution
    const gradeDistribution = await prisma.marks.groupBy({
      by: ['grade'],
      _count: { grade: true },
      where: {
        student: {
          ...(className && { class: className }),
          ...(section && { section }),
          ...(schoolId && { schoolId: parseInt(schoolId) })
        }
      }
    });

    // Get top performers
    const topPerformers = await prisma.$queryRaw`
      SELECT
        s.id, s.name, s."rollNo", s.class, s.section,
        AVG(m.marks) as average_marks,
        COUNT(m.id) as total_subjects
      FROM "Student" s
      LEFT JOIN "Marks" m ON s.id = m."studentId"
      ${className ? `WHERE s.class = '${className}'` : ''}
      ${section ? `${className ? 'AND' : 'WHERE'} s.section = '${section}'` : ''}
      GROUP BY s.id, s.name, s."rollNo", s.class, s.section
      HAVING COUNT(m.id) > 0
      ORDER BY AVG(m.marks) DESC
      LIMIT 10
    `;

    res.json({
      summary: {
        totalStudents,
        totalSubjects,
        totalMarks,
        averageMarks: averageMarksResult._avg.marks || 0
      },
      gradeDistribution: gradeDistribution.map(g => ({
        grade: g.grade,
        count: g._count.grade
      })),
      topPerformers: topPerformers.map(p => ({
        ...p,
        average_marks: parseFloat(p.average_marks)
      }))
    });
  } catch (error) {
    console.error('Get summary report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAnalytics = async (req, res) => {
  try {
    const { timeRange = '30' } = req.query;
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Performance trends
    const performanceTrends = await prisma.marks.groupBy({
      by: ['createdAt'],
      _avg: { marks: true },
      _count: { id: true },
      where: {
        createdAt: {
          gte: startDate
        }
      },
      orderBy: { createdAt: 'asc' }
    });

    // Subject-wise performance
    const subjectPerformance = await prisma.marks.groupBy({
      by: ['subjectId'],
      _avg: { marks: true },
      _count: { id: true },
      _min: { marks: true },
      _max: { marks: true }
    });

    const subjectsData = await prisma.subject.findMany({
      where: {
        id: {
          in: subjectPerformance.map(sp => sp.subjectId)
        }
      }
    });

    const subjectAnalytics = subjectPerformance.map(sp => {
      const subject = subjectsData.find(s => s.id === sp.subjectId);
      return {
        subject: subject ? { id: subject.id, name: subject.name, code: subject.code } : null,
        averageMarks: sp._avg.marks,
        totalStudents: sp._count.id,
        minMarks: sp._min.marks,
        maxMarks: sp._max.marks
      };
    });

    // Class-wise performance
    const classPerformance = await prisma.$queryRaw`
      SELECT
        s.class,
        AVG(m.marks) as average_marks,
        COUNT(DISTINCT s.id) as total_students,
        COUNT(m.id) as total_marks_entries
      FROM "Student" s
      LEFT JOIN "Marks" m ON s.id = m."studentId"
      GROUP BY s.class
      ORDER BY s.class
    `;

    // School-wise performance
    const schoolPerformance = await prisma.$queryRaw`
      SELECT
        sc.id, sc.name, sc.code,
        AVG(m.marks) as average_marks,
        COUNT(DISTINCT s.id) as total_students,
        COUNT(m.id) as total_marks_entries
      FROM "School" sc
      LEFT JOIN "Student" s ON sc.id = s."schoolId"
      LEFT JOIN "Marks" m ON s.id = m."studentId"
      GROUP BY sc.id, sc.name, sc.code
      ORDER BY sc.name
    `;

    res.json({
      performanceTrends: performanceTrends.map(pt => ({
        date: pt.createdAt,
        averageMarks: pt._avg.marks,
        totalEntries: pt._count.id
      })),
      subjectAnalytics,
      classPerformance: classPerformance.map(cp => ({
        class: cp.class,
        averageMarks: parseFloat(cp.average_marks || 0),
        totalStudents: parseInt(cp.total_students),
        totalMarksEntries: parseInt(cp.total_marks_entries)
      })),
      schoolPerformance: schoolPerformance.map(sp => ({
        school: {
          id: parseInt(sp.id),
          name: sp.name,
          code: sp.code
        },
        averageMarks: parseFloat(sp.average_marks || 0),
        totalStudents: parseInt(sp.total_students),
        totalMarksEntries: parseInt(sp.total_marks_entries)
      }))
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateCertificate = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      include: {
        school: true
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const marks = await prisma.marks.findMany({
      where: { studentId: parseInt(studentId) },
      include: { subject: true },
      orderBy: { subject: { name: 'asc' } }
    });

    if (marks.length === 0) {
      return res.status(404).json({ error: 'No marks found for student' });
    }

    const totalMarks = marks.reduce((sum, mark) => sum + mark.marks, 0);
    const averageMarks = totalMarks / marks.length;
    const overallGrade = averageMarks >= 90 ? 'A+' :
                        averageMarks >= 80 ? 'A' :
                        averageMarks >= 70 ? 'B+' :
                        averageMarks >= 60 ? 'B' :
                        averageMarks >= 50 ? 'C+' :
                        averageMarks >= 40 ? 'C' :
                        averageMarks >= 32 ? 'D' : 'F';

    // Calculate GPA
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
    const gpa = totalGradePoints / marks.length;

    // This would typically generate a PDF certificate
    // For now, returning certificate data
    const certificateData = {
      student: {
        name: student.name,
        rollNo: student.rollNo,
        class: student.class,
        section: student.section
      },
      school: student.school,
      results: marks.map(mark => ({
        subject: mark.subject.name,
        code: mark.subject.code,
        marks: mark.marks,
        grade: mark.grade
      })),
      summary: {
        totalSubjects: marks.length,
        totalMarks,
        averageMarks: parseFloat(averageMarks.toFixed(2)),
        overallGrade,
        gpa: parseFloat(gpa.toFixed(2))
      },
      issueDate: new Date().toISOString(),
      certificateId: `CERT-${student.id}-${Date.now()}`
    };

    res.json({
      message: 'Certificate generated successfully',
      certificate: certificateData
    });
  } catch (error) {
    console.error('Generate certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getClassReport = async (req, res) => {
  try {
    const { class: className, section } = req.query;

    if (!className) {
      return res.status(400).json({ error: 'Class is required' });
    }

    const where = {
      class: className,
      ...(section && { section })
    };

    const students = await prisma.student.findMany({
      where,
      include: {
        marks: {
          include: {
            subject: true
          }
        }
      },
      orderBy: { rollNo: 'asc' }
    });

    const reportData = students.map(student => {
      const totalMarks = student.marks.reduce((sum, mark) => sum + mark.marks, 0);
      const averageMarks = student.marks.length > 0 ? totalMarks / student.marks.length : 0;
      const overallGrade = averageMarks >= 90 ? 'A+' :
                          averageMarks >= 80 ? 'A' :
                          averageMarks >= 70 ? 'B+' :
                          averageMarks >= 60 ? 'B' :
                          averageMarks >= 50 ? 'C+' :
                          averageMarks >= 40 ? 'C' :
                          averageMarks >= 32 ? 'D' : 'F';

      return {
        student: {
          id: student.id,
          name: student.name,
          rollNo: student.rollNo,
          class: student.class,
          section: student.section
        },
        marks: student.marks,
        summary: {
          totalSubjects: student.marks.length,
          totalMarks,
          averageMarks: parseFloat(averageMarks.toFixed(2)),
          overallGrade
        }
      };
    });

    // Calculate class statistics
    const allAverages = reportData.map(r => r.summary.averageMarks).filter(avg => avg > 0);
    const classAverage = allAverages.length > 0 ? allAverages.reduce((sum, avg) => sum + avg, 0) / allAverages.length : 0;

    res.json({
      classInfo: {
        class: className,
        section: section || 'All',
        totalStudents: students.length
      },
      classStatistics: {
        classAverage: parseFloat(classAverage.toFixed(2)),
        passCount: reportData.filter(r => r.summary.overallGrade !== 'F').length,
        failCount: reportData.filter(r => r.summary.overallGrade === 'F').length
      },
      students: reportData
    });
  } catch (error) {
    console.error('Get class report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSubjectReport = async (req, res) => {
  try {
    const { subjectId } = req.params;
    const { class: className, section } = req.query;

    const subject = await prisma.subject.findUnique({
      where: { id: parseInt(subjectId) }
    });

    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }

    const where = {
      subjectId: parseInt(subjectId)
    };

    if (className || section) {
      where.student = {};
      if (className) where.student.class = className;
      if (section) where.student.section = section;
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
            section: true
          }
        }
      },
      orderBy: [
        { student: { class: 'asc' } },
        { student: { section: 'asc' } },
        { student: { rollNo: 'asc' } }
      ]
    });

    // Calculate statistics
    const allMarks = marks.map(m => m.marks);
    const average = allMarks.length > 0 ? allMarks.reduce((sum, mark) => sum + mark, 0) / allMarks.length : 0;
    const highest = allMarks.length > 0 ? Math.max(...allMarks) : 0;
    const lowest = allMarks.length > 0 ? Math.min(...allMarks) : 0;

    // Grade distribution
    const gradeDistribution = marks.reduce((acc, mark) => {
      acc[mark.grade] = (acc[mark.grade] || 0) + 1;
      return acc;
    }, {});

    res.json({
      subject,
      statistics: {
        totalStudents: marks.length,
        average: parseFloat(average.toFixed(2)),
        highest,
        lowest,
        gradeDistribution
      },
      marks
    });
  } catch (error) {
    console.error('Get subject report error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSummaryReport,
  getAnalytics,
  generateCertificate,
  getClassReport,
  getSubjectReport
};
