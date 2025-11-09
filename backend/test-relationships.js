const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testRelationships() {
  try {
    console.log('Testing database relationships...');
    
    // Test 1: Check if schools exist
    const schools = await prisma.schools.findMany({ take: 2 });
    console.log('Schools found:', schools.length);
    
    // Test 2: Check students with schools
    const studentsWithSchools = await prisma.students.findMany({
      take: 3,
      include: { schools: true }
    });
    console.log('Students with schools:', studentsWithSchools.length);
    
    // Test 3: Check exam results with students and exams
    const examResults = await prisma.exam_results.findMany({
      take: 2,
      include: {
        students: true,
        exams: true
      }
    });
    console.log('Exam results with relations:', examResults.length);
    
    // Test 4: Check certificates with students and templates
    const certificates = await prisma.certificates.findMany({
      take: 2,
      include: {
        students: true,
        certificate_templates: true,
        users: true
      }
    });
    console.log('Certificates with relations:', certificates.length);
    
    // Test 5: Check users and their relationships
    const users = await prisma.users.findMany({
      take: 2,
      include: {
        students: true,
        schools: true,
        certificates: true
      }
    });
    console.log('Users with relationships:', users.length);
    
    // Test 6: Check foreign key constraints
    console.log('\n--- Testing Foreign Key Constraints ---');
    
    // Test invalid school ID for students
    try {
      await prisma.students.create({
        data: {
          name: 'Test Student',
          rollNo: 'TEST001',
          class: '10',
          section: 'A',
          schoolId: 99999 // Invalid school ID
        }
      });
      console.log('ERROR: Should have failed with invalid school ID');
    } catch (error) {
      console.log('✓ Foreign key constraint working for students.schoolId');
    }
    
    // Test invalid user ID for certificates
    try {
      await prisma.certificates.create({
        data: {
          certificateNo: 'TEST001',
          type: 'MARKSHEET',
          title: 'Test Certificate',
          verificationCode: 'TEST123',
          studentId: 1,
          issuedById: 99999 // Invalid user ID
        }
      });
      console.log('ERROR: Should have failed with invalid issuedById');
    } catch (error) {
      console.log('✓ Foreign key constraint working for certificates.issuedById');
    }
    
    console.log('\nAll relationship tests completed successfully!');
  } catch (error) {
    console.error('Relationship test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRelationships();