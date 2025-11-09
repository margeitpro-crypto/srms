-- SRMS Initial Data Setup
-- This script inserts initial data into the database

-- Switch to the srms database
USE srms;

-- Insert default system settings
INSERT INTO system_settings (key, value, description, isActive) VALUES
('app_name', 'School Result Management System', 'Application name', true),
('app_version', '1.0.0', 'Application version', true),
('maintenance_mode', 'false', 'System maintenance mode', true),
('max_login_attempts', '5', 'Maximum failed login attempts before lockout', true),
('session_timeout_minutes', '60', 'User session timeout in minutes', true),
('password_expiry_days', '90', 'Password expiry duration in days', true),
('default_language', 'en', 'Default application language', true),
('timezone', 'UTC', 'System timezone', true),
('date_format', 'YYYY-MM-DD', 'Default date format', true),
('time_format', 'HH24:MI', 'Default time format', true),
('currency_symbol', 'Rs.', 'Default currency symbol', true),
('currency_code', 'NPR', 'Default currency code', true);

-- Insert default users
INSERT INTO users (email, password, role, name, phone, address, isActive) VALUES
('admin@srms.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', 'SUPER_ADMIN', 'System Administrator', '+977-9800000000', 'Kathmandu, Nepal', true),
('district@srms.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', 'DISTRICT_ADMIN', 'District Administrator', '+977-9800000001', 'Kathmandu, Nepal', true),
('school@srms.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', 'SCHOOL_ADMIN', 'School Administrator', '+977-9800000002', 'Kathmandu, Nepal', true),
('teacher@srms.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', 'TEACHER', 'Teacher User', '+977-9800000003', 'Kathmandu, Nepal', true),
('student@srms.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', 'STUDENT', 'Student User', '+977-9800000004', 'Kathmandu, Nepal', true),
('parent@srms.edu', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.PZvO.S', 'PARENT', 'Parent User', '+977-9800000005', 'Kathmandu, Nepal', true);

-- Insert default schools
INSERT INTO schools (name, code, address, phone, email, principal, established, isActive, createdById) VALUES
('Kathmandu Model Secondary School', 'KMSS001', 'Kathmandu, Nepal', '+977-01-4444444', 'info@kmss.edu.np', 'Dr. Ram Prasad Adhikari', '2000-01-01', true, 1),
('Pokhara International School', 'PIS001', 'Pokhara, Nepal', '+977-061-555555', 'info@pis.edu.np', 'Ms. Sita Kumari Thapa', '1995-06-15', true, 1),
('Biratnagar Public School', 'BPS001', 'Biratnagar, Nepal', '+977-021-666666', 'info@bps.edu.np', 'Mr. Hari Bahadur Shah', '1990-09-10', true, 1);

-- Insert default subjects
INSERT INTO subjects (name, code, description, credits, isActive) VALUES
('Mathematics', 'MATH', 'Mathematics subject', 1, true),
('Science', 'SCI', 'Science subject', 1, true),
('English', 'ENG', 'English subject', 1, true),
('Nepali', 'NEP', 'Nepali subject', 1, true),
('Social Studies', 'SST', 'Social Studies subject', 1, true),
('Computer Science', 'CS', 'Computer Science subject', 1, true),
('Accountancy', 'ACC', 'Accountancy subject', 1, true),
('Economics', 'ECO', 'Economics subject', 1, true);

-- Insert default students
INSERT INTO students (name, rollNo, class, section, dateOfBirth, gender, address, phone, email, parentName, parentPhone, parentEmail, schoolId, createdById, isActive) VALUES
('Ram Bahadur Thapa', '101', 'Class 10', 'A', '2008-05-15', 'MALE', 'Kathmandu, Nepal', '+977-9800000101', 'ram.thapa@student.edu', 'Krishna Thapa', '+977-9800000001', 'krishna.thapa@parent.edu', 1, 4, true),
('Sita Kumari Rai', '102', 'Class 10', 'A', '2008-03-22', 'FEMALE', 'Lalitpur, Nepal', '+977-9800000102', 'sita.rai@student.edu', 'Gopal Rai', '+977-9800000002', 'gopal.rai@parent.edu', 1, 4, true),
('Hari Prasad Shah', '103', 'Class 10', 'B', '2008-07-10', 'MALE', 'Bhaktapur, Nepal', '+977-9800000103', 'hari.shah@student.edu', 'Laxmi Shah', '+977-9800000003', 'laxmi.shah@parent.edu', 1, 4, true),
('Gita Kumari Thapa', '104', 'Class 10', 'B', '2008-11-30', 'FEMALE', 'Kathmandu, Nepal', '+977-9800000104', 'gita.thapa@student.edu', 'Krishna Thapa', '+977-9800000001', 'krishna.thapa@parent.edu', 1, 4, true);

-- Insert default exams
INSERT INTO exams (name, code, description, examType, startDate, endDate, isActive, isPublished, schoolId, createdById) VALUES
('First Terminal Examination 2025', 'FTE2025', 'First Terminal Examination for 2025', 'FINAL', '2025-03-01', '2025-03-15', true, true, 1, 3),
('Second Terminal Examination 2025', 'STE2025', 'Second Terminal Examination for 2025', 'FINAL', '2025-07-01', '2025-07-15', true, true, 1, 3),
('Final Examination 2025', 'FE2025', 'Final Examination for 2025', 'FINAL', '2025-11-01', '2025-11-20', true, true, 1, 3);

-- Insert exam subjects
INSERT INTO exam_subjects (examId, subjectId, maxMarks, minMarks, examDate, duration) VALUES
(1, 1, 100, 40, '2025-03-02', 180),
(1, 2, 100, 40, '2025-03-03', 180),
(1, 3, 100, 40, '2025-03-04', 180),
(1, 4, 100, 40, '2025-03-05', 180),
(1, 5, 100, 40, '2025-03-06', 180);

-- Insert exam results
INSERT INTO exam_results (examId, studentId, status, totalMarks, obtainedMarks, percentage, grade, gradePoints, isPublished) VALUES
(1, 1, 'PUBLISHED', 500, 420, 84.0, 'A', 3.6, true),
(1, 2, 'PUBLISHED', 500, 450, 90.0, 'A+', 4.0, true),
(1, 3, 'PUBLISHED', 500, 380, 76.0, 'B+', 3.2, true),
(1, 4, 'PUBLISHED', 500, 410, 82.0, 'A-', 3.4, true);

-- Insert subject results
INSERT INTO exam_subject_results (examResultId, subjectId, marks, maxMarks, grade, gradePoints) VALUES
(1, 1, 85, 100, 'A', 3.6),
(1, 2, 80, 100, 'A-', 3.4),
(1, 3, 90, 100, 'A+', 4.0),
(1, 4, 82, 100, 'A-', 3.4),
(1, 5, 83, 100, 'A', 3.6);

-- Insert fee structures
INSERT INTO fee_structures (name, type, amount, currency, description, isActive, validFrom, schoolId, createdById) VALUES
('Class 10 Exam Fee', 'EXAM_FEE', 1000, 'NPR', 'Exam fee for Class 10 students', true, '2025-01-01', 1, 3),
('Class 10 Certificate Fee', 'CERTIFICATE_FEE', 500, 'NPR', 'Certificate fee for Class 10 students', true, '2025-01-01', 1, 3);

-- Insert student fees
INSERT INTO exam_fees (amount, currency, status, examId, studentId, feeStructureId) VALUES
(1000, 'NPR', 'COMPLETED', 1, 1, 1),
(1000, 'NPR', 'COMPLETED', 1, 2, 1),
(1000, 'NPR', 'COMPLETED', 1, 3, 1),
(1000, 'NPR', 'COMPLETED', 1, 4, 1);

-- Insert bills
INSERT INTO bills (billNo, totalAmount, paidAmount, balance, currency, dueDate, status, description, studentId) VALUES
('BILL-2025-001', 1000, 1000, 0, 'NPR', '2025-02-28', 'COMPLETED', 'First Terminal Exam Fee', 1),
('BILL-2025-002', 1000, 1000, 0, 'NPR', '2025-02-28', 'COMPLETED', 'First Terminal Exam Fee', 2),
('BILL-2025-003', 1000, 1000, 0, 'NPR', '2025-02-28', 'COMPLETED', 'First Terminal Exam Fee', 3),
('BILL-2025-004', 1000, 1000, 0, 'NPR', '2025-02-28', 'COMPLETED', 'First Terminal Exam Fee', 4);

-- Insert payments
INSERT INTO payments (paymentId, amount, currency, method, status, paidAt, billId, processedById) VALUES
('PAY-2025-001', 1000, 'NPR', 'CASH', 'COMPLETED', '2025-02-15', 1, 3),
('PAY-2025-002', 1000, 'NPR', 'BANK_TRANSFER', 'COMPLETED', '2025-02-16', 2, 3),
('PAY-2025-003', 1000, 'NPR', 'ONLINE_PAYMENT', 'COMPLETED', '2025-02-17', 3, 3),
('PAY-2025-004', 1000, 'NPR', 'CASH', 'COMPLETED', '2025-02-18', 4, 3);

-- Insert certificate templates
INSERT INTO certificate_templates (name, type, template, isActive, isDefault, createdById) VALUES
('Mark Sheet Template', 'MARKSHEET', '{"header": "MARKSHEET", "fields": ["studentName", "rollNo", "class", "examName", "marks", "grade"]}', true, true, 3),
('Character Certificate Template', 'CHARACTER_CERTIFICATE', '{"header": "CHARACTER CERTIFICATE", "fields": ["studentName", "fatherName", "class", "conduct"]}', true, true, 3);

-- Insert certificates
INSERT INTO certificates (certificateNo, type, title, description, issueDate, status, verificationCode, studentId, examResultId, templateId, issuedById) VALUES
('CERT-2025-001', 'MARKSHEET', 'First Terminal Exam Mark Sheet', 'Mark sheet for First Terminal Examination 2025', '2025-03-20', 'ISSUED', 'VC-2025-001', 1, 1, 1, 3),
('CERT-2025-002', 'MARKSHEET', 'First Terminal Exam Mark Sheet', 'Mark sheet for First Terminal Examination 2025', '2025-03-20', 'ISSUED', 'VC-2025-002', 2, 2, 1, 3);

-- Display confirmation
SELECT 'Initial data inserted successfully!' AS Status;
SELECT COUNT(*) AS 'Total Users' FROM users;
SELECT COUNT(*) AS 'Total Schools' FROM schools;
SELECT COUNT(*) AS 'Total Students' FROM students;
SELECT COUNT(*) AS 'Total Exams' FROM exams;