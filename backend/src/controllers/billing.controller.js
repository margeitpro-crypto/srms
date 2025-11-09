const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const getAllBills = async (req, res) => {
  try {
    const { page = 1, limit = 10, studentId, status, billType, search } = req.query;

    const where = {};
    if (studentId) where.studentId = parseInt(studentId);
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { billNo: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Handle both exam bills and certificate bills
    let examBills = [];
    let certificateBills = [];

    if (!billType || billType === 'exam') {
      examBills = await prisma.bill.findMany({
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
          examFee: {
            include: {
              exam: {
                select: {
                  id: true,
                  name: true,
                  code: true
                }
              },
              feeStructure: {
                select: {
                  id: true,
                  name: true,
                  type: true
                }
              }
            }
          },
          payments: {
            orderBy: { createdAt: 'desc' }
          }
        },
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      });
    }

    if (!billType || billType === 'certificate') {
      certificateBills = await prisma.certificateBill.findMany({
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
          certificate: {
            select: {
              id: true,
              certificateNo: true,
              type: true,
              title: true
            }
          },
          certificateFee: {
            include: {
              feeStructure: {
                select: {
                  id: true,
                  name: true,
                  type: true
                }
              }
            }
          },
          payments: {
            orderBy: { createdAt: 'desc' }
          }
        },
        skip: (page - 1) * limit,
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' }
      });
    }

    // Combine and format bills
    const bills = [
      ...examBills.map(bill => ({
        ...bill,
        billType: 'exam',
        relatedItem: bill.examFee?.exam
      })),
      ...certificateBills.map(bill => ({
        ...bill,
        billType: 'certificate',
        relatedItem: bill.certificate
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const totalExam = billType !== 'certificate' ? await prisma.bill.count({ where }) : 0;
    const totalCertificate = billType !== 'exam' ? await prisma.certificateBill.count({ where }) : 0;
    const total = totalExam + totalCertificate;

    res.json({
      bills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get bills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBillById = async (req, res) => {
  try {
    const { id, type = 'exam' } = req.params;

    let bill;
    if (type === 'exam') {
      bill = await prisma.bill.findUnique({
        where: { id: parseInt(id) },
        include: {
          student: {
            include: {
              school: true
            }
          },
          examFee: {
            include: {
              exam: true,
              feeStructure: true
            }
          },
          payments: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } else {
      bill = await prisma.certificateBill.findUnique({
        where: { id: parseInt(id) },
        include: {
          student: {
            include: {
              school: true
            }
          },
          certificate: true,
          certificateFee: {
            include: {
              feeStructure: true
            }
          },
          payments: {
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    res.json({
      bill: {
        ...bill,
        billType: type
      }
    });
  } catch (error) {
    console.error('Get bill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createExamBill = async (req, res) => {
  try {
    const {
      studentId,
      examId,
      feeStructureId,
      dueDate,
      description
    } = req.body;

    // Get fee structure
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: parseInt(feeStructureId) }
    });

    if (!feeStructure) {
      return res.status(404).json({ error: 'Fee structure not found' });
    }

    // Create or get exam fee
    const examFee = await prisma.examFee.upsert({
      where: {
        examId_studentId: {
          examId: parseInt(examId),
          studentId: parseInt(studentId)
        }
      },
      update: {},
      create: {
        examId: parseInt(examId),
        studentId: parseInt(studentId),
        feeStructureId: parseInt(feeStructureId),
        amount: feeStructure.amount,
        currency: feeStructure.currency,
        dueDate: dueDate ? new Date(dueDate) : null
      }
    });

    // Generate bill number
    const billNo = await generateBillNumber('EXAM');

    // Create bill
    const bill = await prisma.bill.create({
      data: {
        billNo,
        studentId: parseInt(studentId),
        examFeeId: examFee.id,
        totalAmount: feeStructure.amount,
        balance: feeStructure.amount,
        currency: feeStructure.currency,
        dueDate: dueDate ? new Date(dueDate) : null,
        description: description || `Exam fee for ${examFee.exam?.name}`,
        status: 'PENDING'
      },
      include: {
        student: {
          include: {
            school: true
          }
        },
        examFee: {
          include: {
            exam: true,
            feeStructure: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Exam bill created successfully',
      bill: {
        ...bill,
        billType: 'exam'
      }
    });
  } catch (error) {
    console.error('Create exam bill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createCertificateBill = async (req, res) => {
  try {
    const {
      studentId,
      certificateId,
      feeStructureId,
      quantity = 1,
      dueDate,
      description
    } = req.body;

    // Get fee structure
    const feeStructure = await prisma.feeStructure.findUnique({
      where: { id: parseInt(feeStructureId) }
    });

    if (!feeStructure) {
      return res.status(404).json({ error: 'Fee structure not found' });
    }

    // Create certificate fee
    const certificateFee = await prisma.certificateFee.create({
      data: {
        studentId: parseInt(studentId),
        feeStructureId: parseInt(feeStructureId),
        amount: feeStructure.amount,
        quantity: parseInt(quantity),
        totalAmount: feeStructure.amount * parseInt(quantity),
        currency: feeStructure.currency
      }
    });

    // Generate bill number
    const billNo = await generateBillNumber('CERT');

    // Create certificate bill
    const bill = await prisma.certificateBill.create({
      data: {
        billNo,
        studentId: parseInt(studentId),
        certificateId: certificateId ? parseInt(certificateId) : null,
        certificateFeeId: certificateFee.id,
        totalAmount: certificateFee.totalAmount,
        balance: certificateFee.totalAmount,
        currency: feeStructure.currency,
        quantity: parseInt(quantity),
        unitPrice: feeStructure.amount,
        dueDate: dueDate ? new Date(dueDate) : null,
        description: description || `Certificate fee - ${feeStructure.name}`,
        status: 'PENDING'
      },
      include: {
        student: {
          include: {
            school: true
          }
        },
        certificate: true,
        certificateFee: {
          include: {
            feeStructure: true
          }
        }
      }
    });

    res.status(201).json({
      message: 'Certificate bill created successfully',
      bill: {
        ...bill,
        billType: 'certificate'
      }
    });
  } catch (error) {
    console.error('Create certificate bill error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const processPayment = async (req, res) => {
  try {
    const { billId, billType = 'exam' } = req.params;
    const {
      amount,
      method,
      transactionId,
      gatewayRef,
      remarks
    } = req.body;

    // Get bill
    let bill;
    if (billType === 'exam') {
      bill = await prisma.bill.findUnique({
        where: { id: parseInt(billId) }
      });
    } else {
      bill = await prisma.certificateBill.findUnique({
        where: { id: parseInt(billId) }
      });
    }

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    if (bill.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Bill is already paid' });
    }

    const paymentAmount = parseFloat(amount);
    if (paymentAmount > bill.balance) {
      return res.status(400).json({ error: 'Payment amount exceeds balance' });
    }

    // Generate payment ID
    const paymentId = generatePaymentId();

    // Create payment record
    let payment;
    if (billType === 'exam') {
      payment = await prisma.payment.create({
        data: {
          paymentId,
          billId: parseInt(billId),
          amount: paymentAmount,
          currency: bill.currency,
          method,
          transactionId,
          gatewayRef,
          remarks,
          status: 'COMPLETED',
          paidAt: new Date(),
          processedById: req.user.id
        }
      });
    } else {
      payment = await prisma.certificatePayment.create({
        data: {
          paymentId,
          certificateBillId: parseInt(billId),
          amount: paymentAmount,
          currency: bill.currency,
          method,
          transactionId,
          gatewayRef,
          remarks,
          status: 'COMPLETED',
          paidAt: new Date(),
          processedById: req.user.id
        }
      });
    }

    // Update bill
    const newPaidAmount = bill.paidAmount + paymentAmount;
    const newBalance = bill.totalAmount - newPaidAmount;
    const newStatus = newBalance <= 0 ? 'COMPLETED' : 'PARTIALLY_PAID';

    if (billType === 'exam') {
      await prisma.bill.update({
        where: { id: parseInt(billId) },
        data: {
          paidAmount: newPaidAmount,
          balance: newBalance,
          status: newStatus
        }
      });
    } else {
      await prisma.certificateBill.update({
        where: { id: parseInt(billId) },
        data: {
          paidAmount: newPaidAmount,
          balance: newBalance,
          status: newStatus
        }
      });
    }

    res.json({
      message: 'Payment processed successfully',
      payment,
      billStatus: newStatus,
      remainingBalance: newBalance
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBillingStatistics = async (req, res) => {
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

    // Exam bills statistics
    const examBillsTotal = await prisma.bill.count({ where });
    const examBillsAmount = await prisma.bill.aggregate({
      where,
      _sum: { totalAmount: true, paidAmount: true }
    });

    const examBillsStatus = await prisma.bill.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
      _sum: { totalAmount: true, paidAmount: true }
    });

    // Certificate bills statistics
    const certBillsTotal = await prisma.certificateBill.count({ where });
    const certBillsAmount = await prisma.certificateBill.aggregate({
      where,
      _sum: { totalAmount: true, paidAmount: true }
    });

    const certBillsStatus = await prisma.certificateBill.groupBy({
      by: ['status'],
      where,
      _count: { status: true },
      _sum: { totalAmount: true, paidAmount: true }
    });

    // Payment methods distribution
    const paymentMethods = await prisma.payment.groupBy({
      by: ['method'],
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED'
      },
      _count: { method: true },
      _sum: { amount: true }
    });

    const certPaymentMethods = await prisma.certificatePayment.groupBy({
      by: ['method'],
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED'
      },
      _count: { method: true },
      _sum: { amount: true }
    });

    // Recent transactions
    const recentPayments = await prisma.payment.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED'
      },
      include: {
        bill: {
          include: {
            student: {
              select: {
                name: true,
                rollNo: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    const recentCertPayments = await prisma.certificatePayment.findMany({
      where: {
        createdAt: { gte: startDate },
        status: 'COMPLETED'
      },
      include: {
        certificateBill: {
          include: {
            student: {
              select: {
                name: true,
                rollNo: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    res.json({
      totalBills: examBillsTotal + certBillsTotal,
      totalAmount: (examBillsAmount._sum.totalAmount || 0) + (certBillsAmount._sum.totalAmount || 0),
      totalPaid: (examBillsAmount._sum.paidAmount || 0) + (certBillsAmount._sum.paidAmount || 0),
      examBills: {
        total: examBillsTotal,
        totalAmount: examBillsAmount._sum.totalAmount || 0,
        paidAmount: examBillsAmount._sum.paidAmount || 0,
        statusDistribution: examBillsStatus.map(item => ({
          status: item.status,
          count: item._count.status,
          totalAmount: item._sum.totalAmount,
          paidAmount: item._sum.paidAmount
        }))
      },
      certificateBills: {
        total: certBillsTotal,
        totalAmount: certBillsAmount._sum.totalAmount || 0,
        paidAmount: certBillsAmount._sum.paidAmount || 0,
        statusDistribution: certBillsStatus.map(item => ({
          status: item.status,
          count: item._count.status,
          totalAmount: item._sum.totalAmount,
          paidAmount: item._sum.paidAmount
        }))
      },
      paymentMethods: [
        ...paymentMethods.map(item => ({
          method: item.method,
          count: item._count.method,
          amount: item._sum.amount,
          type: 'exam'
        })),
        ...certPaymentMethods.map(item => ({
          method: item.method,
          count: item._count.method,
          amount: item._sum.amount,
          type: 'certificate'
        }))
      ],
      recentTransactions: [
        ...recentPayments.map(payment => ({
          ...payment,
          type: 'exam',
          studentName: payment.bill?.student?.name,
          studentRollNo: payment.bill?.student?.rollNo
        })),
        ...recentCertPayments.map(payment => ({
          ...payment,
          type: 'certificate',
          studentName: payment.certificateBill?.student?.name,
          studentRollNo: payment.certificateBill?.student?.rollNo
        }))
      ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
    });
  } catch (error) {
    console.error('Get billing statistics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getOverdueBills = async (req, res) => {
  try {
    const { page = 1, limit = 10, schoolId } = req.query;
    const currentDate = new Date();

    const where = {
      status: { in: ['PENDING', 'PARTIALLY_PAID'] },
      dueDate: { lt: currentDate }
    };

    if (schoolId) {
      where.student = { schoolId: parseInt(schoolId) };
    }

    // Get overdue exam bills
    const examBills = await prisma.bill.findMany({
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
                name: true,
                code: true
              }
            }
          }
        },
        examFee: {
          include: {
            exam: {
              select: {
                name: true,
                code: true
              }
            }
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Get overdue certificate bills
    const certificateBills = await prisma.certificateBill.findMany({
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
                name: true,
                code: true
              }
            }
          }
        },
        certificate: {
          select: {
            certificateNo: true,
            type: true,
            title: true
          }
        }
      },
      orderBy: { dueDate: 'asc' }
    });

    // Combine and paginate
    const allOverdueBills = [
      ...examBills.map(bill => ({ ...bill, billType: 'exam' })),
      ...certificateBills.map(bill => ({ ...bill, billType: 'certificate' }))
    ].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedBills = allOverdueBills.slice(startIndex, endIndex);

    res.json({
      bills: paginatedBills,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: allOverdueBills.length,
        pages: Math.ceil(allOverdueBills.length / limit)
      }
    });
  } catch (error) {
    console.error('Get overdue bills error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const { billId, billType = 'exam' } = req.params;

    // Get bill with all related data
    let bill;
    if (billType === 'exam') {
      bill = await prisma.bill.findUnique({
        where: { id: parseInt(billId) },
        include: {
          student: {
            include: {
              school: true
            }
          },
          examFee: {
            include: {
              exam: true,
              feeStructure: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    } else {
      bill = await prisma.certificateBill.findUnique({
        where: { id: parseInt(billId) },
        include: {
          student: {
            include: {
              school: true
            }
          },
          certificate: true,
          certificateFee: {
            include: {
              feeStructure: true
            }
          },
          payments: {
            where: { status: 'COMPLETED' },
            orderBy: { createdAt: 'desc' }
          }
        }
      });
    }

    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }

    // Generate PDF invoice using the PDF service
    const invoiceData = {
      bill: {
        ...bill,
        billType
      },
      generatedAt: new Date(),
      generatedBy: req.user.name
    };

    // In a real application, you would use the PDF service
    // const pdfBuffer = await pdfService.generateInvoice(invoiceData);

    // For now, return invoice data
    res.json({
      message: 'Invoice generated successfully',
      invoice: invoiceData
    });
  } catch (error) {
    console.error('Generate invoice error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Helper functions
const generateBillNumber = async (type) => {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');

  // Get the count of bills of this type this month
  const startOfMonth = new Date(year, new Date().getMonth(), 1);
  const startOfNextMonth = new Date(year, new Date().getMonth() + 1, 1);

  let count;
  if (type === 'EXAM') {
    count = await prisma.bill.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lt: startOfNextMonth
        }
      }
    });
  } else {
    count = await prisma.certificateBill.count({
      where: {
        createdAt: {
          gte: startOfMonth,
          lt: startOfNextMonth
        }
      }
    });
  }

  const sequence = (count + 1).toString().padStart(4, '0');
  return `${type}${year}${month}${sequence}`;
};

const generatePaymentId = () => {
  const timestamp = Date.now().toString();
  const random = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `PAY${timestamp}${random}`;
};

module.exports = {
  getAllBills,
  getBillById,
  createExamBill,
  createCertificateBill,
  processPayment,
  getBillingStatistics,
  getOverdueBills,
  generateInvoice
};
