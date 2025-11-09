-- Seeder 007: Seed Certificates and Documents
-- Description: Seeds certificate templates, certificates, documents, and document management data

-- Insert certificate templates
INSERT INTO certificate_templates (school_id, name, template_type, description, template_content, header_image, footer_image, signature_required, is_active, created_at) VALUES
-- School 1 certificate templates
(1, 'Student Character Certificate', 'CHARACTER_CERTIFICATE', 'Character certificate template for students', '<div class="certificate">
  <h2>Character Certificate</h2>
  <p>This is to certify that {{student_name}} has been a student of this school from {{start_date}} to {{end_date}}.</p>
  <p>During this period, {{he_she}} has shown good character and conduct.</p>
  <div class="signature">{{principal_name}}<br>Principal</div>
</div>', 'templates/headers/school_header.png', 'templates/footers/school_footer.png', true, true, CURRENT_TIMESTAMP),

(1, 'Student Transfer Certificate', 'TRANSFER_CERTIFICATE', 'Transfer certificate template for students', '<div class="certificate">
  <h2>Transfer Certificate</h2>
  <p>This is to certify that {{student_name}} has been a student of this school in Class {{class_name}}.</p>
  <p>{{He_She}} is eligible for admission to Class {{next_class}}.</p>
  <p>Date of leaving: {{leaving_date}}</p>
  <div class="signature">{{principal_name}}<br>Principal</div>
</div>', 'templates/headers/school_header.png', 'templates/footers/school_footer.png', true, true, CURRENT_TIMESTAMP),

(1, 'Academic Achievement Certificate', 'ACADEMIC_CERTIFICATE', 'Academic achievement certificate template', '<div class="certificate">
  <h2>Academic Achievement Certificate</h2>
  <p>This certificate is awarded to {{student_name}} for outstanding academic performance in {{academic_year}}.</p>
  <p>Grade: {{grade}} | Percentage: {{percentage}}%</p>
  <div class="signature">{{principal_name}}<br>Principal</div>
</div>', 'templates/headers/school_header.png', 'templates/footers/school_footer.png', true, true, CURRENT_TIMESTAMP),

(1, 'Sports Achievement Certificate', 'SPORTS_CERTIFICATE', 'Sports achievement certificate template', '<div class="certificate">
  <h2>Sports Achievement Certificate</h2>
  <p>This certificate is awarded to {{student_name}} for excellence in {{sport_name}}.</p>
  <p>Event: {{event_name}} | Position: {{position}}</p>
  <p>Date: {{event_date}}</p>
  <div class="signature">{{sports_teacher}}<br>Sports Teacher</div>
</div>', 'templates/headers/school_header.png', 'templates/footers/school_footer.png', true, true, CURRENT_TIMESTAMP),

(1, 'Participation Certificate', 'PARTICIPATION_CERTIFICATE', 'Participation certificate template', '<div class="certificate">
  <h2>Participation Certificate</h2>
  <p>This certificate is awarded to {{student_name}} for active participation in {{event_name}}.</p>
  <p>Date: {{event_date}} | Event Type: {{event_type}}</p>
  <div class="signature">{{coordinator_name}}<br>Event Coordinator</div>
</div>', 'templates/headers/school_header.png', 'templates/footers/school_footer.png', true, true, CURRENT_TIMESTAMP),

-- School 2 certificate templates
(2, 'Student Character Certificate', 'CHARACTER_CERTIFICATE', 'Character certificate template for students', '<div class="certificate">
  <h2>Character Certificate</h2>
  <p>This is to certify that {{student_name}} has been a student of this school from {{start_date}} to {{end_date}}.</p>
  <p>During this period, {{he_she}} has shown good character and conduct.</p>
  <div class="signature">{{principal_name}}<br>Principal</div>
</div>', 'templates/headers/academy_header.png', 'templates/footers/academy_footer.png', true, true, CURRENT_TIMESTAMP),

(2, 'Academic Excellence Certificate', 'ACADEMIC_CERTIFICATE', 'Academic excellence certificate template', '<div class="certificate">
  <h2>Academic Excellence Certificate</h2>
  <p>This certificate is awarded to {{student_name}} for exceptional academic performance in {{academic_year}}.</p>
  <p>Grade: {{grade}} | Percentage: {{percentage}}% | Position: {{position}}</p>
  <div class="signature">{{principal_name}}<br>Principal</div>
</div>', 'templates/headers/academy_header.png', 'templates/footers/academy_footer.png', true, true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert certificates
INSERT INTO certificates (student_id, certificate_template_id, certificate_number, issued_date, valid_until, certificate_data, certificate_status, created_at) VALUES
-- School 1 certificates
(1, 1, 'CERT-2024-001', '2024-03-15', '2025-03-15', '{"student_name":"Raj Kumar Sharma","start_date":"2023-01-01","end_date":"2024-03-15","principal_name":"Hari Prasad Sharma"}', 'ISSUED', CURRENT_TIMESTAMP),
(1, 3, 'CERT-2024-002', '2024-04-10', '2025-04-10', '{"student_name":"Raj Kumar Sharma","academic_year":"2023-2024","grade":"A","percentage":"85","principal_name":"Hari Prasad Sharma"}', 'ISSUED', CURRENT_TIMESTAMP),
(2, 1, 'CERT-2024-003', '2024-03-20', '2025-03-20', '{"student_name":"Sita Kumari Thapa","start_date":"2023-01-01","end_date":"2024-03-20","principal_name":"Hari Prasad Sharma"}', 'ISSUED', CURRENT_TIMESTAMP),
(2, 4, 'CERT-2024-004', '2024-04-05', '2025-04-05', '{"student_name":"Sita Kumari Thapa","sport_name":"Football","event_name":"Inter-school Football Tournament","position":"First","event_date":"2024-03-10","sports_teacher":"Ramesh Kumar"}', 'ISSUED', CURRENT_TIMESTAMP),

-- School 2 certificates
(3, 6, 'CERT-2024-005', '2024-03-25', '2025-03-25', '{"student_name":"Amit Kumar Singh","start_date":"2023-06-01","end_date":"2024-03-25","principal_name":"Suman Pradhan"}', 'ISSUED', CURRENT_TIMESTAMP),
(3, 7, 'CERT-2024-006', '2024-04-15', '2025-04-15', '{"student_name":"Amit Kumar Singh","academic_year":"2023-2024","grade":"B+","percentage":"75","position":"5","principal_name":"Suman Pradhan"}', 'ISSUED', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert certificate requests
INSERT INTO certificate_requests (student_id, certificate_template_id, request_date, purpose, requested_by, request_status, approved_by, approved_date, rejection_reason, created_at) VALUES
-- School 1 certificate requests
(1, 2, '2024-04-01', 'School transfer to another district', 1, 'APPROVED', 4, '2024-04-02', NULL, CURRENT_TIMESTAMP),
(2, 5, '2024-04-08', 'Participation in science exhibition', 2, 'APPROVED', 4, '2024-04-09', NULL, CURRENT_TIMESTAMP),
(1, 4, '2024-04-12', 'Participation in inter-school sports competition', 1, 'PENDING', NULL, NULL, NULL, CURRENT_TIMESTAMP),

-- School 2 certificate requests
(3, 6, '2024-04-20', 'Character verification for admission', 3, 'APPROVED', 7, '2024-04-21', NULL, CURRENT_TIMESTAMP),
(3, 7, '2024-04-25', 'Academic performance verification', 3, 'PENDING', NULL, NULL, NULL, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert document categories
INSERT INTO document_categories (school_id, name, description, is_active, created_at) VALUES
-- School 1 document categories
(1, 'Academic Documents', 'Student academic records and certificates', true, CURRENT_TIMESTAMP),
(1, 'Administrative Documents', 'School administrative and management documents', true, CURRENT_TIMESTAMP),
(1, 'Financial Documents', 'Fee receipts, invoices, and financial records', true, CURRENT_TIMESTAMP),
(1, 'Student Records', 'Student personal and academic records', true, CURRENT_TIMESTAMP),
(1, 'Teacher Records', 'Teacher personal and professional records', true, CURRENT_TIMESTAMP),
(1, 'Examination Documents', 'Exam papers, results, and related documents', true, CURRENT_TIMESTAMP),
(1, 'Legal Documents', 'Legal agreements, contracts, and compliance documents', true, CURRENT_TIMESTAMP),
(1, 'Policy Documents', 'School policies, rules, and regulations', true, CURRENT_TIMESTAMP),
(1, 'Communication Documents', 'Letters, notices, and communication records', true, CURRENT_TIMESTAMP),
(1, 'Event Documents', 'Event records, photos, and related documents', true, CURRENT_TIMESTAMP),

-- School 2 document categories
(2, 'Academic Documents', 'Student academic records and certificates', true, CURRENT_TIMESTAMP),
(2, 'Administrative Documents', 'School administrative and management documents', true, CURRENT_TIMESTAMP),
(2, 'Financial Documents', 'Fee receipts, invoices, and financial records', true, CURRENT_TIMESTAMP),
(2, 'Student Records', 'Student personal and academic records', true, CURRENT_TIMESTAMP),
(2, 'Examination Documents', 'Exam papers, results, and related documents', true, CURRENT_TIMESTAMP),
(2, 'Policy Documents', 'School policies, rules, and regulations', true, CURRENT_TIMESTAMP),
(2, 'Communication Documents', 'Letters, notices, and communication records', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert documents
INSERT INTO documents (school_id, document_category_id, title, description, file_path, file_size, file_type, uploaded_by, is_public, is_active, created_at) VALUES
-- School 1 documents
(1, 1, 'Grade 5 Syllabus 2024', 'Complete syllabus for Grade 5 academic year 2024', 'documents/syllabus/grade5_2024.pdf', 2048576, 'application/pdf', 4, true, true, CURRENT_TIMESTAMP),
(1, 1, 'Academic Calendar 2024', 'Academic calendar with important dates and events', 'documents/calendar/academic_calendar_2024.pdf', 1024000, 'application/pdf', 4, true, true, CURRENT_TIMESTAMP),
(1, 2, 'School Registration Certificate', 'School registration and affiliation certificate', 'documents/certificates/school_registration.pdf', 1536000, 'application/pdf', 4, false, true, CURRENT_TIMESTAMP),
(1, 3, 'Fee Structure 2024', 'Complete fee structure for all classes', 'documents/fees/fee_structure_2024.pdf', 512000, 'application/pdf', 4, true, true, CURRENT_TIMESTAMP),
(1, 4, 'Student Admission Form', 'Standard student admission form template', 'documents/forms/admission_form.pdf', 256000, 'application/pdf', 4, true, true, CURRENT_TIMESTAMP),
(1, 5, 'Teacher Appointment Letter', 'Standard teacher appointment letter template', 'documents/letters/appointment_letter.pdf', 204800, 'application/pdf', 4, false, true, CURRENT_TIMESTAMP),
(1, 6, 'Exam Schedule Template', 'Template for examination schedules', 'documents/exams/exam_schedule_template.pdf', 307200, 'application/pdf', 4, false, true, CURRENT_TIMESTAMP),
(1, 7, 'School Rules and Regulations', 'Complete school rules and regulations document', 'documents/policies/rules_regulations.pdf', 1048576, 'application/pdf', 4, true, true, CURRENT_TIMESTAMP),
(1, 8, 'Privacy Policy', 'School privacy policy for student data', 'documents/policies/privacy_policy.pdf', 409600, 'application/pdf', 4, true, true, CURRENT_TIMESTAMP),
(1, 9, 'Parent-Teacher Meeting Notice', 'Template for parent-teacher meeting notices', 'documents/notices/ptm_notice.pdf', 204800, 'application/pdf', 4, true, true, CURRENT_TIMESTAMP),
(1, 10, 'Annual Sports Day Photos', 'Photos from annual sports day event', 'documents/events/sports_day_2024/', 10485760, 'image/jpeg', 4, true, true, CURRENT_TIMESTAMP),

-- School 2 documents
(2, 11, 'Class 5 Curriculum', 'Complete curriculum for Class 5', 'documents/curriculum/class5_2024.pdf', 1536000, 'application/pdf', 7, true, true, CURRENT_TIMESTAMP),
(2, 11, 'Academic Calendar 2024', 'Academic calendar with important dates and events', 'documents/calendar/academic_calendar_2024.pdf', 1024000, 'application/pdf', 7, true, true, CURRENT_TIMESTAMP),
(2, 12, 'Academy Registration Certificate', 'Academy registration and affiliation certificate', 'documents/certificates/academy_registration.pdf', 1536000, 'application/pdf', 7, false, true, CURRENT_TIMESTAMP),
(2, 13, 'Fee Structure 2024', 'Complete fee structure for all classes', 'documents/fees/fee_structure_2024.pdf', 512000, 'application/pdf', 7, true, true, CURRENT_TIMESTAMP),
(2, 14, 'Student Registration Form', 'Standard student registration form template', 'documents/forms/registration_form.pdf', 256000, 'application/pdf', 7, true, true, CURRENT_TIMESTAMP),
(2, 15, 'Examination Guidelines', 'Guidelines for conducting examinations', 'documents/exams/exam_guidelines.pdf', 409600, 'application/pdf', 7, false, true, CURRENT_TIMESTAMP),
(2, 16, 'Academy Policies', 'Complete academy policies document', 'documents/policies/academy_policies.pdf', 1048576, 'application/pdf', 7, true, true, CURRENT_TIMESTAMP),
(2, 17, 'Student Notice Template', 'Template for student notices', 'documents/notices/student_notice.pdf', 204800, 'application/pdf', 7, true, true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert document category assignments
INSERT INTO document_category_assignments (document_id, category_id, is_primary, created_at) VALUES
-- School 1 document assignments
(1, 1, true, CURRENT_TIMESTAMP), -- Grade 5 Syllabus -> Academic Documents
(2, 1, true, CURRENT_TIMESTAMP), -- Academic Calendar -> Academic Documents
(3, 2, true, CURRENT_TIMESTAMP), -- School Registration -> Administrative Documents
(4, 3, true, CURRENT_TIMESTAMP), -- Fee Structure -> Financial Documents
(5, 4, true, CURRENT_TIMESTAMP), -- Admission Form -> Student Records
(6, 5, true, CURRENT_TIMESTAMP), -- Appointment Letter -> Teacher Records
(7, 6, true, CURRENT_TIMESTAMP), -- Exam Schedule -> Examination Documents
(8, 8, true, CURRENT_TIMESTAMP), -- Rules and Regulations -> Policy Documents
(9, 9, true, CURRENT_TIMESTAMP), -- PTM Notice -> Communication Documents
(10, 10, true, CURRENT_TIMESTAMP), -- Sports Day Photos -> Event Documents

-- School 2 document assignments
(11, 11, true, CURRENT_TIMESTAMP), -- Class 5 Curriculum -> Academic Documents
(12, 11, true, CURRENT_TIMESTAMP), -- Academic Calendar -> Academic Documents
(13, 12, true, CURRENT_TIMESTAMP), -- Academy Registration -> Administrative Documents
(14, 13, true, CURRENT_TIMESTAMP), -- Fee Structure -> Financial Documents
(15, 14, true, CURRENT_TIMESTAMP), -- Registration Form -> Student Records
(16, 15, true, CURRENT_TIMESTAMP), -- Examination Guidelines -> Examination Documents
(17, 16, true, CURRENT_TIMESTAMP) -- Academy Policies -> Policy Documents
ON CONFLICT DO NOTHING;

-- Insert certificate signatures
INSERT INTO certificate_signatures (certificate_id, user_id, signature_path, signed_date, signature_role, is_active, created_at) VALUES
(1, 4, 'signatures/principal_signature_001.png', '2024-03-15', 'PRINCIPAL', true, CURRENT_TIMESTAMP),
(2, 4, 'signatures/principal_signature_002.png', '2024-04-10', 'PRINCIPAL', true, CURRENT_TIMESTAMP),
(3, 4, 'signatures/principal_signature_003.png', '2024-03-20', 'PRINCIPAL', true, CURRENT_TIMESTAMP),
(4, 6, 'signatures/sports_teacher_signature_001.png', '2024-04-05', 'SPORTS_TEACHER', true, CURRENT_TIMESTAMP),
(5, 7, 'signatures/principal_signature_005.png', '2024-03-25', 'PRINCIPAL', true, CURRENT_TIMESTAMP),
(6, 7, 'signatures/principal_signature_006.png', '2024-04-15', 'PRINCIPAL', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;