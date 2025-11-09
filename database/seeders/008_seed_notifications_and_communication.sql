-- Seeder 008: Seed Notifications and Communication
-- Description: Seeds notification templates, notifications, announcements, and communication logs

-- Insert notification templates
INSERT INTO notification_templates (school_id, template_name, notification_type, subject_template, content_template, is_active, created_at) VALUES
-- School 1 notification templates
(1, 'Fee Due Reminder', 'FEE_REMINDER', 'Fee Payment Due - {{student_name}}', 'Dear {{parent_name}},\n\nThis is to remind you that the fee payment for {{student_name}} is due on {{due_date}}.\n\nAmount Due: Rs. {{amount_due}}\nFee Type: {{fee_type}}\n\nPlease make the payment at your earliest convenience to avoid any late fees.\n\nThank you,\n{{school_name}}', true, CURRENT_TIMESTAMP),

(1, 'Exam Result Published', 'EXAM_RESULT', 'Exam Results Published - {{student_name}}', 'Dear {{parent_name}},\n\nThe exam results for {{student_name}} have been published.\n\nExam: {{exam_name}}\nTotal Marks: {{total_marks}}\nObtained Marks: {{obtained_marks}}\nPercentage: {{percentage}}%\nGrade: {{grade}}\n\nPlease login to the portal to view detailed results.\n\nBest regards,\n{{school_name}}', true, CURRENT_TIMESTAMP),

(1, 'Student Absent Alert', 'ATTENDANCE_ALERT', '{{student_name}} Absent Today', 'Dear {{parent_name}},\n\nThis is to inform you that {{student_name}} was marked absent today ({{date}}).\n\nClass: {{class_name}}\nSection: {{section_name}}\n\nIf your child is sick or has any other reason for absence, please contact the school office.\n\nThank you,\n{{school_name}}', true, CURRENT_TIMESTAMP),

(1, 'Event Invitation', 'EVENT_NOTIFICATION', 'Invitation: {{event_name}}', 'Dear {{parent_name}},\n\nYou are cordially invited to attend {{event_name}} at our school.\n\nDate: {{event_date}}\nTime: {{event_time}}\nVenue: {{venue}}\n\nWe look forward to your presence.\n\nRegards,\n{{school_name}}', true, CURRENT_TIMESTAMP),

(1, 'Homework Assignment', 'HOMEWORK_NOTIFICATION', 'Homework Assigned - {{subject_name}}', 'Dear {{student_name}},\n\nNew homework has been assigned in {{subject_name}}.\n\nTopic: {{topic}}\nDue Date: {{due_date}}\nInstructions: {{instructions}}\n\nPlease complete and submit on time.\n\nBest regards,\n{{teacher_name}}', true, CURRENT_TIMESTAMP),

(1, 'Emergency Notice', 'EMERGENCY_ALERT', 'URGENT: {{notice_title}}', 'Dear {{parent_name}},\n\n{{emergency_message}}\n\n{{action_required}}\n\nPlease contact the school immediately if you have any questions.\n\n{{school_name}}\nContact: {{contact_number}}', true, CURRENT_TIMESTAMP),

-- School 2 notification templates
(2, 'Fee Payment Confirmation', 'FEE_CONFIRMATION', 'Fee Payment Received - {{student_name}}', 'Dear {{parent_name}},\n\nWe have received the fee payment for {{student_name}}.\n\nAmount: Rs. {{amount_paid}}\nPayment Date: {{payment_date}}\nPayment Method: {{payment_method}}\nTransaction ID: {{transaction_id}}\n\nThank you for your prompt payment.\n\nBest regards,\n{{school_name}}', true, CURRENT_TIMESTAMP),

(2, 'Exam Schedule Notification', 'EXAM_SCHEDULE', 'Exam Schedule - {{exam_name}}', 'Dear {{student_name}},\n\nYour exam schedule has been published.\n\nExam: {{exam_name}}\nStart Date: {{start_date}}\nEnd Date: {{end_date}}\n\nPlease check the detailed schedule in the student portal.\n\nBest of luck!\n{{school_name}}', true, CURRENT_TIMESTAMP),

