-- Seeder 004: Seed Subjects and Curriculum
-- Description: Seeds subjects, subject categories, class subjects, and curriculum materials

-- Insert subject categories
INSERT INTO subject_categories (school_id, name, description, is_active, created_at) VALUES
(1, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(1, 'Language Subjects', 'Subjects related to languages and literature', true, CURRENT_TIMESTAMP),
(1, 'Science Subjects', 'Subjects related to science and technology', true, CURRENT_TIMESTAMP),
(1, 'Mathematics', 'Mathematical subjects and applications', true, CURRENT_TIMESTAMP),
(1, 'Social Studies', 'Subjects related to society and social sciences', true, CURRENT_TIMESTAMP),
(2, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(2, 'Language Subjects', 'Subjects related to languages and literature', true, CURRENT_TIMESTAMP),
(2, 'Science Subjects', 'Subjects related to science and technology', true, CURRENT_TIMESTAMP),
(2, 'Mathematics', 'Mathematical subjects and applications', true, CURRENT_TIMESTAMP),
(3, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(3, 'Language Subjects', 'Subjects related to languages and literature', true, CURRENT_TIMESTAMP),
(3, 'Science Subjects', 'Subjects related to science and technology', true, CURRENT_TIMESTAMP),
(4, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(4, 'Language Subjects', 'Subjects related to languages and literature', true, CURRENT_TIMESTAMP),
(5, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(6, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(7, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(8, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(9, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP),
(10, 'Core Subjects', 'Primary subjects that are compulsory for all students', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert subjects
INSERT INTO subjects (school_id, name, code, description, subject_type, credit_hours, pass_marks, full_marks, is_compulsory, is_active, created_at) VALUES
-- School 1 subjects
(1, 'Nepali', 'NEP', 'Nepali language and literature', 'THEORY', 3, 40, 100, true, true, CURRENT_TIMESTAMP),
(1, 'English', 'ENG', 'English language and literature', 'THEORY', 3, 40, 100, true, true, CURRENT_TIMESTAMP),
(1, 'Mathematics', 'MATH', 'Mathematics and mathematical applications', 'THEORY', 4, 40, 100, true, true, CURRENT_TIMESTAMP),
(1, 'Science', 'SCI', 'General science including physics, chemistry, biology', 'THEORY', 4, 40, 100, true, true, CURRENT_TIMESTAMP),
(1, 'Social Studies', 'SOC', 'Social studies including history, geography, civics', 'THEORY', 3, 40, 100, true, true, CURRENT_TIMESTAMP),
(1, 'Health and Physical Education', 'HPE', 'Health education and physical training', 'PRACTICAL', 2, 40, 100, true, true, CURRENT_TIMESTAMP),
(1, 'Computer Science', 'COMP', 'Basic computer education and applications', 'THEORY', 2, 40, 100, false, true, CURRENT_TIMESTAMP),
(1, 'Moral Education', 'MORAL', 'Moral education and character building', 'THEORY', 1, 40, 100, true, true, CURRENT_TIMESTAMP),
(1, 'Optional Mathematics', 'OPT_MATH', 'Advanced mathematics for interested students', 'THEORY', 3, 40, 100, false, true, CURRENT_TIMESTAMP),
(1, 'Environmental Science', 'ENV', 'Environmental education and awareness', 'THEORY', 2, 40, 100, false, true, CURRENT_TIMESTAMP),

-- School 2 subjects
(2, 'Nepali', 'NEP', 'Nepali language and literature', 'THEORY', 3, 40, 100, true, true, CURRENT_TIMESTAMP),
(2, 'English', 'ENG', 'English language and literature', 'THEORY', 3, 40, 100, true, true, CURRENT_TIMESTAMP),
(2, 'Mathematics', 'MATH', 'Mathematics and mathematical applications', 'THEORY', 4, 40, 100, true, true, CURRENT_TIMESTAMP),
(2, 'Science', 'SCI', 'General science including physics, chemistry, biology', 'THEORY', 4, 40, 100, true, true, CURRENT_TIMESTAMP),
(2, 'Social Studies', 'SOC', 'Social studies including history, geography, civics', 'THEORY', 3, 40, 100, true, true, CURRENT_TIMESTAMP),
(2, 'Health and Physical Education', 'HPE', 'Health education and physical training', 'PRACTICAL', 2, 40, 100, true, true, CURRENT_TIMESTAMP),
(2, 'Computer Science', 'COMP', 'Basic computer education and applications', 'THEORY', 2, 40, 100, false, true, CURRENT_TIMESTAMP),
(2, 'Moral Education', 'MORAL', 'Moral education and character building', 'THEORY', 1, 40, 100, true, true, CURRENT_TIMESTAMP),
(2, 'Optional Mathematics', 'OPT_MATH', 'Advanced mathematics for interested students', 'THEORY', 3, 40, 100, false, true, CURRENT_TIMESTAMP),
(2, 'Environmental Science', 'ENV', 'Environmental education and awareness', 'THEORY', 2, 40, 100, false, true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert subject category assignments
INSERT INTO subject_category_assignments (subject_id, category_id, is_primary, created_at) VALUES
-- School 1 assignments
(1, 2, true, CURRENT_TIMESTAMP), -- Nepali -> Language Subjects
(2, 2, true, CURRENT_TIMESTAMP), -- English -> Language Subjects
(3, 4, true, CURRENT_TIMESTAMP), -- Mathematics -> Mathematics
(4, 3, true, CURRENT_TIMESTAMP), -- Science -> Science Subjects
(5, 5, true, CURRENT_TIMESTAMP), -- Social Studies -> Social Studies
(6, 1, false, CURRENT_TIMESTAMP), -- HPE -> Core Subjects
(7, 3, false, CURRENT_TIMESTAMP), -- Computer Science -> Science Subjects
(8, 1, false, CURRENT_TIMESTAMP), -- Moral Education -> Core Subjects
(9, 4, false, CURRENT_TIMESTAMP), -- Optional Mathematics -> Mathematics
(10, 3, false, CURRENT_TIMESTAMP), -- Environmental Science -> Science Subjects

-- School 2 assignments
(11, 7, true, CURRENT_TIMESTAMP), -- Nepali -> Language Subjects
(12, 7, true, CURRENT_TIMESTAMP), -- English -> Language Subjects
(13, 9, true, CURRENT_TIMESTAMP), -- Mathematics -> Mathematics
(14, 8, true, CURRENT_TIMESTAMP), -- Science -> Science Subjects
(15, 10, true, CURRENT_TIMESTAMP), -- Social Studies -> Social Studies
(16, 6, false, CURRENT_TIMESTAMP), -- HPE -> Core Subjects
(17, 8, false, CURRENT_TIMESTAMP), -- Computer Science -> Science Subjects
(18, 6, false, CURRENT_TIMESTAMP), -- Moral Education -> Core Subjects
(19, 9, false, CURRENT_TIMESTAMP), -- Optional Mathematics -> Mathematics
(20, 8, false, CURRENT_TIMESTAMP) -- Environmental Science -> Science Subjects
ON CONFLICT DO NOTHING;

-- Insert class subjects
INSERT INTO class_subjects (school_id, class_id, subject_id, is_compulsory, is_active, created_at) VALUES
-- School 1 Grade 5 subjects
(1, 5, 1, true, true, CURRENT_TIMESTAMP), -- Nepali
(1, 5, 2, true, true, CURRENT_TIMESTAMP), -- English
(1, 5, 3, true, true, CURRENT_TIMESTAMP), -- Mathematics
(1, 5, 4, true, true, CURRENT_TIMESTAMP), -- Science
(1, 5, 5, true, true, CURRENT_TIMESTAMP), -- Social Studies
(1, 5, 6, true, true, CURRENT_TIMESTAMP), -- HPE
(1, 5, 8, true, true, CURRENT_TIMESTAMP), -- Moral Education

-- School 2 Class 5 subjects
(2, 16, 11, true, true, CURRENT_TIMESTAMP), -- Nepali
(2, 16, 12, true, true, CURRENT_TIMESTAMP), -- English
(2, 16, 13, true, true, CURRENT_TIMESTAMP), -- Mathematics
(2, 16, 14, true, true, CURRENT_TIMESTAMP), -- Science
(2, 16, 15, true, true, CURRENT_TIMESTAMP), -- Social Studies
(2, 16, 16, true, true, CURRENT_TIMESTAMP), -- HPE
(2, 16, 18, true, true, CURRENT_TIMESTAMP) -- Moral Education
ON CONFLICT DO NOTHING;

-- Insert subject resources
INSERT INTO subject_resources (school_id, subject_id, resource_type, title, description, file_path, is_active, created_at) VALUES
-- School 1 resources
(1, 1, 'TEXTBOOK', 'Nepali Textbook Grade 5', 'Official Nepali textbook for Grade 5 students', 'resources/textbooks/nepali_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 2, 'TEXTBOOK', 'English Textbook Grade 5', 'Official English textbook for Grade 5 students', 'resources/textbooks/english_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 3, 'TEXTBOOK', 'Mathematics Textbook Grade 5', 'Official Mathematics textbook for Grade 5 students', 'resources/textbooks/math_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 4, 'TEXTBOOK', 'Science Textbook Grade 5', 'Official Science textbook for Grade 5 students', 'resources/textbooks/science_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 5, 'TEXTBOOK', 'Social Studies Textbook Grade 5', 'Official Social Studies textbook for Grade 5 students', 'resources/textbooks/social_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 1, 'WORKBOOK', 'Nepali Workbook Grade 5', 'Practice workbook for Nepali language', 'resources/workbooks/nepali_wb_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 2, 'WORKBOOK', 'English Workbook Grade 5', 'Practice workbook for English language', 'resources/workbooks/english_wb_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 3, 'WORKBOOK', 'Mathematics Workbook Grade 5', 'Practice workbook for Mathematics', 'resources/workbooks/math_wb_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 4, 'LAB_MANUAL', 'Science Lab Manual Grade 5', 'Laboratory manual for science experiments', 'resources/lab_manuals/science_lab_g5.pdf', true, CURRENT_TIMESTAMP),
(1, 1, 'VIDEO', 'Nepali Language Videos', 'Video lessons for Nepali language', 'resources/videos/nepali_lessons/', true, CURRENT_TIMESTAMP),
(1, 2, 'VIDEO', 'English Language Videos', 'Video lessons for English language', 'resources/videos/english_lessons/', true, CURRENT_TIMESTAMP),

-- School 2 resources
(2, 11, 'TEXTBOOK', 'Nepali Textbook Class 5', 'Official Nepali textbook for Class 5 students', 'resources/textbooks/nepali_c5.pdf', true, CURRENT_TIMESTAMP),
(2, 12, 'TEXTBOOK', 'English Textbook Class 5', 'Official English textbook for Class 5 students', 'resources/textbooks/english_c5.pdf', true, CURRENT_TIMESTAMP),
(2, 13, 'TEXTBOOK', 'Mathematics Textbook Class 5', 'Official Mathematics textbook for Class 5 students', 'resources/textbooks/math_c5.pdf', true, CURRENT_TIMESTAMP),
(2, 14, 'TEXTBOOK', 'Science Textbook Class 5', 'Official Science textbook for Class 5 students', 'resources/textbooks/science_c5.pdf', true, CURRENT_TIMESTAMP),
(2, 15, 'TEXTBOOK', 'Social Studies Textbook Class 5', 'Official Social Studies textbook for Class 5 students', 'resources/textbooks/social_c5.pdf', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;