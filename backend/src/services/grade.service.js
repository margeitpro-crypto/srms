const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class GradeService {
  constructor() {
    // Grade boundaries for different grading systems
    this.gradingSchemes = {
      nepal: {
        'A+': { min: 90, max: 100, points: 4.0 },
        'A': { min: 80, max: 89, points: 3.6 },
        'B+': { min: 70, max: 79, points: 3.2 },
        'B': { min: 60, max: 69, points: 2.8 },
        'C+': { min: 50, max: 59, points: 2.4 },
        'C': { min: 40, max: 49, points: 2.0 },
        'D+': { min: 35, max: 39, points: 1.6 },
        'D': { min: 32, max: 34, points: 1.2 },
        'F': { min: 0, max: 31, points: 0.0 }
      },
      international: {
        'A+': { min: 97, max: 100, points: 4.0 },
        'A': { min: 93, max: 96, points: 3.7 },
        'A-': { min: 90, max: 92, points: 3.3 },
        'B+': { min: 87, max: 89, points: 3.0 },
        'B': { min: 83, max: 86, points: 2.7 },
        'B-': { min: 80, max: 82, points: 2.3 },
        'C+': { min: 77, max: 79, points: 2.0 },
        'C': { min: 73, max: 76, points: 1.7 },
        'C-': { min: 70, max: 72, points: 1.3 },
        'D': { min: 60, max: 69, points: 1.0 },
        'F': { min: 0, max: 59, points: 0.0 }
      }
    };

    // Default scheme
    this.defaultScheme = 'nepal';
  }

  /**
   * Calculate grade based on marks using specified grading scheme
   */
  calculateGrade(marks, scheme = this.defaultScheme) {
    if (marks < 0 || marks > 100) {
      throw new Error('Marks must be between 0 and 100');
    }

    const gradingScheme = this.gradingSchemes[scheme];
    if (!gradingScheme) {
      throw new Error(`Grading scheme '${scheme}' not found`);
    }

    for (const [grade, range] of Object.entries(gradingScheme)) {
      if (marks >= range.min && marks <= range.max) {
        return {
          grade,
          points: range.points,
          percentage: marks,
          description: this.getGradeDescription(grade)
        };
      }
    }

    return {
      grade: 'F',
      points: 0.0,
      percentage: marks,
      description: 'Fail'
    };
  }

  /**
   * Calculate GPA from multiple subjects
   */
  calculateGPA(marks, scheme = this.defaultScheme) {
    if (!Array.isArray(marks) || marks.length === 0) {
      return 0.0;
    }

    const totalPoints = marks.reduce((sum, mark) => {
      const gradeInfo = this.calculateGrade(mark, scheme);
      return sum + gradeInfo.points;
    }, 0);

    return Math.round((totalPoints / marks.length) * 100) / 100;
  }

  /**
   * Calculate CGPA from multiple semesters/terms
   */
  calculateCGPA(semesterGPAs, creditHours = null) {
    if (!Array.isArray(semesterGPAs) || semesterGPAs.length === 0) {
      return 0.0;
    }

    if (creditHours && creditHours.length === semesterGPAs.length) {
      // Weighted CGPA calculation
      const totalWeightedPoints = semesterGPAs.reduce((sum, gpa, index) => {
        return sum + (gpa * creditHours[index]);
      }, 0);

      const totalCredits = creditHours.reduce((sum, credits) => sum + credits, 0);
      return Math.round((totalWeightedPoints / totalCredits) * 100) / 100;
    } else {
      // Simple average
      const totalGPA = semesterGPAs.reduce((sum, gpa) => sum + gpa, 0);
      return Math.round((totalGPA / semesterGPAs.length) * 100) / 100;
    }
  }

  /**
   * Get grade description
   */
  getGradeDescription(grade) {
    const descriptions = {
      'A+': 'Outstanding',
      'A': 'Excellent',
      'A-': 'Very Good',
      'B+': 'Good',
      'B': 'Above Average',
      'B-': 'Average Plus',
      'C+': 'Average',
      'C': 'Below Average',
      'C-': 'Satisfactory',
      'D+': 'Partially Satisfactory',
      'D': 'Insufficient',
      'F': 'Fail'
    };

    return descriptions[grade] || 'Unknown';
  }

  /**
   * Get class/division based on percentage
   */
  getClassDivision(percentage) {
    if (percentage >= 80) return 'Distinction';
    if (percentage >= 60) return 'First Division';
    if (percentage >= 45) return 'Second Division';
    if (percentage >= 32) return 'Third Division';
    return 'Fail';
  }

  /**
   * Calculate student's complete academic record
   */
  async calculateStudentRecord(studentId, examType = 'FINAL') {
    try {
      const student = await prisma.student.findUnique({
        where: { id: parseInt(studentId) },
        include: {
          school: true,
          marks: {
            where: { examType },
            include: {
              subject: true
            }
          }
        }
      });

      if (!student) {
        throw new Error('Student not found');
      }

      if (student.marks.length === 0) {
        return {
          student: {
            id: student.id,
            name: student.name,
            rollNo: student.rollNo,
            class: student.class,
            section: student.section
          },
          school: student.school,
          summary: {
            totalSubjects: 0,
            totalMarks: 0,
            averageMarks: 0,
            overallGrade: 'F',
            gpa: 0.0,
            division: 'Fail',
            status: 'No marks available'
          },
          subjects: []
        };
      }

      const subjectResults = student.marks.map(mark => {
        const gradeInfo = this.calculateGrade(mark.marks);
        return {
          subject: mark.subject,
          marks: mark.marks,
          maxMarks: mark.maxMarks,
          grade: gradeInfo.grade,
          gradePoints: gradeInfo.points,
          description: gradeInfo.description
        };
      });

      const totalMarks = student.marks.reduce((sum, mark) => sum + mark.marks, 0);
      const averageMarks = totalMarks / student.marks.length;
      const overallGradeInfo = this.calculateGrade(averageMarks);

      const allMarks = student.marks.map(mark => mark.marks);
      const gpa = this.calculateGPA(allMarks);

      const division = this.getClassDivision(averageMarks);
      const status = overallGradeInfo.grade === 'F' ? 'Fail' : 'Pass';

      return {
        student: {
          id: student.id,
          name: student.name,
          rollNo: student.rollNo,
          class: student.class,
          section: student.section
        },
        school: student.school,
        summary: {
          totalSubjects: student.marks.length,
          totalMarks: Math.round(totalMarks * 100) / 100,
          averageMarks: Math.round(averageMarks * 100) / 100,
          overallGrade: overallGradeInfo.grade,
          gpa: gpa,
          division: division,
          status: status
        },
        subjects: subjectResults,
        examType: examType,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error calculating student record: ${error.message}`);
    }
  }

  /**
   * Calculate class statistics
   */
  async calculateClassStatistics(className, section = null, examType = 'FINAL') {
    try {
      const whereClause = {
        class: className,
        ...(section && { section }),
        marks: {
          some: { examType }
        }
      };

      const students = await prisma.student.findMany({
        where: whereClause,
        include: {
          marks: {
            where: { examType },
            include: { subject: true }
          }
        }
      });

      if (students.length === 0) {
        return {
          classInfo: { class: className, section, totalStudents: 0 },
          statistics: {
            averagePercentage: 0,
            averageGPA: 0,
            highestMarks: 0,
            lowestMarks: 0,
            passCount: 0,
            failCount: 0,
            gradeDistribution: {},
            divisionDistribution: {}
          }
        };
      }

      const studentStats = [];
      const allPercentages = [];
      const allGPAs = [];

      for (const student of students) {
        if (student.marks.length === 0) continue;

        const totalMarks = student.marks.reduce((sum, mark) => sum + mark.marks, 0);
        const averageMarks = totalMarks / student.marks.length;
        const marksArray = student.marks.map(mark => mark.marks);
        const gpa = this.calculateGPA(marksArray);
        const gradeInfo = this.calculateGrade(averageMarks);
        const division = this.getClassDivision(averageMarks);

        studentStats.push({
          studentId: student.id,
          name: student.name,
          rollNo: student.rollNo,
          averageMarks,
          gpa,
          grade: gradeInfo.grade,
          division,
          status: gradeInfo.grade === 'F' ? 'Fail' : 'Pass'
        });

        allPercentages.push(averageMarks);
        allGPAs.push(gpa);
      }

      // Calculate aggregate statistics
      const averagePercentage = allPercentages.reduce((sum, p) => sum + p, 0) / allPercentages.length;
      const averageGPA = allGPAs.reduce((sum, g) => sum + g, 0) / allGPAs.length;
      const highestMarks = Math.max(...allPercentages);
      const lowestMarks = Math.min(...allPercentages);

      const passCount = studentStats.filter(s => s.status === 'Pass').length;
      const failCount = studentStats.filter(s => s.status === 'Fail').length;

      // Grade distribution
      const gradeDistribution = studentStats.reduce((acc, student) => {
        acc[student.grade] = (acc[student.grade] || 0) + 1;
        return acc;
      }, {});

      // Division distribution
      const divisionDistribution = studentStats.reduce((acc, student) => {
        acc[student.division] = (acc[student.division] || 0) + 1;
        return acc;
      }, {});

      return {
        classInfo: {
          class: className,
          section: section || 'All',
          totalStudents: students.length,
          studentsWithMarks: studentStats.length
        },
        statistics: {
          averagePercentage: Math.round(averagePercentage * 100) / 100,
          averageGPA: Math.round(averageGPA * 100) / 100,
          highestMarks: Math.round(highestMarks * 100) / 100,
          lowestMarks: Math.round(lowestMarks * 100) / 100,
          passCount,
          failCount,
          passPercentage: Math.round((passCount / studentStats.length) * 10000) / 100,
          gradeDistribution,
          divisionDistribution
        },
        students: studentStats.sort((a, b) => b.averageMarks - a.averageMarks),
        examType,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error calculating class statistics: ${error.message}`);
    }
  }

  /**
   * Calculate subject-wise performance analysis
   */
  async calculateSubjectAnalysis(subjectId, className = null, section = null) {
    try {
      const whereClause = {
        subjectId: parseInt(subjectId),
        ...(className && { student: { class: className, ...(section && { section }) } })
      };

      const marks = await prisma.marks.findMany({
        where: whereClause,
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
          subject: true
        }
      });

      if (marks.length === 0) {
        return {
          subject: null,
          statistics: {
            totalStudents: 0,
            averageMarks: 0,
            highestMarks: 0,
            lowestMarks: 0,
            passCount: 0,
            failCount: 0
          }
        };
      }

      const subject = marks[0].subject;
      const allMarks = marks.map(m => m.marks);

      const averageMarks = allMarks.reduce((sum, m) => sum + m, 0) / allMarks.length;
      const highestMarks = Math.max(...allMarks);
      const lowestMarks = Math.min(...allMarks);

      const gradeDistribution = {};
      const studentPerformance = [];
      let passCount = 0;

      marks.forEach(mark => {
        const gradeInfo = this.calculateGrade(mark.marks);
        gradeDistribution[gradeInfo.grade] = (gradeDistribution[gradeInfo.grade] || 0) + 1;

        if (gradeInfo.grade !== 'F') passCount++;

        studentPerformance.push({
          student: mark.student,
          marks: mark.marks,
          grade: gradeInfo.grade,
          gradePoints: gradeInfo.points,
          status: gradeInfo.grade === 'F' ? 'Fail' : 'Pass'
        });
      });

      const failCount = marks.length - passCount;

      return {
        subject: {
          id: subject.id,
          name: subject.name,
          code: subject.code
        },
        filterCriteria: {
          class: className || 'All',
          section: section || 'All'
        },
        statistics: {
          totalStudents: marks.length,
          averageMarks: Math.round(averageMarks * 100) / 100,
          highestMarks,
          lowestMarks,
          passCount,
          failCount,
          passPercentage: Math.round((passCount / marks.length) * 10000) / 100,
          gradeDistribution
        },
        students: studentPerformance.sort((a, b) => b.marks - a.marks),
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Error calculating subject analysis: ${error.message}`);
    }
  }

  /**
   * Get grading scheme information
   */
  getGradingScheme(scheme = this.defaultScheme) {
    return this.gradingSchemes[scheme] || null;
  }

  /**
   * Update grade boundaries (for admin use)
   */
  updateGradingScheme(scheme, newBoundaries) {
    if (!this.gradingSchemes[scheme]) {
      throw new Error(`Grading scheme '${scheme}' not found`);
    }

    // Validate new boundaries
    for (const [grade, range] of Object.entries(newBoundaries)) {
      if (typeof range.min !== 'number' || typeof range.max !== 'number' || typeof range.points !== 'number') {
        throw new Error(`Invalid range data for grade '${grade}'`);
      }
      if (range.min < 0 || range.max > 100 || range.min > range.max) {
        throw new Error(`Invalid range values for grade '${grade}'`);
      }
    }

    this.gradingSchemes[scheme] = newBoundaries;
    return true;
  }

  /**
   * Bulk grade calculation for multiple students
   */
  async bulkCalculateGrades(studentIds, examType = 'FINAL') {
    try {
      const results = [];

      for (const studentId of studentIds) {
        try {
          const record = await this.calculateStudentRecord(studentId, examType);
          results.push({
            success: true,
            studentId,
            data: record
          });
        } catch (error) {
          results.push({
            success: false,
            studentId,
            error: error.message
          });
        }
      }

      return results;
    } catch (error) {
      throw new Error(`Error in bulk grade calculation: ${error.message}`);
    }
  }
}

module.exports = new GradeService();
