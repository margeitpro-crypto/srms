-- Initial seed data for SRMS

-- Users
INSERT INTO users (id, name, email, password_hash, role, school_id, created_at, updated_at) VALUES
(1, 'Super Admin', 'margeitpro@gmail.com', '$2a$10$hashedpassword', 'super_admin', NULL, '2025-01-01 09:00:00', '2025-01-01 09:00:00'),
(2, 'District Admin', 'manishconfid@gmail.com', '$2a$10$hashedpassword', 'district_admin', NULL, '2025-01-02 10:00:00', '2025-01-02 10:00:00'),
(3, 'School Admin', 'tsguideman@gmail.com', '$2a$10$hashedpassword', 'school_admin', 1, '2025-01-03 11:00:00', '2025-01-03 11:00:00'),
(4, 'Teacher', 'itmsinghyt@gmail.com', '$2a$10$hashedpassword', 'teacher', 1, '2025-01-04 09:00:00', '2025-01-04 09:00:00'),
(5, 'Teacher 2', 'teacher2@srms.edu.np', '$2a$10$hashedpassword', 'teacher', 1, '2025-01-04 09:10:00', '2025-01-04 09:10:00');

-- Schools
INSERT INTO schools (id, name, address, district_id, contact, logo) VALUES
(1, 'Sunrise English School', 'Boudha, Kathmandu', 27, '9800000001', 'sunrise_logo.png');

-- Classes
INSERT INTO classes (id, school_id, name, grade_level) VALUES
(1, 1, 'Grade 8', 8),
(2, 1, 'Grade 9', 9);

-- Sections
INSERT INTO sections (id, class_id, name) VALUES
(1, 1, 'A'),
(2, 1, 'B'),
(3, 2, 'A');

-- Students
INSERT INTO students (id, school_id, roll_no, first_name, last_name, dob, gender) VALUES
(1, 1, 801, 'Sita', 'Sharma', '2011-05-14', 'F'),
(2, 1, 802, 'Ram', 'Thapa', '2011-03-09', 'M'),
(3, 1, 803, 'Asha', 'Gurung', '2011-10-22', 'F'),
(4, 1, 901, 'Bikash', 'Lama', '2010-07-01', 'M'),
(5, 1, 902, 'Kriti', 'Shrestha', '2010-12-15', 'F');

-- Subjects
INSERT INTO subjects (id, school_id, name, code, max_marks, pass_marks) VALUES
(1, 1, 'English', 'ENG', 100, 40),
(2, 1, 'Mathematics', 'MATH', 100, 40),
(3, 1, 'Science', 'SCI', 100, 40),
(4, 1, 'Social Studies', 'SOC', 100, 40),
(5, 1, 'Nepali', 'NEP', 100, 40);

-- Exams
INSERT INTO exams (id, school_id, name, exam_type, start_date, end_date) VALUES
(1, 1, 'First Term Exam', 'term', '2025-03-01', '2025-03-10'),
(2, 1, 'Final Examination', 'annual', '2025-10-05', '2025-10-15');

-- Marks
INSERT INTO marks (id, student_id, subject_id, exam_id, marks_obtained, remarks, entered_by, entered_at) VALUES
(1, 1, 1, 1, 78, 'Good', 4, '2025-03-11 09:00:00'),
(2, 1, 2, 1, 85, 'Excellent', 4, '2025-03-11 09:05:00'),
(3, 1, 3, 1, 73, 'Good', 4, '2025-03-11 09:06:00'),
(4, 2, 1, 1, 60, 'Satisfactory', 4, '2025-03-11 09:10:00'),
(5, 2, 2, 1, 55, 'Average', 5, '2025-03-11 09:12:00'),
(6, 3, 1, 1, 92, 'Excellent', 4, '2025-03-11 09:20:00');

-- Grading Schemes
INSERT INTO grading_schemes (id, school_id, name, min_marks, max_marks, grade, grade_point) VALUES
(1, 1, 'Grade System', 90, 100, 'A+', 4.0),
(2, 1, 'Grade System', 80, 89, 'A', 3.6),
(3, 1, 'Grade System', 70, 79, 'B+', 3.2),
(4, 1, 'Grade System', 60, 69, 'B', 2.8),
(5, 1, 'Grade System', 50, 59, 'C+', 2.4),
(6, 1, 'Grade System', 40, 49, 'C', 2.0),
(7, 1, 'Grade System', 0, 39, 'F', 0.0);

-- Audit Logs
INSERT INTO audit_logs (id, user_id, action, target_table, target_id, timestamp, ip_address) VALUES
(1, 4, 'Insert', 'marks', 1, '2025-03-11 09:00:00', '192.168.1.101'),
(2, 3, 'Create', 'exam', 1, '2025-02-25 08:30:00', '192.168.1.100'),
(3, 5, 'Update', 'marks', 5, '2025-03-11 09:12:00', '192.168.1.102');
