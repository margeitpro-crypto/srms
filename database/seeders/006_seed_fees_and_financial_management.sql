-- Seeder 006: Seed Fees and Financial Management
-- Description: Seeds fee categories, fee structures, invoices, payments, and financial data

-- Insert fee categories
INSERT INTO fee_categories (school_id, name, description, is_active, created_at) VALUES
-- School 1 fee categories
(1, 'Tuition Fee', 'Monthly tuition fee for regular classes', true, CURRENT_TIMESTAMP),
(1, 'Examination Fee', 'Fee for conducting examinations', true, CURRENT_TIMESTAMP),
(1, 'Library Fee', 'Annual library maintenance and book fee', true, CURRENT_TIMESTAMP),
(1, 'Laboratory Fee', 'Science laboratory maintenance fee', true, CURRENT_TIMESTAMP),
(1, 'Sports Fee', 'Annual sports and physical education fee', true, CURRENT_TIMESTAMP),
(1, 'Computer Lab Fee', 'Computer laboratory maintenance fee', true, CURRENT_TIMESTAMP),
(1, 'Transportation Fee', 'Monthly school bus transportation fee', true, CURRENT_TIMESTAMP),
(1, 'Hostel Fee', 'Monthly hostel accommodation fee', true, CURRENT_TIMESTAMP),
(1, 'Development Fee', 'Annual school development fee', true, CURRENT_TIMESTAMP),
(1, 'Miscellaneous Fee', 'Other miscellaneous charges', true, CURRENT_TIMESTAMP),

