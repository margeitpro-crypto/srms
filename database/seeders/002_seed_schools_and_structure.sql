-- Seeder 002: Seed Schools and Academic Structure
-- Description: Seeds schools, districts, academic years, classes, and sections

-- Insert districts of Nepal
INSERT INTO districts (name, province, zone, is_active) VALUES
('Kathmandu', 'Bagmati', 'Bagmati', true),
('Lalitpur', 'Bagmati', 'Bagmati', true),
('Bhaktapur', 'Bagmati', 'Bagmati', true),
('Pokhara', 'Gandaki', 'Gandaki', true),
('Dharan', 'Province 1', 'Koshi', true),
('Biratnagar', 'Province 1', 'Koshi', true),
('Birgunj', 'Madhesh', 'Narayani', true),
('Janakpur', 'Madhesh', 'Janakpur', true),
('Butwal', 'Lumbini', 'Lumbini', true),
('Nepalgunj', 'Lumbini', 'Bheri', true),
('Dhangadhi', 'Sudurpashchim', 'Mahakali', true),
('Mahendranagar', 'Sudurpashchim', 'Mahakali', true),
('Hetauda', 'Bagmati', 'Bagmati', true),
('Chitwan', 'Bagmati', 'Narayani', true),
('Gorkha', 'Gandaki', 'Gandaki', true),
('Dhankuta', 'Province 1', 'Koshi', true),
('Ilam', 'Province 1', 'Mechi', true),
('Jhapa', 'Province 1', 'Mechi', true),
('Morang', 'Province 1', 'Koshi', true),
('Sunsari', 'Province 1', 'Koshi', true)
ON CONFLICT DO NOTHING;

