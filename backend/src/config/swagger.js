const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Result Management System (SRMS) API',
      version: '1.0.0',
      description: 'A comprehensive API for managing school results, students, teachers, exams, and academic records',
      contact: {
        name: 'SRMS Support',
        email: 'support@srms.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Development server',
      },
      {
        url: 'https://api.srms.com/api',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // User schemas
        User: {
          type: 'object',
          required: ['email', 'password', 'firstName', 'lastName'],
          properties: {
            id: {
              type: 'string',
              description: 'User ID',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            firstName: {
              type: 'string',
              description: 'First name',
            },
            lastName: {
              type: 'string',
              description: 'Last name',
            },
            role: {
              type: 'string',
              enum: ['admin', 'teacher', 'student', 'parent'],
              description: 'User role',
            },
            schoolId: {
              type: 'string',
              description: 'Associated school ID',
            },
            isActive: {
              type: 'boolean',
              description: 'Account status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        School: {
          type: 'object',
          required: ['name', 'address', 'contactEmail', 'contactPhone'],
          properties: {
            id: {
              type: 'string',
              description: 'School ID',
            },
            name: {
              type: 'string',
              description: 'School name',
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' },
              },
            },
            contactEmail: {
              type: 'string',
              format: 'email',
              description: 'Contact email',
            },
            contactPhone: {
              type: 'string',
              description: 'Contact phone number',
            },
            website: {
              type: 'string',
              description: 'School website',
            },
            logo: {
              type: 'string',
              description: 'School logo URL',
            },
            isActive: {
              type: 'boolean',
              description: 'School status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Student: {
          type: 'object',
          required: ['firstName', 'lastName', 'studentId', 'schoolId', 'classId'],
          properties: {
            id: {
              type: 'string',
              description: 'Student ID',
            },
            firstName: {
              type: 'string',
              description: 'First name',
            },
            lastName: {
              type: 'string',
              description: 'Last name',
            },
            studentId: {
              type: 'string',
              description: 'Student ID number',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Student email',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth',
            },
            gender: {
              type: 'string',
              enum: ['male', 'female', 'other'],
              description: 'Gender',
            },
            address: {
              type: 'object',
              properties: {
                street: { type: 'string' },
                city: { type: 'string' },
                state: { type: 'string' },
                zipCode: { type: 'string' },
                country: { type: 'string' },
              },
            },
            schoolId: {
              type: 'string',
              description: 'School ID',
            },
            classId: {
              type: 'string',
              description: 'Class ID',
            },
            parentId: {
              type: 'string',
              description: 'Parent ID',
            },
            enrollmentDate: {
              type: 'string',
              format: 'date',
              description: 'Enrollment date',
            },
            status: {
              type: 'string',
              enum: ['active', 'inactive', 'graduated', 'transferred'],
              description: 'Student status',
            },
            photo: {
              type: 'string',
              description: 'Student photo URL',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Teacher: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'schoolId'],
          properties: {
            id: {
              type: 'string',
              description: 'Teacher ID',
            },
            firstName: {
              type: 'string',
              description: 'First name',
            },
            lastName: {
              type: 'string',
              description: 'Last name',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address',
            },
            phone: {
              type: 'string',
              description: 'Phone number',
            },
            employeeId: {
              type: 'string',
              description: 'Employee ID',
            },
            schoolId: {
              type: 'string',
              description: 'School ID',
            },
            subjects: {
              type: 'array',
              items: { type: 'string' },
              description: 'Subjects taught',
            },
            qualifications: {
              type: 'array',
              items: { type: 'string' },
              description: 'Qualifications',
            },
            experience: {
              type: 'number',
              description: 'Years of experience',
            },
            isActive: {
              type: 'boolean',
              description: 'Employment status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Exam: {
          type: 'object',
          required: ['name', 'subjectId', 'classId', 'date', 'totalMarks'],
          properties: {
            id: {
              type: 'string',
              description: 'Exam ID',
            },
            name: {
              type: 'string',
              description: 'Exam name',
            },
            description: {
              type: 'string',
              description: 'Exam description',
            },
            subjectId: {
              type: 'string',
              description: 'Subject ID',
            },
            classId: {
              type: 'string',
              description: 'Class ID',
            },
            date: {
              type: 'string',
              format: 'date',
              description: 'Exam date',
            },
            startTime: {
              type: 'string',
              description: 'Start time',
            },
            endTime: {
              type: 'string',
              description: 'End time',
            },
            totalMarks: {
              type: 'number',
              description: 'Total marks',
            },
            passingMarks: {
              type: 'number',
              description: 'Passing marks',
            },
            examType: {
              type: 'string',
              enum: ['midterm', 'final', 'quiz', 'assignment', 'practical'],
              description: 'Exam type',
            },
            schoolId: {
              type: 'string',
              description: 'School ID',
            },
            createdBy: {
              type: 'string',
              description: 'Teacher ID who created the exam',
            },
            isActive: {
              type: 'boolean',
              description: 'Exam status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Marks: {
          type: 'object',
          required: ['studentId', 'examId', 'marksObtained'],
          properties: {
            id: {
              type: 'string',
              description: 'Marks ID',
            },
            studentId: {
              type: 'string',
              description: 'Student ID',
            },
            examId: {
              type: 'string',
              description: 'Exam ID',
            },
            marksObtained: {
              type: 'number',
              description: 'Marks obtained',
            },
            totalMarks: {
              type: 'number',
              description: 'Total marks',
            },
            grade: {
              type: 'string',
              description: 'Grade',
            },
            percentage: {
              type: 'number',
              description: 'Percentage',
            },
            remarks: {
              type: 'string',
              description: 'Remarks',
            },
            isAbsent: {
              type: 'boolean',
              description: 'Whether student was absent',
            },
            evaluatedBy: {
              type: 'string',
              description: 'Teacher ID who evaluated',
            },
            evaluationDate: {
              type: 'string',
              format: 'date',
              description: 'Evaluation date',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Subject: {
          type: 'object',
          required: ['name', 'code', 'schoolId'],
          properties: {
            id: {
              type: 'string',
              description: 'Subject ID',
            },
            name: {
              type: 'string',
              description: 'Subject name',
            },
            code: {
              type: 'string',
              description: 'Subject code',
            },
            description: {
              type: 'string',
              description: 'Subject description',
            },
            schoolId: {
              type: 'string',
              description: 'School ID',
            },
            classIds: {
              type: 'array',
              items: { type: 'string' },
              description: 'Class IDs where subject is taught',
            },
            isActive: {
              type: 'boolean',
              description: 'Subject status',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            statusCode: {
              type: 'integer',
              description: 'HTTP status code',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page',
              default: 1,
            },
            limit: {
              type: 'integer',
              description: 'Items per page',
              default: 10,
            },
            total: {
              type: 'integer',
              description: 'Total items',
            },
            pages: {
              type: 'integer',
              description: 'Total pages',
            },
            hasNext: {
              type: 'boolean',
              description: 'Has next page',
            },
            hasPrev: {
              type: 'boolean',
              description: 'Has previous page',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Request success status',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            pagination: {
              $ref: '#/components/schemas/Pagination',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp',
            },
          },
        },
      },
    },
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/controllers/*.js',
  ],
};

// Generate swagger spec
const specs = swaggerJsdoc(options);

// Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'SRMS API Documentation',
  customfavIcon: '/assets/favicon.ico',
};

module.exports = {
  specs,
  swaggerUiOptions,
};