-- School 2 fee categories
(2, 'Tuition Fee', 'Monthly tuition fee for regular classes', true, CURRENT_TIMESTAMP),
(2, 'Examination Fee', 'Fee for conducting examinations', true, CURRENT_TIMESTAMP),
(2, 'Library Fee', 'Annual library maintenance and book fee', true, CURRENT_TIMESTAMP),
(2, 'Laboratory Fee', 'Science laboratory maintenance fee', true, CURRENT_TIMESTAMP),
(2, 'Sports Fee', 'Annual sports and physical education fee', true, CURRENT_TIMESTAMP),
(2, 'Computer Lab Fee', 'Computer laboratory maintenance fee', true, CURRENT_TIMESTAMP),
(2, 'Transportation Fee', 'Monthly school bus transportation fee', true, CURRENT_TIMESTAMP),
(2, 'Development Fee', 'Annual school development fee', true, CURRENT_TIMESTAMP),
(2, 'Miscellaneous Fee', 'Other miscellaneous charges', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert fee structures
INSERT INTO fee_structures (school_id, fee_category_id, class_id, amount, fee_type, fee_frequency, academic_year_id, is_active, created_at) VALUES
-- School 1 Grade 5 fee structures
(1, 1, 5, 1500, 'REGULAR', 'MONTHLY', 1, true, CURRENT_TIMESTAMP), -- Tuition Fee Grade 5
(1, 2, 5, 200, 'REGULAR', 'PER_EXAM', 1, true, CURRENT_TIMESTAMP), -- Examination Fee Grade 5
(1, 3, 5, 500, 'REGULAR', 'ANNUAL', 1, true, CURRENT_TIMESTAMP), -- Library Fee Grade 5
(1, 4, 5, 300, 'REGULAR', 'ANNUAL', 1, true, CURRENT_TIMESTAMP), -- Laboratory Fee Grade 5
(1, 5, 5, 400, 'REGULAR', 'ANNUAL', 1, true, CURRENT_TIMESTAMP), -- Sports Fee Grade 5
(1, 6, 5, 250, 'REGULAR', 'ANNUAL', 1, true, CURRENT_TIMESTAMP), -- Computer Lab Fee Grade 5
(1, 9, 5, 1000, 'REGULAR', 'ANNUAL', 1, true, CURRENT_TIMESTAMP), -- Development Fee Grade 5
(1, 10, 5, 100, 'REGULAR', 'MONTHLY', 1, true, CURRENT_TIMESTAMP), -- Miscellaneous Fee Grade 5

-- School 2 Class 5 fee structures
(2, 11, 16, 1800, 'REGULAR', 'MONTHLY', 4, true, CURRENT_TIMESTAMP), -- Tuition Fee Class 5
(2, 12, 16, 250, 'REGULAR', 'PER_EXAM', 4, true, CURRENT_TIMESTAMP), -- Examination Fee Class 5
(2, 13, 16, 600, 'REGULAR', 'ANNUAL', 4, true, CURRENT_TIMESTAMP), -- Library Fee Class 5
(2, 14, 16, 350, 'REGULAR', 'ANNUAL', 4, true, CURRENT_TIMESTAMP), -- Laboratory Fee Class 5
(2, 15, 16, 450, 'REGULAR', 'ANNUAL', 4, true, CURRENT_TIMESTAMP), -- Sports Fee Class 5
(2, 16, 16, 300, 'REGULAR', 'ANNUAL', 4, true, CURRENT_TIMESTAMP), -- Computer Lab Fee Class 5
(2, 18, 16, 1200, 'REGULAR', 'ANNUAL', 4, true, CURRENT_TIMESTAMP), -- Development Fee Class 5
(2, 19, 16, 150, 'REGULAR', 'MONTHLY', 4, true, CURRENT_TIMESTAMP) -- Miscellaneous Fee Class 5
ON CONFLICT DO NOTHING;

-- Insert student fees
INSERT INTO student_fees (student_id, fee_structure_id, amount, due_date, academic_year_id, is_paid, created_at) VALUES
-- Student 1 fees (School 1)
(1, 1, 1500, '2024-01-31', 1, true, CURRENT_TIMESTAMP), -- January Tuition Fee
(1, 1, 1500, '2024-02-29', 1, true, CURRENT_TIMESTAMP), -- February Tuition Fee
(1, 1, 1500, '2024-03-31', 1, true, CURRENT_TIMESTAMP), -- March Tuition Fee
(1, 2, 200, '2024-03-15', 1, true, CURRENT_TIMESTAMP), -- First Terminal Exam Fee
(1, 3, 500, '2024-04-30', 1, true, CURRENT_TIMESTAMP), -- Annual Library Fee
(1, 4, 300, '2024-05-31', 1, true, CURRENT_TIMESTAMP), -- Annual Laboratory Fee
(1, 5, 400, '2024-06-30', 1, true, CURRENT_TIMESTAMP), -- Annual Sports Fee

-- Student 2 fees (School 1)
(2, 1, 1500, '2024-01-31', 1, true, CURRENT_TIMESTAMP), -- January Tuition Fee
(2, 1, 1500, '2024-02-29', 1, true, CURRENT_TIMESTAMP), -- February Tuition Fee
(2, 1, 1500, '2024-03-31', 1, false, CURRENT_TIMESTAMP), -- March Tuition Fee (unpaid)
(2, 2, 200, '2024-03-15', 1, true, CURRENT_TIMESTAMP), -- First Terminal Exam Fee
(2, 3, 500, '2024-04-30', 1, false, CURRENT_TIMESTAMP), -- Annual Library Fee (unpaid)

-- Student 3 fees (School 2)
(3, 9, 1800, '2024-01-31', 4, true, CURRENT_TIMESTAMP), -- January Tuition Fee
(3, 9, 1800, '2024-02-29', 4, true, CURRENT_TIMESTAMP), -- February Tuition Fee
(3, 9, 1800, '2024-03-31', 4, true, CURRENT_TIMESTAMP), -- March Tuition Fee
(3, 10, 250, '2024-03-15', 4, true, CURRENT_TIMESTAMP), -- First Terminal Exam Fee
(3, 11, 600, '2024-04-30', 4, true, CURRENT_TIMESTAMP), -- Annual Library Fee
(3, 12, 350, '2024-05-31', 4, true, CURRENT_TIMESTAMP), -- Annual Laboratory Fee
(3, 13, 450, '2024-06-30', 4, true, CURRENT_TIMESTAMP), -- Annual Sports Fee
(3, 14, 300, '2024-07-31', 4, true, CURRENT_TIMESTAMP) -- Annual Computer Lab Fee
ON CONFLICT DO NOTHING;

-- Insert fee invoices
INSERT INTO fee_invoices (student_id, invoice_number, total_amount, discount_amount, tax_amount, net_amount, due_date, status, created_at) VALUES
(1, 'INV-2024-001', 4500, 0, 0, 4500, '2024-03-31', 'PAID', CURRENT_TIMESTAMP), -- Student 1 Q1 Invoice
(2, 'INV-2024-002', 3200, 0, 0, 3200, '2024-03-31', 'PARTIALLY_PAID', CURRENT_TIMESTAMP), -- Student 2 Q1 Invoice
(3, 'INV-2024-003', 5800, 0, 0, 5800, '2024-03-31', 'PAID', CURRENT_TIMESTAMP) -- Student 3 Q1 Invoice
ON CONFLICT DO NOTHING;

-- Insert fee invoice items
INSERT INTO fee_invoice_items (invoice_id, fee_structure_id, amount, created_at) VALUES
(1, 1, 4500, CURRENT_TIMESTAMP), -- Student 1 Tuition fees for 3 months
(2, 1, 3000, CURRENT_TIMESTAMP), -- Student 2 Tuition fees for 2 months
(2, 2, 200, CURRENT_TIMESTAMP), -- Student 2 Exam fee
(3, 9, 5400, CURRENT_TIMESTAMP), -- Student 3 Tuition fees for 3 months
(3, 10, 250, CURRENT_TIMESTAMP), -- Student 3 Exam fee
(3, 11, 150, CURRENT_TIMESTAMP) -- Student 3 Partial library fee
ON CONFLICT DO NOTHING;

-- Insert fee payments
INSERT INTO fee_payments (student_id, invoice_id, amount, payment_date, payment_method, transaction_id, status, created_at) VALUES
(1, 1, 4500, '2024-03-15', 'CASH', 'TXN-001-2024', 'COMPLETED', CURRENT_TIMESTAMP), -- Student 1 payment
(2, 2, 1700, '2024-03-20', 'BANK_TRANSFER', 'TXN-002-2024', 'COMPLETED', CURRENT_TIMESTAMP), -- Student 2 partial payment
(3, 3, 5800, '2024-03-10', 'ONLINE', 'TXN-003-2024', 'COMPLETED', CURRENT_TIMESTAMP) -- Student 3 payment
ON CONFLICT DO NOTHING;

-- Insert fee discounts
INSERT INTO fee_discounts (school_id, fee_category_id, name, description, discount_type, discount_value, min_amount, max_amount, valid_from, valid_until, is_active, created_at) VALUES
-- School 1 discounts
(1, 1, 'Sibling Discount', 'Discount for students with siblings in the same school', 'PERCENTAGE', 10, 0, 1000, '2024-01-01', '2024-12-31', true, CURRENT_TIMESTAMP),
(1, 1, 'Early Payment Discount', 'Discount for early payment of annual fees', 'PERCENTAGE', 5, 0, 500, '2024-01-01', '2024-12-31', true, CURRENT_TIMESTAMP),
(1, 1, 'Merit Scholarship', 'Scholarship for academically excellent students', 'FIXED_AMOUNT', 500, 0, 2000, '2024-01-01', '2024-12-31', true, CURRENT_TIMESTAMP),

-- School 2 discounts
(2, 11, 'Staff Child Discount', 'Discount for children of school staff', 'PERCENTAGE', 25, 0, 2000, '2024-01-01', '2024-12-31', true, CURRENT_TIMESTAMP),
(2, 11, 'Bulk Payment Discount', 'Discount for paying full year fees in advance', 'PERCENTAGE', 8, 0, 1500, '2024-01-01', '2024-12-31', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;

-- Insert fee waivers
INSERT INTO fee_waivers (student_id, fee_category_id, waiver_type, waiver_reason, waiver_amount, waiver_percentage, approved_by, approved_date, valid_from, valid_until, is_active, created_at) VALUES
-- Student 1 fee waiver
(1, 1, 'PARTIAL_WAIVER', 'Financial hardship', 300, 20, 4, '2024-01-15', '2024-01-01', '2024-12-31', true, CURRENT_TIMESTAMP),

-- Student 2 fee waiver
(2, 3, 'FULL_WAIVER', 'Orphan student support', 500, 100, 4, '2024-02-01', '2024-01-01', '2024-12-31', true, CURRENT_TIMESTAMP),

-- Student 3 fee waiver
(3, 12, 'PARTIAL_WAIVER', 'Single parent family', 150, 43, 7, '2024-01-10', '2024-01-01', '2024-12-31', true, CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;