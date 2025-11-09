-- Seeder 003: Seed Students and Student Management
-- Description: Seeds students, student categories, enrollments, and attendance

-- Insert student categories
INSERT INTO student_categories (school_id, name, description, is_active, created_at) VALUES
(1, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(1, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(1, 'Disabled', 'Students with special needs', true, CURRENT_TIMESTAMP),
(1, 'Indigenous', 'Students from indigenous communities', true, CURRENT_TIMESTAMP),
(1, 'Dalit', 'Students from Dalit community', true, CURRENT_TIMESTAMP),
(2, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(2, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(2, 'Disabled', 'Students with special needs', true, CURRENT_TIMESTAMP),
(3, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(3, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(4, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(4, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(5, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(5, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(6, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(6, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(7, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(7, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(8, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(8, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(9, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(9, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP),
(10, 'General', 'General category students', true, CURRENT_TIMESTAMP),
(10, 'Scholarship', 'Students with scholarship benefits', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert students for different schools
INSERT INTO students (school_id, first_name, last_name, email, phone, date_of_birth, gender, blood_group, address, city, district, emergency_contact, emergency_phone, guardian_name, guardian_phone, guardian_email, guardian_relationship, admission_date, admission_number, roll_number, status, is_active, photo_path, created_at) VALUES
-- School 1 (Shree Bagmati Secondary School)
(1, 'Aarav', 'Sharma', 'aarav.sharma@student.edu.np', '9801234567', '2015-03-15', 'MALE', 'O+', 'Kathmandu-15, Bagbazar', 'Kathmandu', 'Kathmandu', 'Father', '9801234568', 'Ramesh Sharma', '9801234568', 'ramesh.sharma@email.com', 'FATHER', '2023-04-15', 'STU001', '001', 'ACTIVE', true, 'photos/student001.jpg', CURRENT_TIMESTAMP),
(1, 'Priya', 'Thapa', 'priya.thapa@student.edu.np', '9801234569', '2015-06-20', 'FEMALE', 'A+', 'Kathmandu-16, Thamel', 'Kathmandu', 'Kathmandu', 'Mother', '9801234570', 'Sita Thapa', '9801234570', 'sita.thapa@email.com', 'MOTHER', '2023-04-15', 'STU002', '002', 'ACTIVE', true, 'photos/student002.jpg', CURRENT_TIMESTAMP),
(1, 'Bibek', 'Gautam', 'bibek.gautam@student.edu.np', '9801234571', '2015-01-10', 'MALE', 'B+', 'Kathmandu-17, Asan', 'Kathmandu', 'Kathmandu', 'Father', '9801234572', 'Hari Gautam', '9801234572', 'hari.gautam@email.com', 'FATHER', '2023-04-15', 'STU003', '003', 'ACTIVE', true, 'photos/student003.jpg', CURRENT_TIMESTAMP),
(1, 'Sneha', 'Rai', 'sneha.rai@student.edu.np', '9801234573', '2015-08-05', 'FEMALE', 'AB+', 'Kathmandu-18, Patan', 'Kathmandu', 'Kathmandu', 'Mother', '9801234574', 'Maya Rai', '9801234574', 'maya.rai@email.com', 'MOTHER', '2023-04-15', 'STU004', '004', 'ACTIVE', true, 'photos/student004.jpg', CURRENT_TIMESTAMP),
(1, 'Niraj', 'Khadka', 'niraj.khadka@student.edu.np', '9801234575', '2015-11-12', 'MALE', 'O-', 'Kathmandu-19, Bhaktapur', 'Kathmandu', 'Kathmandu', 'Father', '9801234576', 'Bishnu Khadka', '9801234576', 'bishnu.khadka@email.com', 'FATHER', '2023-04-15', 'STU005', '005', 'ACTIVE', true, 'photos/student005.jpg', CURRENT_TIMESTAMP),
(1, 'Anita', 'Lama', 'anita.lama@student.edu.np', '9801234577', '2015-02-28', 'FEMALE', 'A-', 'Kathmandu-20, Swayambhu', 'Kathmandu', 'Kathmandu', 'Mother', '9801234578', 'Laxmi Lama', '9801234578', 'laxmi.lama@email.com', 'MOTHER', '2023-04-15', 'STU006', '006', 'ACTIVE', true, 'photos/student006.jpg', CURRENT_TIMESTAMP),
(1, 'Rajan', 'Magar', 'rajan.magar@student.edu.np', '9801234579', '2015-07-18', 'MALE', 'B-', 'Kathmandu-21, Kirtipur', 'Kathmandu', 'Kathmandu', 'Father', '9801234580', 'Tika Magar', '9801234580', 'tika.magar@email.com', 'FATHER', '2023-04-15', 'STU007', '007', 'ACTIVE', true, 'photos/student007.jpg', CURRENT_TIMESTAMP),
(1, 'Pooja', 'Bhattarai', 'pooja.bhattarai@student.edu.np', '9801234581', '2015-09-25', 'FEMALE', 'AB-', 'Kathmandu-22, Budhanilkantha', 'Kathmandu', 'Kathmandu', 'Mother', '9801234582', 'Saraswati Bhattarai', '9801234582', 'saraswati.bhattarai@email.com', 'MOTHER', '2023-04-15', 'STU008', '008', 'ACTIVE', true, 'photos/student008.jpg', CURRENT_TIMESTAMP),
(1, 'Santosh', 'Poudel', 'santosh.poudel@student.edu.np', '9801234583', '2015-04-30', 'MALE', 'O+', 'Kathmandu-23, Gokarna', 'Kathmandu', 'Kathmandu', 'Father', '9801234584', 'Gopal Poudel', '9801234584', 'gopal.poudel@email.com', 'FATHER', '2023-04-15', 'STU009', '009', 'ACTIVE', true, 'photos/student009.jpg', CURRENT_TIMESTAMP),
(1, 'Mina', 'Karki', 'mina.karki@student.edu.np', '9801234585', '2015-12-10', 'FEMALE', 'A+', 'Kathmandu-24, Sundarijal', 'Kathmandu', 'Kathmandu', 'Mother', '9801234586', 'Parvati Karki', '9801234586', 'parvati.karki@email.com', 'MOTHER', '2023-04-15', 'STU010', '010', 'ACTIVE', true, 'photos/student010.jpg', CURRENT_TIMESTAMP),

-- School 2 (Lalitpur Modern Academy)
(2, 'Aayush', 'Shrestha', 'aayush.shrestha@student.edu.np', '9802234567', '2015-05-15', 'MALE', 'B+', 'Lalitpur-10, Pulchowk', 'Lalitpur', 'Lalitpur', 'Father', '9802234568', 'Dinesh Shrestha', '9802234568', 'dinesh.shrestha@email.com', 'FATHER', '2023-04-15', 'STU011', '011', 'ACTIVE', true, 'photos/student011.jpg', CURRENT_TIMESTAMP),
(2, 'Barsha', 'Silwal', 'barsha.silwal@student.edu.np', '9802234569', '2015-08-20', 'FEMALE', 'O+', 'Lalitpur-11, Jawalakhel', 'Lalitpur', 'Lalitpur', 'Mother', '9802234570', 'Sunita Silwal', '9802234570', 'sunita.silwal@email.com', 'MOTHER', '2023-04-15', 'STU012', '012', 'ACTIVE', true, 'photos/student012.jpg', CURRENT_TIMESTAMP),
(2, 'Chandan', 'Maharjan', 'chandan.maharjan@student.edu.np', '9802234571', '2015-03-10', 'MALE', 'A+', 'Lalitpur-12, Lagankhel', 'Lalitpur', 'Lalitpur', 'Father', '9802234572', 'Ramesh Maharjan', '9802234572', 'ramesh.maharjan@email.com', 'FATHER', '2023-04-15', 'STU013', '013', 'ACTIVE', true, 'photos/student013.jpg', CURRENT_TIMESTAMP),
(2, 'Deepa', 'Pradhan', 'deepa.pradhan@student.edu.np', '9802234573', '2015-10-05', 'FEMALE', 'AB+', 'Lalitpur-13, Kupondole', 'Lalitpur', 'Lalitpur', 'Mother', '9802234574', 'Sita Pradhan', '9802234574', 'sita.pradhan@email.com', 'MOTHER', '2023-04-15', 'STU014', '014', 'ACTIVE', true, 'photos/student014.jpg', CURRENT_TIMESTAMP),
(2, 'Gaurav', 'Tamang', 'gaurav.tamang@student.edu.np', '9802234575', '2015-01-12', 'MALE', 'O-', 'Lalitpur-14, Satdobato', 'Lalitpur', 'Lalitpur', 'Father', '9802234576', 'Harka Tamang', '9802234576', 'harka.tamang@email.com', 'FATHER', '2023-04-15', 'STU015', '015', 'ACTIVE', true, 'photos/student015.jpg', CURRENT_TIMESTAMP),

-- School 3 (Bhaktapur Heritage School)
(3, 'Hari', 'Dangol', 'hari.dangol@student.edu.np', '9803234567', '2015-07-15', 'MALE', 'A+', 'Bhaktapur-5, Thimi', 'Bhaktapur', 'Bhaktapur', 'Father', '9803234568', 'Krishna Dangol', '9803234568', 'krishna.dangol@email.com', 'FATHER', '2023-04-15', 'STU016', '016', 'ACTIVE', true, 'photos/student016.jpg', CURRENT_TIMESTAMP),
(3, 'Isha', 'Nakarmi', 'isha.nakarmi@student.edu.np', '9803234569', '2015-12-20', 'FEMALE', 'B+', 'Bhaktapur-6, Sallaghari', 'Bhaktapur', 'Bhaktapur', 'Mother', '9803234570', 'Laxmi Nakarmi', '9803234570', 'laxmi.nakarmi@email.com', 'MOTHER', '2023-04-15', 'STU017', '017', 'ACTIVE', true, 'photos/student017.jpg', CURRENT_TIMESTAMP),
(3, 'Jeevan', 'Koju', 'jeevan.koju@student.edu.np', '9803234571', '2015-04-10', 'MALE', 'O+', 'Bhaktapur-7, Madhyapur', 'Bhaktapur', 'Bhaktapur', 'Father', '9803234572', 'Bishnu Koju', '9803234572', 'bishnu.koju@email.com', 'FATHER', '2023-04-15', 'STU018', '018', 'ACTIVE', true, 'photos/student018.jpg', CURRENT_TIMESTAMP),
(3, 'Kamala', 'Baidya', 'kamala.baidya@student.edu.np', '9803234573', '2015-09-05', 'FEMALE', 'AB-', 'Bhaktapur-8, Changunarayan', 'Bhaktapur', 'Bhaktapur', 'Mother', '9803234574', 'Saraswati Baidya', '9803234574', 'saraswati.baidya@email.com', 'MOTHER', '2023-04-15', 'STU019', '019', 'ACTIVE', true, 'photos/student019.jpg', CURRENT_TIMESTAMP),
(3, 'Lokendra', 'Byanjankar', 'lokendra.byanjankar@student.edu.np', '9803234575', '2015-02-12', 'MALE', 'A-', 'Bhaktapur-9, Nagarkot Road', 'Bhaktapur', 'Bhaktapur', 'Father', '9803234576', 'Ramesh Byanjankar', '9803234576', 'ramesh.byanjankar@email.com', 'FATHER', '2023-04-15', 'STU020', '020', 'ACTIVE', true, 'photos/student020.jpg', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert student enrollments
INSERT INTO student_enrollments (student_id, school_id, academic_year_id, class_id, section_id, enrollment_date, enrollment_number, status, is_active, created_at) VALUES
-- School 1 enrollments
(1, 1, 1, 5, 9, '2023-04-15', 'ENRL001', 'ACTIVE', true, CURRENT_TIMESTAMP),
(2, 1, 1, 5, 9, '2023-04-15', 'ENRL002', 'ACTIVE', true, CURRENT_TIMESTAMP),
(3, 1, 1, 5, 10, '2023-04-15', 'ENRL003', 'ACTIVE', true, CURRENT_TIMESTAMP),
(4, 1, 1, 5, 10, '2023-04-15', 'ENRL004', 'ACTIVE', true, CURRENT_TIMESTAMP),
(5, 1, 1, 5, 9, '2023-04-15', 'ENRL005', 'ACTIVE', true, CURRENT_TIMESTAMP),
(6, 1, 1, 5, 10, '2023-04-15', 'ENRL006', 'ACTIVE', true, CURRENT_TIMESTAMP),
(7, 1, 1, 5, 9, '2023-04-15', 'ENRL007', 'ACTIVE', true, CURRENT_TIMESTAMP),
(8, 1, 1, 5, 10, '2023-04-15', 'ENRL008', 'ACTIVE', true, CURRENT_TIMESTAMP),
(9, 1, 1, 5, 9, '2023-04-15', 'ENRL009', 'ACTIVE', true, CURRENT_TIMESTAMP),
(10, 1, 1, 5, 10, '2023-04-15', 'ENRL010', 'ACTIVE', true, CURRENT_TIMESTAMP),

-- School 2 enrollments
(11, 2, 2, 16, 31, '2023-04-15', 'ENRL011', 'ACTIVE', true, CURRENT_TIMESTAMP),
(12, 2, 2, 16, 31, '2023-04-15', 'ENRL012', 'ACTIVE', true, CURRENT_TIMESTAMP),
(13, 2, 2, 16, 32, '2023-04-15', 'ENRL013', 'ACTIVE', true, CURRENT_TIMESTAMP),
(14, 2, 2, 16, 32, '2023-04-15', 'ENRL014', 'ACTIVE', true, CURRENT_TIMESTAMP),
(15, 2, 2, 16, 31, '2023-04-15', 'ENRL015', 'ACTIVE', true, CURRENT_TIMESTAMP),

-- School 3 enrollments
(16, 3, 3, 27, 53, '2023-04-15', 'ENRL016', 'ACTIVE', true, CURRENT_TIMESTAMP),
(17, 3, 3, 27, 53, '2023-04-15', 'ENRL017', 'ACTIVE', true, CURRENT_TIMESTAMP),
(18, 3, 3, 27, 54, '2023-04-15', 'ENRL018', 'ACTIVE', true, CURRENT_TIMESTAMP),
(19, 3, 3, 27, 54, '2023-04-15', 'ENRL019', 'ACTIVE', true, CURRENT_TIMESTAMP),
(20, 3, 3, 27, 53, '2023-04-15', 'ENRL020', 'ACTIVE', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert student category assignments
INSERT INTO student_category_assignments (student_id, category_id, assigned_date, remarks, created_at) VALUES
(1, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(2, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(3, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(4, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(5, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(6, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(7, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(8, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(9, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(10, 1, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(11, 6, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(12, 6, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(13, 6, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(14, 6, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(15, 6, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(16, 11, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(17, 11, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(18, 11, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(19, 11, '2023-04-15', 'General category student', CURRENT_TIMESTAMP),
(20, 11, '2023-04-15', 'General category student', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;