-- Insert schools
INSERT INTO schools (name, address, district_id, contact, email, website, established_year, school_code, affiliation_number, principal_name, school_type, medium, is_active, logo, description, created_at) VALUES
('Shree Bagmati Secondary School', 'Kathmandu-15, Bagbazar', 1, '01-1234567', 'info@bagmatischool.edu.np', 'www.bagmatischool.edu.np', 1985, 'SCH001', 'NEP123456', 'Ram Prasad Sharma', 'PUBLIC', 'NEPALI', true, 'logos/bagmati.png', 'A renowned public school in Kathmandu providing quality education since 1985.', CURRENT_TIMESTAMP),
('Lalitpur Modern Academy', 'Lalitpur-10, Pulchowk', 2, '01-2345678', 'admin@lalitpurmodern.edu.np', 'www.lalitpurmodern.edu.np', 1992, 'SCH002', 'NEP234567', 'Sita Devi Shrestha', 'PRIVATE', 'ENGLISH', true, 'logos/lalitpurmodern.png', 'A modern private school with advanced facilities and English medium instruction.', CURRENT_TIMESTAMP),
('Bhaktapur Heritage School', 'Bhaktapur-5, Thimi', 3, '01-3456789', 'info@heritageschool.edu.np', 'www.heritageschool.edu.np', 1988, 'SCH003', 'NEP345678', 'Hari Bahadur Tamang', 'PUBLIC', 'NEPALI', true, 'logos/heritage.png', 'Preserving cultural heritage while providing modern education.', CURRENT_TIMESTAMP),
('Pokhara Valley School', 'Pokhara-12, Lakeside', 4, '061-4567890', 'contact@pokharavalley.edu.np', 'www.pokharavalley.edu.np', 1995, 'SCH004', 'NEP456789', 'Maya Gurung', 'PRIVATE', 'ENGLISH', true, 'logos/pokharavalley.png', 'A prestigious school in Pokhara with excellent academic records.', CURRENT_TIMESTAMP),
('Dharan Public School', 'Dharan-8, Bhanu Chowk', 5, '025-5678901', 'info@dharanpublic.edu.np', 'www.dharanpublic.edu.np', 1980, 'SCH005', 'NEP567890', 'Bishnu Prasad Rai', 'PUBLIC', 'NEPALI', true, 'logos/dharanpublic.png', 'One of the oldest and most respected schools in Eastern Nepal.', CURRENT_TIMESTAMP),
('Biratnagar International School', 'Biratnagar-3, Traffic Chowk', 6, '021-6789012', 'admin@biratnagaris.edu.np', 'www.biratnagaris.edu.np', 1998, 'SCH006', 'NEP678901', 'Indra Kumari Singh', 'PRIVATE', 'ENGLISH', true, 'logos/biratnagaris.png', 'International standard education with modern infrastructure.', CURRENT_TIMESTAMP),
('Birgunj Central Academy', 'Birgunj-1, Adarshanagar', 7, '051-7890123', 'info@birgunjcentral.edu.np', 'www.birgunjcentral.edu.np', 1990, 'SCH007', 'NEP789012', 'Rajesh Kumar Yadav', 'PUBLIC', 'NEPALI', true, 'logos/birgunjcentral.png', 'A leading educational institution in the Terai region.', CURRENT_TIMESTAMP),
('Janakpur Sanskrit School', 'Janakpur-6, Ram Mandir Area', 8, '041-8901234', 'contact@janakpursanskrit.edu.np', 'www.janakpursanskrit.edu.np', 1983, 'SCH008', 'NEP890123', 'Dr. Ram Chandra Jha', 'PUBLIC', 'SANSKRIT', true, 'logos/janakpursanskrit.png', 'Specialized in Sanskrit education with modern curriculum.', CURRENT_TIMESTAMP),
('Butwal Galaxy School', 'Butwal-11, Golpark', 9, '071-9012345', 'admin@butwalgalaxy.edu.np', 'www.butwalgalaxy.edu.np', 2000, 'SCH009', 'NEP901234', 'Saraswati Poudel', 'PRIVATE', 'ENGLISH', true, 'logos/butwalgalaxy.png', 'A modern school with advanced science and technology facilities.', CURRENT_TIMESTAMP),
('Nepalgunj Model School', 'Nepalgunj-4, BP Chowk', 10, '081-0123456', 'info@nepalgunjmodel.edu.np', 'www.nepalgunjmodel.edu.np', 1993, 'SCH010', 'NEP012345', 'Krishna Bahadur Thapa', 'PUBLIC', 'NEPALI', true, 'logos/nepalgunjmodel.png', 'Model school serving Western Nepal with quality education.', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert academic years
INSERT INTO academic_years (school_id, name, start_date, end_date, is_current, is_active, created_at) VALUES
(1, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(1, '2079/80', '2022-04-15', '2023-04-14', false, true, CURRENT_TIMESTAMP),
(1, '2078/79', '2021-04-15', '2022-04-14', false, true, CURRENT_TIMESTAMP),
(2, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(2, '2079/80', '2022-04-15', '2023-04-14', false, true, CURRENT_TIMESTAMP),
(3, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(4, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(5, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(6, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(7, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(8, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(9, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP),
(10, '2080/81', '2023-04-15', '2024-04-13', true, true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert classes
INSERT INTO classes (school_id, name, code, description, grade_level, is_active, created_at) VALUES
(1, 'Grade 1', 'G1', 'First grade primary education', 1, true, CURRENT_TIMESTAMP),
(1, 'Grade 2', 'G2', 'Second grade primary education', 2, true, CURRENT_TIMESTAMP),
(1, 'Grade 3', 'G3', 'Third grade primary education', 3, true, CURRENT_TIMESTAMP),
(1, 'Grade 4', 'G4', 'Fourth grade primary education', 4, true, CURRENT_TIMESTAMP),
(1, 'Grade 5', 'G5', 'Fifth grade primary education', 5, true, CURRENT_TIMESTAMP),
(1, 'Grade 6', 'G6', 'Sixth grade lower secondary education', 6, true, CURRENT_TIMESTAMP),
(1, 'Grade 7', 'G7', 'Seventh grade lower secondary education', 7, true, CURRENT_TIMESTAMP),
(1, 'Grade 8', 'G8', 'Eighth grade lower secondary education', 8, true, CURRENT_TIMESTAMP),
(1, 'Grade 9', 'G9', 'Ninth grade secondary education', 9, true, CURRENT_TIMESTAMP),
(1, 'Grade 10', 'G10', 'Tenth grade secondary education', 10, true, CURRENT_TIMESTAMP),
(2, 'Class 1', 'C1', 'First class primary education', 1, true, CURRENT_TIMESTAMP),
(2, 'Class 2', 'C2', 'Second class primary education', 2, true, CURRENT_TIMESTAMP),
(2, 'Class 3', 'C3', 'Third class primary education', 3, true, CURRENT_TIMESTAMP),
(2, 'Class 4', 'C4', 'Fourth class primary education', 4, true, CURRENT_TIMESTAMP),
(2, 'Class 5', 'C5', 'Fifth class primary education', 5, true, CURRENT_TIMESTAMP),
(2, 'Class 6', 'C6', 'Sixth class lower secondary education', 6, true, CURRENT_TIMESTAMP),
(2, 'Class 7', 'C7', 'Seventh class lower secondary education', 7, true, CURRENT_TIMESTAMP),
(2, 'Class 8', 'C8', 'Eighth class lower secondary education', 8, true, CURRENT_TIMESTAMP),
(2, 'Class 9', 'C9', 'Ninth class secondary education', 9, true, CURRENT_TIMESTAMP),
(2, 'Class 10', 'C10', 'Tenth class secondary education', 10, true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert sections
INSERT INTO sections (school_id, class_id, name, code, capacity, description, is_active, created_at) VALUES
(1, 1, 'Section A', '1A', 40, 'First section of Grade 1', true, CURRENT_TIMESTAMP),
(1, 1, 'Section B', '1B', 40, 'Second section of Grade 1', true, CURRENT_TIMESTAMP),
(1, 2, 'Section A', '2A', 40, 'First section of Grade 2', true, CURRENT_TIMESTAMP),
(1, 2, 'Section B', '2B', 40, 'Second section of Grade 2', true, CURRENT_TIMESTAMP),
(1, 3, 'Section A', '3A', 40, 'First section of Grade 3', true, CURRENT_TIMESTAMP),
(1, 3, 'Section B', '3B', 40, 'Second section of Grade 3', true, CURRENT_TIMESTAMP),
(1, 4, 'Section A', '4A', 40, 'First section of Grade 4', true, CURRENT_TIMESTAMP),
(1, 4, 'Section B', '4B', 40, 'Second section of Grade 4', true, CURRENT_TIMESTAMP),
(1, 5, 'Section A', '5A', 40, 'First section of Grade 5', true, CURRENT_TIMESTAMP),
(1, 5, 'Section B', '5B', 40, 'Second section of Grade 5', true, CURRENT_TIMESTAMP),
(1, 6, 'Section A', '6A', 35, 'First section of Grade 6', true, CURRENT_TIMESTAMP),
(1, 6, 'Section B', '6B', 35, 'Second section of Grade 6', true, CURRENT_TIMESTAMP),
(1, 7, 'Section A', '7A', 35, 'First section of Grade 7', true, CURRENT_TIMESTAMP),
(1, 7, 'Section B', '7B', 35, 'Second section of Grade 7', true, CURRENT_TIMESTAMP),
(1, 8, 'Section A', '8A', 35, 'First section of Grade 8', true, CURRENT_TIMESTAMP),
(1, 8, 'Section B', '8B', 35, 'Second section of Grade 8', true, CURRENT_TIMESTAMP),
(1, 9, 'Section A', '9A', 30, 'First section of Grade 9', true, CURRENT_TIMESTAMP),
(1, 9, 'Section B', '9B', 30, 'Second section of Grade 9', true, CURRENT_TIMESTAMP),
(1, 10, 'Section A', '10A', 30, 'First section of Grade 10', true, CURRENT_TIMESTAMP),
(1, 10, 'Section B', '10B', 30, 'Second section of Grade 10', true, CURRENT_TIMESTAMP),
(2, 11, 'Section A', '1A', 35, 'First section of Class 1', true, CURRENT_TIMESTAMP),
(2, 11, 'Section B', '1B', 35, 'Second section of Class 1', true, CURRENT_TIMESTAMP),
(2, 12, 'Section A', '2A', 35, 'First section of Class 2', true, CURRENT_TIMESTAMP),
(2, 12, 'Section B', '2B', 35, 'Second section of Class 2', true, CURRENT_TIMESTAMP),
(2, 13, 'Section A', '3A', 35, 'First section of Class 3', true, CURRENT_TIMESTAMP),
(2, 13, 'Section B', '3B', 35, 'Second section of Class 3', true, CURRENT_TIMESTAMP),
(2, 14, 'Section A', '4A', 35, 'First section of Class 4', true, CURRENT_TIMESTAMP),
(2, 14, 'Section B', '4B', 35, 'Second section of Class 4', true, CURRENT_TIMESTAMP),
(2, 15, 'Section A', '5A', 35, 'First section of Class 5', true, CURRENT_TIMESTAMP),
(2, 15, 'Section B', '5B', 35, 'Second section of Class 5', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;