-- Seeder 005: Seed Exams and Assessment
-- Description: Seeds exams, exam subjects, grading schemes, and assessment data

-- Insert grading schemes
INSERT INTO grading_schemes (school_id, name, description, min_percentage, max_percentage, grade_point, grade_letter, is_active, created_at) VALUES
-- School 1 grading scheme (A+ to E)
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 90, 100, 4.0, 'A+', true, CURRENT_TIMESTAMP),
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 80, 89, 3.6, 'A', true, CURRENT_TIMESTAMP),
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 70, 79, 3.2, 'B+', true, CURRENT_TIMESTAMP),
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 60, 69, 2.8, 'B', true, CURRENT_TIMESTAMP),
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 50, 59, 2.4, 'C+', true, CURRENT_TIMESTAMP),
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 40, 49, 2.0, 'C', true, CURRENT_TIMESTAMP),
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 30, 39, 1.6, 'D+', true, CURRENT_TIMESTAMP),
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 20, 29, 1.2, 'D', true, CURRENT_TIMESTAMP),
(1, 'Secondary Education Grading', 'Standard grading scheme for secondary education', 0, 19, 0.0, 'E', true, CURRENT_TIMESTAMP),

-- School 2 grading scheme (A+ to E)
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 90, 100, 4.0, 'A+', true, CURRENT_TIMESTAMP),
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 80, 89, 3.6, 'A', true, CURRENT_TIMESTAMP),
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 70, 79, 3.2, 'B+', true, CURRENT_TIMESTAMP),
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 60, 69, 2.8, 'B', true, CURRENT_TIMESTAMP),
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 50, 59, 2.4, 'C+', true, CURRENT_TIMESTAMP),
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 40, 49, 2.0, 'C', true, CURRENT_TIMESTAMP),
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 30, 39, 1.6, 'D+', true, CURRENT_TIMESTAMP),
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 20, 29, 1.2, 'D', true, CURRENT_TIMESTAMP),
(2, 'Basic Education Grading', 'Standard grading scheme for basic education', 0, 19, 0.0, 'E', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert exams
INSERT INTO exams (school_id, academic_year_id, name, exam_type, description, start_date, end_date, result_publish_date, is_published, is_active, created_at) VALUES
-- School 1 exams for academic year 1
(1, 1, 'First Terminal Examination 2024', 'TERMINAL', 'First terminal examination for Grade 5', '2024-03-01', '2024-03-15', '2024-03-25', true, true, CURRENT_TIMESTAMP),
(1, 1, 'Second Terminal Examination 2024', 'TERMINAL', 'Second terminal examination for Grade 5', '2024-06-01', '2024-06-15', '2024-06-25', true, true, CURRENT_TIMESTAMP),
(1, 1, 'Final Examination 2024', 'FINAL', 'Final annual examination for Grade 5', '2024-09-01', '2024-09-15', '2024-09-25', true, true, CURRENT_TIMESTAMP),
(1, 1, 'Monthly Test 1', 'MONTHLY', 'Monthly test for Grade 5', '2024-02-01', '2024-02-02', '2024-02-05', true, true, CURRENT_TIMESTAMP),
(1, 1, 'Monthly Test 2', 'MONTHLY', 'Monthly test for Grade 5', '2024-04-01', '2024-04-02', '2024-04-05', true, true, CURRENT_TIMESTAMP),

-- School 2 exams for academic year 4
(2, 4, 'First Terminal Examination 2024', 'TERMINAL', 'First terminal examination for Class 5', '2024-03-01', '2024-03-15', '2024-03-25', true, true, CURRENT_TIMESTAMP),
(2, 4, 'Second Terminal Examination 2024', 'TERMINAL', 'Second terminal examination for Class 5', '2024-06-01', '2024-06-15', '2024-06-25', true, true, CURRENT_TIMESTAMP),
(2, 4, 'Final Examination 2024', 'FINAL', 'Final annual examination for Class 5', '2024-09-01', '2024-09-15', '2024-09-25', true, true, CURRENT_TIMESTAMP),
(2, 4, 'Unit Test 1', 'UNIT', 'Unit test for Class 5', '2024-02-15', '2024-02-16', '2024-02-20', true, true, CURRENT_TIMESTAMP),
(2, 4, 'Unit Test 2', 'UNIT', 'Unit test for Class 5', '2024-05-15', '2024-05-16', '2024-05-20', true, true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert exam subjects
INSERT INTO exam_subjects (exam_id, subject_id, exam_date, start_time, end_time, full_marks, pass_marks, exam_type, room_number, supervisor_id, created_at) VALUES
-- School 1 First Terminal Examination subjects
(1, 1, '2024-03-01', '09:00', '11:00', 100, 40, 'THEORY', 'Room 101', 4, CURRENT_TIMESTAMP), -- Nepali
(1, 2, '2024-03-02', '09:00', '11:00', 100, 40, 'THEORY', 'Room 102', 4, CURRENT_TIMESTAMP), -- English
(1, 3, '2024-03-03', '09:00', '11:00', 100, 40, 'THEORY', 'Room 103', 4, CURRENT_TIMESTAMP), -- Mathematics
(1, 4, '2024-03-04', '09:00', '11:00', 100, 40, 'THEORY', 'Room 104', 4, CURRENT_TIMESTAMP), -- Science
(1, 5, '2024-03-05', '09:00', '11:00', 100, 40, 'THEORY', 'Room 105', 4, CURRENT_TIMESTAMP), -- Social Studies
(1, 6, '2024-03-06', '09:00', '10:00', 100, 40, 'PRACTICAL', 'Gymnasium', 4, CURRENT_TIMESTAMP), -- HPE

-- School 1 Second Terminal Examination subjects
(2, 1, '2024-06-01', '09:00', '11:00', 100, 40, 'THEORY', 'Room 101', 4, CURRENT_TIMESTAMP), -- Nepali
(2, 2, '2024-06-02', '09:00', '11:00', 100, 40, 'THEORY', 'Room 102', 4, CURRENT_TIMESTAMP), -- English
(2, 3, '2024-06-03', '09:00', '11:00', 100, 40, 'THEORY', 'Room 103', 4, CURRENT_TIMESTAMP), -- Mathematics
(2, 4, '2024-06-04', '09:00', '11:00', 100, 40, 'THEORY', 'Room 104', 4, CURRENT_TIMESTAMP), -- Science
(2, 5, '2024-06-05', '09:00', '11:00', 100, 40, 'THEORY', 'Room 105', 4, CURRENT_TIMESTAMP), -- Social Studies
(2, 6, '2024-06-06', '09:00', '10:00', 100, 40, 'PRACTICAL', 'Gymnasium', 4, CURRENT_TIMESTAMP), -- HPE

-- School 2 First Terminal Examination subjects
(6, 11, '2024-03-01', '09:00', '11:00', 100, 40, 'THEORY', 'Room 201', 7, CURRENT_TIMESTAMP), -- Nepali
(6, 12, '2024-03-02', '09:00', '11:00', 100, 40, 'THEORY', 'Room 202', 7, CURRENT_TIMESTAMP), -- English
(6, 13, '2024-03-03', '09:00', '11:00', 100, 40, 'THEORY', 'Room 203', 7, CURRENT_TIMESTAMP), -- Mathematics
(6, 14, '2024-03-04', '09:00', '11:00', 100, 40, 'THEORY', 'Room 204', 7, CURRENT_TIMESTAMP), -- Science
(6, 15, '2024-03-05', '09:00', '11:00', 100, 40, 'THEORY', 'Room 205', 7, CURRENT_TIMESTAMP), -- Social Studies
(6, 16, '2024-03-06', '09:00', '10:00', 100, 40, 'PRACTICAL', 'Playground', 7, CURRENT_TIMESTAMP) -- HPE
ON CONFLICT DO NOTHING;

-- Insert exam results
INSERT INTO exam_results (student_id, exam_id, total_marks, obtained_marks, percentage, grade, grade_point, result_status, position, remarks, created_at) VALUES
-- Student 1 results (School 1)
(1, 1, 600, 480, 80.0, 'A', 3.6, 'PASS', 3, 'Good performance', CURRENT_TIMESTAMP), -- First Terminal
(1, 2, 600, 510, 85.0, 'A', 3.6, 'PASS', 2, 'Very good performance', CURRENT_TIMESTAMP), -- Second Terminal
(1, 3, 600, 540, 90.0, 'A+', 4.0, 'PASS', 1, 'Excellent performance', CURRENT_TIMESTAMP), -- Final

-- Student 2 results (School 1)
(2, 1, 600, 420, 70.0, 'B+', 3.2, 'PASS', 5, 'Average performance', CURRENT_TIMESTAMP), -- First Terminal
(2, 2, 600, 450, 75.0, 'B+', 3.2, 'PASS', 4, 'Good improvement', CURRENT_TIMESTAMP), -- Second Terminal
(2, 3, 600, 480, 80.0, 'A', 3.6, 'PASS', 3, 'Good performance', CURRENT_TIMESTAMP), -- Final

-- Student 3 results (School 2)
(3, 6, 600, 360, 60.0, 'B', 2.8, 'PASS', 8, 'Needs improvement', CURRENT_TIMESTAMP), -- First Terminal
(3, 7, 600, 390, 65.0, 'B', 2.8, 'PASS', 7, 'Satisfactory performance', CURRENT_TIMESTAMP), -- Second Terminal
(3, 8, 600, 420, 70.0, 'B+', 3.2, 'PASS', 6, 'Average performance', CURRENT_TIMESTAMP) -- Final
ON CONFLICT DO NOTHING;

-- Insert exam subject results
INSERT INTO exam_subject_results (exam_result_id, subject_id, obtained_marks, grade, grade_point, remarks, created_at) VALUES
-- Student 1 First Terminal subject results
(1, 1, 85, 'A', 3.6, 'Good in Nepali', CURRENT_TIMESTAMP), -- Nepali
(1, 2, 82, 'A', 3.6, 'Good in English', CURRENT_TIMESTAMP), -- English
(1, 3, 78, 'B+', 3.2, 'Good in Mathematics', CURRENT_TIMESTAMP), -- Mathematics
(1, 4, 80, 'A', 3.6, 'Good in Science', CURRENT_TIMESTAMP), -- Science
(1, 5, 75, 'B+', 3.2, 'Good in Social Studies', CURRENT_TIMESTAMP), -- Social Studies
(1, 6, 80, 'A', 3.6, 'Good in HPE', CURRENT_TIMESTAMP), -- HPE

-- Student 1 Second Terminal subject results
(2, 1, 88, 'A', 3.6, 'Very good in Nepali', CURRENT_TIMESTAMP), -- Nepali
(2, 2, 85, 'A', 3.6, 'Very good in English', CURRENT_TIMESTAMP), -- English
(2, 3, 82, 'A', 3.6, 'Very good in Mathematics', CURRENT_TIMESTAMP), -- Mathematics
(2, 4, 85, 'A', 3.6, 'Very good in Science', CURRENT_TIMESTAMP), -- Science
(2, 5, 80, 'A', 3.6, 'Very good in Social Studies', CURRENT_TIMESTAMP), -- Social Studies
(2, 6, 85, 'A', 3.6, 'Very good in HPE', CURRENT_TIMESTAMP), -- HPE

-- Student 2 First Terminal subject results
(4, 1, 70, 'B+', 3.2, 'Average in Nepali', CURRENT_TIMESTAMP), -- Nepali
(4, 2, 68, 'B+', 3.2, 'Average in English', CURRENT_TIMESTAMP), -- English
(4, 3, 65, 'B', 2.8, 'Average in Mathematics', CURRENT_TIMESTAMP), -- Mathematics
(4, 4, 72, 'B+', 3.2, 'Average in Science', CURRENT_TIMESTAMP), -- Science
(4, 5, 70, 'B+', 3.2, 'Average in Social Studies', CURRENT_TIMESTAMP), -- Social Studies
(4, 6, 75, 'B+', 3.2, 'Average in HPE', CURRENT_TIMESTAMP), -- HPE

-- Student 3 First Terminal subject results (School 2)
(7, 11, 55, 'C+', 2.4, 'Needs improvement in Nepali', CURRENT_TIMESTAMP), -- Nepali
(7, 12, 58, 'C+', 2.4, 'Needs improvement in English', CURRENT_TIMESTAMP), -- English
(7, 13, 52, 'C', 2.0, 'Needs improvement in Mathematics', CURRENT_TIMESTAMP), -- Mathematics
(7, 14, 60, 'B', 2.8, 'Satisfactory in Science', CURRENT_TIMESTAMP), -- Science
(7, 15, 55, 'C+', 2.4, 'Needs improvement in Social Studies', CURRENT_TIMESTAMP), -- Social Studies
(7, 16, 70, 'B+', 3.2, 'Good in HPE', CURRENT_TIMESTAMP) -- HPE
ON CONFLICT DO NOTHING;

-- Insert exam attendance
INSERT INTO exam_attendance (exam_subject_id, student_id, attendance_status, attendance_date, remarks, created_at) VALUES
-- School 1 First Terminal attendance
(1, 1, 'PRESENT', '2024-03-01', 'Present for Nepali exam', CURRENT_TIMESTAMP),
(2, 1, 'PRESENT', '2024-03-02', 'Present for English exam', CURRENT_TIMESTAMP),
(3, 1, 'PRESENT', '2024-03-03', 'Present for Mathematics exam', CURRENT_TIMESTAMP),
(4, 1, 'PRESENT', '2024-03-04', 'Present for Science exam', CURRENT_TIMESTAMP),
(5, 1, 'PRESENT', '2024-03-05', 'Present for Social Studies exam', CURRENT_TIMESTAMP),
(6, 1, 'PRESENT', '2024-03-06', 'Present for HPE exam', CURRENT_TIMESTAMP),

(1, 2, 'PRESENT', '2024-03-01', 'Present for Nepali exam', CURRENT_TIMESTAMP),
(2, 2, 'PRESENT', '2024-03-02', 'Present for English exam', CURRENT_TIMESTAMP),
(3, 2, 'PRESENT', '2024-03-03', 'Present for Mathematics exam', CURRENT_TIMESTAMP),
(4, 2, 'PRESENT', '2024-03-04', 'Present for Science exam', CURRENT_TIMESTAMP),
(5, 2, 'PRESENT', '2024-03-05', 'Present for Social Studies exam', CURRENT_TIMESTAMP),
(6, 2, 'PRESENT', '2024-03-06', 'Present for HPE exam', CURRENT_TIMESTAMP),

-- School 2 First Terminal attendance
(7, 3, 'PRESENT', '2024-03-01', 'Present for Nepali exam', CURRENT_TIMESTAMP),
(8, 3, 'PRESENT', '2024-03-02', 'Present for English exam', CURRENT_TIMESTAMP),
(9, 3, 'PRESENT', '2024-03-03', 'Present for Mathematics exam', CURRENT_TIMESTAMP),
(10, 3, 'PRESENT', '2024-03-04', 'Present for Science exam', CURRENT_TIMESTAMP),
(11, 3, 'PRESENT', '2024-03-05', 'Present for Social Studies exam', CURRENT_TIMESTAMP),
(12, 3, 'PRESENT', '2024-03-06', 'Present for HPE exam', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;