(2, 'Performance Feedback', 'PERFORMANCE_FEEDBACK', 'Academic Feedback - {{student_name}}', 'Dear {{parent_name}},\n\nHere is the academic feedback for {{student_name}}.\n\nSubject: {{subject_name}}\nPerformance: {{performance_level}}\nAreas of Improvement: {{improvement_areas}}\nStrengths: {{strengths}}\n\n{{additional_comments}}\n\n{{teacher_name}}\n{{school_name}}', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert notifications
INSERT INTO notifications (school_id, template_id, sender_id, recipient_type, title, content, notification_type, priority, status, scheduled_at, created_at) VALUES
-- School 1 notifications
(1, 1, 4, 'PARENT', 'Fee Payment Due - Raj Kumar Sharma', 'Dear Mr. Sharma,\n\nThis is to remind you that the fee payment for Raj Kumar Sharma is due on 2024-03-31.\n\nAmount Due: Rs. 1500\nFee Type: Monthly Tuition Fee\n\nPlease make the payment at your earliest convenience to avoid any late fees.\n\nThank you,\nShree Krishna Secondary School', 'FEE_REMINDER', 'HIGH', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(1, 2, 4, 'PARENT', 'Exam Results Published - Raj Kumar Sharma', 'Dear Mr. Sharma,\n\nThe exam results for Raj Kumar Sharma have been published.\n\nExam: First Terminal Examination 2024\nTotal Marks: 600\nObtained Marks: 480\nPercentage: 80%\nGrade: A\n\nPlease login to the portal to view detailed results.\n\nBest regards,\nShree Krishna Secondary School', 'EXAM_RESULT', 'NORMAL', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(1, 3, 4, 'PARENT', 'Sita Kumari Thapa Absent Today', 'Dear Mr. Thapa,\n\nThis is to inform you that Sita Kumari Thapa was marked absent today (2024-03-20).\n\nClass: Grade 5\nSection: A\n\nIf your child is sick or has any other reason for absence, please contact the school office.\n\nThank you,\nShree Krishna Secondary School', 'ATTENDANCE_ALERT', 'HIGH', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(1, 4, 4, 'PARENT', 'Invitation: Annual Sports Day 2024', 'Dear Parents,\n\nYou are cordially invited to attend Annual Sports Day 2024 at our school.\n\nDate: 2024-04-15\nTime: 09:00 AM\nVenue: School Ground\n\nWe look forward to your presence.\n\nRegards,\nShree Krishna Secondary School', 'EVENT_NOTIFICATION', 'NORMAL', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(1, 5, 4, 'STUDENT', 'Homework Assigned - Mathematics', 'Dear Raj Kumar Sharma,\n\nNew homework has been assigned in Mathematics.\n\nTopic: Fractions and Decimals\nDue Date: 2024-03-25\nInstructions: Complete exercises 1-10 from textbook page 45-47\n\nPlease complete and submit on time.\n\nBest regards,\nHari Prasad Sharma', 'HOMEWORK_NOTIFICATION', 'NORMAL', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- School 2 notifications
(2, 7, 7, 'PARENT', 'Fee Payment Received - Amit Kumar Singh', 'Dear Mr. Singh,\n\nWe have received the fee payment for Amit Kumar Singh.\n\nAmount: Rs. 1800\nPayment Date: 2024-03-10\nPayment Method: Online\nTransaction ID: TXN-003-2024\n\nThank you for your prompt payment.\n\nBest regards,\nSunshine Academy', 'FEE_CONFIRMATION', 'NORMAL', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 8, 7, 'STUDENT', 'Exam Schedule - Final Examination 2024', 'Dear Amit Kumar Singh,\n\nYour exam schedule has been published.\n\nExam: Final Examination 2024\nStart Date: 2024-09-01\nEnd Date: 2024-09-15\n\nPlease check the detailed schedule in the student portal.\n\nBest of luck!\nSunshine Academy', 'EXAM_SCHEDULE', 'NORMAL', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

(2, 9, 7, 'PARENT', 'Academic Feedback - Amit Kumar Singh', 'Dear Mr. Singh,\n\nHere is the academic feedback for Amit Kumar Singh.\n\nSubject: Mathematics\nPerformance: Satisfactory\nAreas of Improvement: Basic arithmetic skills, problem-solving approach\nStrengths: Good attendance, participates in class discussions\n\nAmit needs to practice more mathematical problems at home. Regular revision is recommended.\n\nSuman Pradhan\nSunshine Academy', 'PERFORMANCE_FEEDBACK', 'NORMAL', 'SENT', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert notification recipients
INSERT INTO notification_recipients (notification_id, recipient_id, recipient_type, delivery_status, read_status, read_at, created_at) VALUES
-- School 1 notification recipients
(1, 8, 'PARENT', 'DELIVERED', 'READ', '2024-03-15', CURRENT_TIMESTAMP), -- Fee reminder to Raj's parent
(2, 8, 'PARENT', 'DELIVERED', 'READ', '2024-03-16', CURRENT_TIMESTAMP), -- Exam results to Raj's parent
(3, 9, 'PARENT', 'DELIVERED', 'READ', '2024-03-20', CURRENT_TIMESTAMP), -- Attendance alert to Sita's parent
(4, 8, 'PARENT', 'DELIVERED', 'UNREAD', NULL, CURRENT_TIMESTAMP), -- Event invitation to Raj's parent
(4, 9, 'PARENT', 'DELIVERED', 'READ', '2024-03-22', CURRENT_TIMESTAMP), -- Event invitation to Sita's parent
(5, 1, 'STUDENT', 'DELIVERED', 'READ', '2024-03-20', CURRENT_TIMESTAMP), -- Homework to Raj

-- School 2 notification recipients
(6, 10, 'PARENT', 'DELIVERED', 'READ', '2024-03-10', CURRENT_TIMESTAMP), -- Fee confirmation to Amit's parent
(7, 3, 'STUDENT', 'DELIVERED', 'READ', '2024-03-25', CURRENT_TIMESTAMP), -- Exam schedule to Amit
(8, 10, 'PARENT', 'DELIVERED', 'READ', '2024-03-26', CURRENT_TIMESTAMP) -- Performance feedback to Amit's parent
ON CONFLICT DO NOTHING;

-- Insert user notification preferences
INSERT INTO user_notification_preferences (user_id, notification_type, email_enabled, sms_enabled, push_enabled, in_app_enabled, created_at) VALUES
-- School 1 user preferences
(1, 'FEE_REMINDER', true, false, true, true, CURRENT_TIMESTAMP), -- Raj - Student
(1, 'EXAM_RESULT', true, true, true, true, CURRENT_TIMESTAMP),
(1, 'HOMEWORK_NOTIFICATION', true, false, true, true, CURRENT_TIMESTAMP),

(2, 'FEE_REMINDER', true, false, true, true, CURRENT_TIMESTAMP), -- Sita - Student
(2, 'EXAM_RESULT', true, true, true, true, CURRENT_TIMESTAMP),
(2, 'HOMEWORK_NOTIFICATION', true, false, true, true, CURRENT_TIMESTAMP),

(4, 'ALL', true, false, true, true, CURRENT_TIMESTAMP), -- School Admin - All notifications

(8, 'FEE_REMINDER', true, true, true, true, CURRENT_TIMESTAMP), -- Raj's parent
(8, 'EXAM_RESULT', true, true, true, true, CURRENT_TIMESTAMP),
(8, 'ATTENDANCE_ALERT', true, true, true, true, CURRENT_TIMESTAMP),
(8, 'EVENT_NOTIFICATION', true, false, true, true, CURRENT_TIMESTAMP),

(9, 'FEE_REMINDER', true, true, true, true, CURRENT_TIMESTAMP), -- Sita's parent
(9, 'EXAM_RESULT', true, true, true, true, CURRENT_TIMESTAMP),
(9, 'ATTENDANCE_ALERT', true, true, true, true, CURRENT_TIMESTAMP),
(9, 'EVENT_NOTIFICATION', true, false, true, true, CURRENT_TIMESTAMP),

-- School 2 user preferences
(3, 'FEE_CONFIRMATION', true, false, true, true, CURRENT_TIMESTAMP), -- Amit - Student
(3, 'EXAM_SCHEDULE', true, false, true, true, CURRENT_TIMESTAMP),
(3, 'PERFORMANCE_FEEDBACK', true, false, true, true, CURRENT_TIMESTAMP),

(7, 'ALL', true, false, true, true, CURRENT_TIMESTAMP), -- School Admin - All notifications

(10, 'FEE_CONFIRMATION', true, true, true, true, CURRENT_TIMESTAMP), -- Amit's parent
(10, 'EXAM_SCHEDULE', true, false, true, true, CURRENT_TIMESTAMP),
(10, 'PERFORMANCE_FEEDBACK', true, true, true, true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert communication logs
INSERT INTO communication_logs (school_id, sender_id, recipient_id, recipient_type, subject, message, communication_type, status, created_at) VALUES
-- School 1 communication logs
(1, 4, 8, 'PARENT', 'Parent-Teacher Meeting Schedule', 'Dear Mr. Sharma,\n\nThe Parent-Teacher Meeting for Grade 5 is scheduled for April 20, 2024, at 2:00 PM.\n\nPlease make sure to attend and discuss your child''s progress.\n\nThank you,\nHari Prasad Sharma\nPrincipal', 'EMAIL', 'SENT', CURRENT_TIMESTAMP),

(1, 4, 9, 'PARENT', 'Academic Performance Discussion', 'Dear Mr. Thapa,\n\nI would like to schedule a meeting to discuss Sita''s academic performance.\n\nShe has shown improvement in recent tests but needs more focus in Mathematics.\n\nPlease contact the office to schedule a convenient time.\n\nBest regards,\nHari Prasad Sharma\nPrincipal', 'EMAIL', 'SENT', CURRENT_TIMESTAMP),

(1, 6, 1, 'STUDENT', 'Sports Team Selection', 'Dear Raj,\n\nCongratulations! You have been selected for the school football team.\n\nPractice sessions will start from next Monday at 4:00 PM on the school ground.\n\nPlease bring your sports kit and water bottle.\n\nBest regards,\nRamesh Kumar\nSports Teacher', 'IN_APP', 'DELIVERED', CURRENT_TIMESTAMP),

-- School 2 communication logs
(2, 7, 10, 'PARENT', 'Academic Progress Update', 'Dear Mr. Singh,\n\nAmit has been performing well in most subjects. His participation in class activities has improved significantly.\n\nHowever, I recommend additional practice in Mathematics to strengthen his basic concepts.\n\nPlease feel free to contact me if you need any specific guidance.\n\nBest regards,\nSuman Pradhan\nPrincipal', 'EMAIL', 'SENT', CURRENT_TIMESTAMP),

(2, 7, 3, 'STUDENT', 'Library Book Reminder', 'Dear Amit,\n\nThis is a reminder that you have borrowed the book "Mathematics for Class 5" which is due for return on March 30, 2024.\n\nPlease return the book on time to avoid any late fees.\n\nThank you,\nLibrary Department', 'IN_APP', 'DELIVERED', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert announcement categories
INSERT INTO announcement_categories (school_id, name, description, is_active, created_at) VALUES
-- School 1 announcement categories
(1, 'Academic Announcements', 'Announcements related to academics, exams, and curriculum', true, CURRENT_TIMESTAMP),
(1, 'Administrative Announcements', 'Administrative notices, holidays, and school operations', true, CURRENT_TIMESTAMP),
(1, 'Event Announcements', 'School events, competitions, and cultural programs', true, CURRENT_TIMESTAMP),
(1, 'Emergency Announcements', 'Urgent notices, closures, and emergency information', true, CURRENT_TIMESTAMP),
(1, 'General Announcements', 'General information and miscellaneous notices', true, CURRENT_TIMESTAMP),

-- School 2 announcement categories
(2, 'Academic Announcements', 'Announcements related to academics, exams, and curriculum', true, CURRENT_TIMESTAMP),
(2, 'Administrative Announcements', 'Administrative notices, holidays, and school operations', true, CURRENT_TIMESTAMP),
(2, 'Event Announcements', 'School events, competitions, and cultural programs', true, CURRENT_TIMESTAMP),
(2, 'General Announcements', 'General information and miscellaneous notices', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert announcements
INSERT INTO announcements (school_id, category_id, title, content, priority, target_audience, publish_date, expiry_date, is_active, created_at) VALUES
-- School 1 announcements
(1, 1, 'First Terminal Examination Results', 'The results of First Terminal Examination 2024 have been published. Parents and students can check the results in the student portal using their login credentials.', 'HIGH', 'ALL', '2024-03-25', '2024-04-25', true, CURRENT_TIMESTAMP),

(1, 2, 'School Closed for Holi Festival', 'The school will remain closed on March 25, 2024, on account of Holi festival. Regular classes will resume from March 26, 2024.', 'NORMAL', 'ALL', '2024-03-20', '2024-03-26', true, CURRENT_TIMESTAMP),

(1, 3, 'Annual Sports Day 2024', 'Annual Sports Day will be held on April 15, 2024, at 9:00 AM on the school ground. All parents are invited to attend and encourage the participants.', 'HIGH', 'ALL', '2024-04-01', '2024-04-16', true, CURRENT_TIMESTAMP),

(1, 4, 'Emergency Drill Tomorrow', 'There will be a fire safety drill tomorrow at 11:00 AM. All students and staff must participate. Parents need not worry if they see emergency vehicles near the school.', 'URGENT', 'ALL', '2024-03-21', '2024-03-22', true, CURRENT_TIMESTAMP),

(1, 5, 'New Library Books Arrived', 'New books have been added to the school library. Students are encouraged to visit the library and borrow books of their interest.', 'NORMAL', 'STUDENTS', '2024-03-15', '2024-04-15', true, CURRENT_TIMESTAMP),

-- School 2 announcements
(2, 6, 'Final Examination Schedule', 'The Final Examination 2024 will be conducted from September 1-15, 2024. Detailed schedule is available in the student portal.', 'HIGH', 'ALL', '2024-08-20', '2024-09-16', true, CURRENT_TIMESTAMP),

(2, 7, 'Summer Vacation Notice', 'The school will remain closed for summer vacation from June 15 to July 15, 2024. School will reopen on July 16, 2024.', 'NORMAL', 'ALL', '2024-06-10', '2024-07-16', true, CURRENT_TIMESTAMP),

(2, 8, 'Science Exhibition 2024', 'Annual Science Exhibition will be held on August 30, 2024. Students are encouraged to participate with their innovative projects.', 'HIGH', 'ALL', '2024-08-01', '2024-08-31', true, CURRENT_TIMESTAMP),

(2, 9, 'Parent-Teacher Meeting', 'Parent-Teacher Meeting is scheduled for September 20, 2024, from 2:00 PM to 5:00 PM. All parents are requested to attend and discuss their child''s progress.', 'NORMAL', 'PARENTS', '2024-09-10', '2024-09-21', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert announcement views
INSERT INTO announcement_views (announcement_id, user_id, viewed_at, created_at) VALUES
-- School 1 announcement views
(1, 1, '2024-03-25', CURRENT_TIMESTAMP), -- Raj viewed exam results announcement
(1, 2, '2024-03-25', CURRENT_TIMESTAMP), -- Sita viewed exam results announcement
(1, 8, '2024-03-25', CURRENT_TIMESTAMP), -- Raj's parent viewed exam results announcement
(1, 9, '2024-03-25', CURRENT_TIMESTAMP), -- Sita's parent viewed exam results announcement

(2, 1, '2024-03-20', CURRENT_TIMESTAMP), -- Raj viewed Holi holiday announcement
(2, 2, '2024-03-20', CURRENT_TIMESTAMP), -- Sita viewed Holi holiday announcement
(2, 4, '2024-03-20', CURRENT_TIMESTAMP), -- School admin viewed Holi holiday announcement

(3, 1, '2024-04-01', CURRENT_TIMESTAMP), -- Raj viewed sports day announcement
(3, 2, '2024-04-01', CURRENT_TIMESTAMP), -- Sita viewed sports day announcement
(3, 8, '2024-04-01', CURRENT_TIMESTAMP), -- Raj's parent viewed sports day announcement
(3, 9, '2024-04-01', CURRENT_TIMESTAMP), -- Sita's parent viewed sports day announcement

(4, 4, '2024-03-21', CURRENT_TIMESTAMP), -- School admin viewed emergency drill announcement
(4, 6, '2024-03-21', CURRENT_TIMESTAMP), -- Sports teacher viewed emergency drill announcement

(5, 1, '2024-03-15', CURRENT_TIMESTAMP), -- Raj viewed library books announcement
(5, 2, '2024-03-15', CURRENT_TIMESTAMP), -- Sita viewed library books announcement

-- School 2 announcement views
(6, 3, '2024-08-20', CURRENT_TIMESTAMP), -- Amit viewed final exam schedule announcement
(6, 7, '2024-08-20', CURRENT_TIMESTAMP), -- School admin viewed final exam schedule announcement
(6, 10, '2024-08-20', CURRENT_TIMESTAMP), -- Amit's parent viewed final exam schedule announcement

(7, 3, '2024-06-10', CURRENT_TIMESTAMP), -- Amit viewed summer vacation announcement
(7, 7, '2024-06-10', CURRENT_TIMESTAMP), -- School admin viewed summer vacation announcement

(8, 3, '2024-08-01', CURRENT_TIMESTAMP), -- Amit viewed science exhibition announcement
(8, 7, '2024-08-01', CURRENT_TIMESTAMP), -- School admin viewed science exhibition announcement

(9, 10, '2024-09-10', CURRENT_TIMESTAMP) -- Amit's parent viewed PTM announcement
ON CONFLICT DO NOTHING;