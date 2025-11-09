const { PrismaClient } = require('@prisma/client');
const pdfService = require('../services/pdf.service');
const emailService = require('../services/email.service');
const crypto = require('crypto');

const prisma = new PrismaClient();

const getAllCertificates = async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, type, status, search } = req.query;

    const where = {};
    if (studentId) where.studentId = parseInt(studentId);
    if (type) where.type = type;
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { certificateNo: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { verificationCode: { contains: search, mode: 'insensitive' } }
      ];
    }

    const certificates = await prisma.certificate.findMany({
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
        examResult: {
          include: {
            exam: {
              select: {
                id: true,
                name: true,
                code: true
              }
            }
          }
        },
        template: {
          select: {
            id: true,
            name: true,
            type: true
          }
        },
        issuedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.certificate.count({ where });

    res.json({
      certificates,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCertificateById = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            rollNo: true,
            class: true,
            section: true,
            dateOfBirth: true,
            school: {
              select: {
                id: true,
                name: true,
                code: true,
                address: true
              }
            }
          }
        },
        examResult: {
          include: {
            exam: {
              select: {
                id: true,
                name: true,
                code: true,
                examType: true
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
          }
        },
        template: true,
        issuedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        bills: {
          include: {
            payments: true
          }
        }
      }
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json({ certificate });
  } catch (error) {
    console.error('Get certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createCertificate = async (req, res) => {
  try {
    const {
      studentId,
      examResultId,
      type,
      title,
      description,
      templateId,
      validUntil
    } = req.body;

    // Generate unique certificate number and verification code
    const certificateNo = await generateCertificateNumber(type);
    const verificationCode = generateVerificationCode();

    // Get student and exam result data
    const student = await prisma.student.findUnique({
      where: { id: parseInt(studentId) },
      include: {
        school: true
      }
    });

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    let examResult = null;
    if (examResultId) {
      examResult = await prisma.examResult.findUnique({
        where: { id: parseInt(examResultId) },
        include: {
          exam: true,
          subjectResults: {
            include: {
              subject: true
            }
          }
        }
      });
    }

    // Get template
    const template = templateId
      ? await prisma.certificateTemplate.findUnique({
          where: { id: parseInt(templateId) }
        })
      : await prisma.certificateTemplate.findFirst({
          where: { type, isDefault: true }
        });

    // Prepare template data
    const templateData = {
      student: {
        name: student.name,
        rollNo: student.rollNo,
        class: student.class,
        section: student.section,
        dateOfBirth: student.dateOfBirth
      },
      school: student.school,
      examResult,
      certificateNo,
      verificationCode,
      issueDate: new Date(),
      validUntil: validUntil ? new Date(validUntil) : null
    };

    // Create certificate
    const certificate = await prisma.certificate.create({
      data: {
        certificateNo,
        type,
        title,
        description,
        verificationCode,
        studentId: parseInt(studentId),
        examResultId: examResultId ? parseInt(examResultId) : null,
        templateId: template?.id,
        issuedById: req.user.id,
        validUntil: validUntil ? new Date(validUntil) : null,
        templateData,
        status: 'PENDING'
      },
      include: {
        student: {
          include: {
            school: true
          }
        },
        template: true
      }
    });

    res.status(201).json({
      message: 'Certificate created successfully',
      certificate
    });
  } catch (error) {
    console.error('Create certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateCertificatePDF = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: {
          include: {
            school: true
          }
        },
        examResult: {
          include: {
            exam: true,
            subjectResults: {
              include: {
                subject: true
              }
            }
          }
        },
        template: true
      }
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Generate PDF
    const pdfBuffer = await pdfService.generateCertificate({
      ...certificate.templateData,
      template: certificate.template,
      certificateId: certificate.id,
      type: certificate.type
    });

    // Save PDF path (in production, save to cloud storage)
    const pdfPath = `certificates/${certificate.certificateNo}.pdf`;

    await prisma.certificate.update({
      where: { id: parseInt(id) },
      data: {
        pdfPath,
        status: 'READY'
      }
    });

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateNo}.pdf"`);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Generate certificate PDF error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const downloadCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(id) }
    });

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (certificate.status !== 'READY' && certificate.status !== 'ISSUED') {
      return res.status(400).json({ error: 'Certificate is not ready for download' });
    }

    // Update download count
    await prisma.certificate.update({
      where: { id: parseInt(id) },
      data: {
        downloadCount: { increment: 1 },
        lastDownloaded: new Date(),
        status: 'ISSUED'
      }
    });

    // In production, serve from cloud storage
    // For now, regenerate the PDF
    const certificateWithData = await prisma.certificate.findUnique({
      where: { id: parseInt(id) },
      include: {
        student: {
          include: {
            school: true
          }
        },
        examResult: {
          include: {
            exam: true,
            subjectResults: {
              include: {
                subject: true
              }
            }
          }
        },
        template: true
      }
    });

    const pdfBuffer = await pdfService.generateCertificate({
      ...certificateWithData.templateData,
      template: certificateWithData.template,
      certificateId: certificateWithData.id,
      type: certificateWithData.type
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateNo}.pdf"`);

    res.send(pdfBuffer);
  } catch (error) {
    console.error('Download certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const verifyCertificate = async (req, res) => {
  try {
    const { verificationCode } = req.params;

    const certificate = await prisma.certificate.findUnique({
      where: { verificationCode },
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
                name: true,
                code: true
              }
            }
          }
        },
        examResult: {
          include: {
            exam: {
              select: {
                name: true,
                code: true
              }
            }
          }
        }
      }
    });

    if (!certificate) {
      return res.status(404).json({
        valid: false,
        error: 'Certificate not found or invalid verification code'
      });
    }

    // Check if certificate is valid
    const isValid = certificate.status === 'ISSUED' || certificate.status === 'DELIVERED';
    const isExpired = certificate.validUntil && new Date() > new Date(certificate.validUntil);

    res.json({
      valid: isValid && !isExpired,
      certificate: isValid ? {
        certificateNo: certificate.certificateNo,
        type: certificate.type,
        title: certificate.title,
        issueDate: certificate.issueDate,
        validUntil: certificate.validUntil,
        student: certificate.student,
        examResult: certificate.examResult,
        isExpired
      } : null
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const bulkGenerateCertificates = async (req, res) => {
  try {
    const {
      examId,
      type,
      templateId,
      studentIds = [],
      title,
      description
    } = req.body;

    // Get exam results
    const where = { examId: parseInt(examId) };
    if (studentIds.length > 0) {
      where.studentId = { in: studentIds.map(id => parseInt(id)) };
    }

    const examResults = await prisma.examResult.findMany({
      where,
      include: {
        student: {
          include: {
            school: true
          }
        },
        exam: true,
        subjectResults: {
          include: {
            subject: true
          }
        }
      }
    });

    if (examResults.length === 0) {
      return res.status(404).json({ error: 'No exam results found' });
    }

    const certificates = [];
    const errors = [];

    // Create certificates for each student
    for (const examResult of examResults) {
      try {
        const certificateNo = await generateCertificateNumber(type);
        const verificationCode = generateVerificationCode();

        const templateData = {
          student: {
            name: examResult.student.name,
            rollNo: examResult.student.rollNo,
            class: examResult.student.class,
            section: examResult.student.section
          },
          school: examResult.student.school,
          examResult,
          certificateNo,
          verificationCode,
          issueDate: new Date()
        };

        const certificate = await prisma.certificate.create({
          data: {
            certificateNo,
            type,
            title: title || `${type.replace('_', ' ').toUpperCase()} - ${examResult.exam.name}`,
            description,
            verificationCode,
            studentId: examResult.studentId,
            examResultId: examResult.id,
            templateId: templateId ? parseInt(templateId) : null,
            issuedById: req.user.id,
            templateData,
            status: 'PENDING'
          }
        });

        certificates.push(certificate);
      } catch (error) {
        errors.push({
          studentId: examResult.studentId,
          studentName: examResult.student.name,
          error: error.message
        });
      }
    }

    res.json({
      message: 'Bulk certificate generation completed',
      successCount: certificates.length,
      errorCount: errors.length,
      certificates,
      errors
    });
  } catch (error) {
    console.error('Bulk generate certificates error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateCertificateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks } = req.body;

    const certificate = await prisma.certificate.update({
      where: { id: parseInt(id) },
      data: {
        status,
        ...(remarks && { description: remarks })
      }
    });

    res.json({
      message: 'Certificate status updated successfully',
      certificate
    });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    console.error('Update certificate status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCertificateStatistics = async (req, res) => {
  try {
    const { schoolId, timeRange = '30' } = req.query;
    const days = parseInt(timeRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const where = {
      createdAt: { gte: startDate }
    };

    if (schoolId) {
      where.student = { schoolId: parseInt(schoolId) };
    }

    // Total certificates
    const totalCertificates = await prisma.certificate.count({ where });

    // Status distribution
    const statusDistribution = await prisma.certificate.groupBy({
      by: ['status'],
      where,
      _count: { status: true }
    });

    // Type distribution
    const typeDistribution = await prisma.certificate.groupBy({
      by: ['type'],
      where,
      _count: { type: true }
    });

    // Recent activity
    const recentCertificates = await prisma.certificate.findMany({
      where,
      include: {
        student: {
          select: {
            name: true,
            rollNo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      totalCertificates,
      statusDistribution: statusDistribution.map(item => ({
        status: item.status,
        count: item._count.status
      })),
      typeDistribution: typeDistribution.map(item => ({
        type: item.type,
        count: item._count.type
      })),
      recentCertificates
    });
  } catch (error) {
    console.error('Get certificate statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper functions
const generateCertificateNumber = async (type) => {
  const year = new Date().getFullYear();
  const typePrefix = type.substring(0, 3).toUpperCase();

  // Get the count of certificates of this type this year
  const count = await prisma.certificate.count({
    where: {
      type,
      createdAt: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`)
      }
    }
  });

  const sequence = (count + 1).toString().padStart(4, '0');
  return `${typePrefix}${year}${sequence}`;
};

const generateVerificationCode = () => {
  return crypto.randomBytes(16).toString('hex').toUpperCase();
};

module.exports = {
  getAllCertificates,
  getCertificateById,
  createCertificate,
  generateCertificatePDF,
  downloadCertificate,
  verifyCertificate,
  bulkGenerateCertificates,
  updateCertificateStatus,
  getCertificateStatistics
};
