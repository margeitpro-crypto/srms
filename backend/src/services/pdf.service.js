const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class PDFService {
  constructor() {
    this.defaultOptions = {
      size: 'A4',
      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50
      }
    };
  }

  async generateCertificate(certificateData, outputPath = null) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument(this.defaultOptions);
        const chunks = [];

        if (outputPath) {
          doc.pipe(fs.createWriteStream(outputPath));
        } else {
          doc.on('data', chunk => chunks.push(chunk));
        }

        doc.on('end', () => {
          if (!outputPath) {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
          } else {
            resolve(outputPath);
          }
        });

        doc.on('error', reject);

        this._buildCertificate(doc, certificateData);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateMarksheet(studentData, outputPath = null) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument(this.defaultOptions);
        const chunks = [];

        if (outputPath) {
          doc.pipe(fs.createWriteStream(outputPath));
        } else {
          doc.on('data', chunk => chunks.push(chunk));
        }

        doc.on('end', () => {
          if (!outputPath) {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
          } else {
            resolve(outputPath);
          }
        });

        doc.on('error', reject);

        this._buildMarksheet(doc, studentData);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  async generateClassReport(classData, outputPath = null) {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ ...this.defaultOptions, size: 'A4', layout: 'landscape' });
        const chunks = [];

        if (outputPath) {
          doc.pipe(fs.createWriteStream(outputPath));
        } else {
          doc.on('data', chunk => chunks.push(chunk));
        }

        doc.on('end', () => {
          if (!outputPath) {
            const buffer = Buffer.concat(chunks);
            resolve(buffer);
          } else {
            resolve(outputPath);
          }
        });

        doc.on('error', reject);

        this._buildClassReport(doc, classData);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  _buildCertificate(doc, data) {
    const { student, school, results, summary, certificateId, issueDate } = data;

    // Header with school logo placeholder and title
    doc.fontSize(24)
       .font('Helvetica-Bold')
       .text('Nepal National School Result Management System', 50, 80, { align: 'center' });

    doc.fontSize(20)
       .text('CERTIFICATE OF ACHIEVEMENT', 50, 120, { align: 'center' });

    // Decorative line
    doc.moveTo(100, 160)
       .lineTo(500, 160)
       .stroke();

    // School information
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text(school.name, 50, 200, { align: 'center' });

    doc.fontSize(12)
       .font('Helvetica')
       .text(school.address, 50, 220, { align: 'center' });

    // Certificate content
    doc.fontSize(14)
       .font('Helvetica')
       .text('This is to certify that', 50, 280, { align: 'center' });

    doc.fontSize(18)
       .font('Helvetica-Bold')
       .text(student.name.toUpperCase(), 50, 310, { align: 'center' });

    doc.fontSize(12)
       .font('Helvetica')
       .text(`Roll No: ${student.rollNo} | Class: ${student.class} | Section: ${student.section}`, 50, 340, { align: 'center' });

    doc.text('has successfully completed the examination with the following results:', 50, 370, { align: 'center' });

    // Results table
    const tableTop = 420;
    const tableLeft = 100;
    const tableWidth = 400;
    const rowHeight = 25;

    // Table headers
    doc.fontSize(10)
       .font('Helvetica-Bold');

    doc.rect(tableLeft, tableTop, tableWidth, rowHeight)
       .fillAndStroke('#f0f0f0', '#000');

    doc.fillColor('black')
       .text('Subject', tableLeft + 10, tableTop + 8)
       .text('Marks', tableLeft + 200, tableTop + 8)
       .text('Grade', tableLeft + 300, tableTop + 8);

    // Table rows
    doc.font('Helvetica');
    let currentY = tableTop + rowHeight;

    results.forEach((result, index) => {
      const fillColor = index % 2 === 0 ? '#f9f9f9' : 'white';

      doc.rect(tableLeft, currentY, tableWidth, rowHeight)
         .fillAndStroke(fillColor, '#ccc');

      doc.fillColor('black')
         .text(result.subject, tableLeft + 10, currentY + 8)
         .text(result.marks.toString(), tableLeft + 200, currentY + 8)
         .text(result.grade, tableLeft + 300, currentY + 8);

      currentY += rowHeight;
    });

    // Summary
    const summaryY = currentY + 30;
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('SUMMARY', tableLeft, summaryY);

    doc.font('Helvetica')
       .text(`Total Subjects: ${summary.totalSubjects}`, tableLeft, summaryY + 20)
       .text(`Average Marks: ${summary.averageMarks}%`, tableLeft, summaryY + 40)
       .text(`Overall Grade: ${summary.overallGrade}`, tableLeft, summaryY + 60)
       .text(`GPA: ${summary.gpa}/4.0`, tableLeft, summaryY + 80);

    // Certificate details
    const detailsY = summaryY + 120;
    doc.fontSize(10)
       .text(`Certificate ID: ${certificateId}`, 50, detailsY)
       .text(`Issue Date: ${new Date(issueDate).toLocaleDateString()}`, 50, detailsY + 15);

    // Signature section
    doc.fontSize(10)
       .text('Principal\'s Signature', 400, detailsY + 40)
       .moveTo(400, detailsY + 55)
       .lineTo(500, detailsY + 55)
       .stroke();

    // Footer
    doc.fontSize(8)
       .text('This certificate is generated electronically and is valid without signature.', 50, 750, { align: 'center' });
  }

  _buildMarksheet(doc, data) {
    const { student, marks, summary, school } = data;

    // Header
    doc.fontSize(18)
       .font('Helvetica-Bold')
       .text('STUDENT MARKSHEET', 50, 50, { align: 'center' });

    // School info
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text(school.name, 50, 90, { align: 'center' })
       .font('Helvetica')
       .text(school.address, 50, 110, { align: 'center' });

    // Student info box
    const infoBoxY = 150;
    doc.rect(50, infoBoxY, 500, 80)
       .stroke();

    doc.fontSize(11)
       .font('Helvetica-Bold')
       .text('STUDENT INFORMATION', 60, infoBoxY + 10);

    doc.font('Helvetica')
       .text(`Name: ${student.name}`, 60, infoBoxY + 30)
       .text(`Roll No: ${student.rollNo}`, 60, infoBoxY + 50)
       .text(`Class: ${student.class}`, 300, infoBoxY + 30)
       .text(`Section: ${student.section}`, 300, infoBoxY + 50);

    // Marks table
    const tableY = infoBoxY + 100;
    this._drawMarksTable(doc, marks, tableY);

    // Summary box
    const summaryY = tableY + (marks.length + 2) * 25 + 30;
    doc.rect(50, summaryY, 500, 100)
       .stroke();

    doc.fontSize(11)
       .font('Helvetica-Bold')
       .text('SUMMARY', 60, summaryY + 10);

    doc.font('Helvetica')
       .text(`Total Subjects: ${summary.totalSubjects}`, 60, summaryY + 30)
       .text(`Total Marks: ${summary.totalMarks}`, 60, summaryY + 50)
       .text(`Average: ${summary.averageMarks}%`, 300, summaryY + 30)
       .text(`Overall Grade: ${summary.overallGrade}`, 300, summaryY + 50);

    if (summary.gpa) {
      doc.text(`GPA: ${summary.gpa}/4.0`, 300, summaryY + 70);
    }

    // Footer
    const footerY = summaryY + 120;
    doc.fontSize(8)
       .text(`Generated on: ${new Date().toLocaleString()}`, 50, footerY)
       .text('This is a computer-generated document.', 50, footerY + 15);
  }

  _buildClassReport(doc, data) {
    const { classInfo, students, classStatistics } = data;

    // Header
    doc.fontSize(16)
       .font('Helvetica-Bold')
       .text('CLASS PERFORMANCE REPORT', 50, 50, { align: 'center' });

    // Class info
    doc.fontSize(12)
       .font('Helvetica')
       .text(`Class: ${classInfo.class} | Section: ${classInfo.section} | Total Students: ${classInfo.totalStudents}`, 50, 80, { align: 'center' });

    // Statistics
    doc.fontSize(10)
       .text(`Class Average: ${classStatistics.classAverage}% | Pass: ${classStatistics.passCount} | Fail: ${classStatistics.failCount}`, 50, 100, { align: 'center' });

    // Students table
    const tableY = 130;
    this._drawClassTable(doc, students, tableY);

    // Footer
    doc.fontSize(8)
       .text(`Generated on: ${new Date().toLocaleString()}`, 50, 500, { align: 'center' });
  }

  _drawMarksTable(doc, marks, startY) {
    const tableLeft = 50;
    const colWidths = [200, 100, 80, 120];
    const rowHeight = 25;

    // Headers
    doc.fontSize(10)
       .font('Helvetica-Bold');

    let currentX = tableLeft;
    const headers = ['Subject', 'Marks', 'Grade', 'Grade Points'];

    headers.forEach((header, index) => {
      doc.rect(currentX, startY, colWidths[index], rowHeight)
         .fillAndStroke('#f0f0f0', '#000');

      doc.fillColor('black')
         .text(header, currentX + 5, startY + 8);

      currentX += colWidths[index];
    });

    // Data rows
    doc.font('Helvetica');
    let currentY = startY + rowHeight;

    marks.forEach((mark, index) => {
      const fillColor = index % 2 === 0 ? '#f9f9f9' : 'white';
      currentX = tableLeft;

      const rowData = [
        mark.subject.name,
        `${mark.marks}/100`,
        mark.grade,
        this._getGradePoints(mark.grade).toString()
      ];

      rowData.forEach((data, colIndex) => {
        doc.rect(currentX, currentY, colWidths[colIndex], rowHeight)
           .fillAndStroke(fillColor, '#ccc');

        doc.fillColor('black')
           .text(data, currentX + 5, currentY + 8);

        currentX += colWidths[colIndex];
      });

      currentY += rowHeight;
    });
  }

  _drawClassTable(doc, students, startY) {
    const tableLeft = 50;
    const colWidths = [40, 150, 80, 80, 80, 100];
    const rowHeight = 20;

    // Headers
    doc.fontSize(9)
       .font('Helvetica-Bold');

    let currentX = tableLeft;
    const headers = ['S.N.', 'Student Name', 'Roll No', 'Average', 'Grade', 'Status'];

    headers.forEach((header, index) => {
      doc.rect(currentX, startY, colWidths[index], rowHeight)
         .fillAndStroke('#f0f0f0', '#000');

      doc.fillColor('black')
         .text(header, currentX + 3, startY + 6);

      currentX += colWidths[index];
    });

    // Data rows
    doc.font('Helvetica');
    let currentY = startY + rowHeight;

    students.forEach((studentData, index) => {
      if (currentY > 480) { // Page break
        doc.addPage();
        currentY = 50;
      }

      const fillColor = index % 2 === 0 ? '#f9f9f9' : 'white';
      currentX = tableLeft;

      const rowData = [
        (index + 1).toString(),
        studentData.student.name,
        studentData.student.rollNo,
        `${studentData.summary.averageMarks}%`,
        studentData.summary.overallGrade,
        studentData.summary.overallGrade === 'F' ? 'Fail' : 'Pass'
      ];

      rowData.forEach((data, colIndex) => {
        doc.rect(currentX, currentY, colWidths[colIndex], rowHeight)
           .fillAndStroke(fillColor, '#ccc');

        doc.fillColor('black')
           .text(data, currentX + 3, currentY + 6);

        currentX += colWidths[colIndex];
      });

      currentY += rowHeight;
    });
  }

  _getGradePoints(grade) {
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
    return gradePoints[grade] || 0.0;
  }

  async generateBulkCertificates(certificatesData, outputDir) {
    const results = [];

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const certData of certificatesData) {
      try {
        const filename = `certificate_${certData.student.rollNo}_${Date.now()}.pdf`;
        const outputPath = path.join(outputDir, filename);

        await this.generateCertificate(certData, outputPath);

        results.push({
          success: true,
          studentName: certData.student.name,
          rollNo: certData.student.rollNo,
          filename,
          path: outputPath
        });
      } catch (error) {
        results.push({
          success: false,
          studentName: certData.student.name,
          rollNo: certData.student.rollNo,
          error: error.message
        });
      }
    }

    return results;
  }

  // Utility method to create directory if it doesn't exist
  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  // Method to clean up old PDF files
  cleanupOldFiles(directory, maxAgeHours = 24) {
    if (!fs.existsSync(directory)) return;

    const files = fs.readdirSync(directory);
    const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
    const now = Date.now();

    files.forEach(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);

      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old file: ${file}`);
      }
    });
  }
}

module.exports = new PDFService();
