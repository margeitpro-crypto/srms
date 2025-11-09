-- Migration 006: Create Fees and Financial Management
-- Description: Creates comprehensive fee structure and financial management system

-- Create enum for fee type
CREATE TYPE fee_type AS ENUM ('ADMISSION_FEE', 'TUITION_FEE', 'EXAM_FEE', 'TRANSPORT_FEE', 'HOSTEL_FEE', 'LIBRARY_FEE', 'LAB_FEE', 'SPORTS_FEE', 'MISCELLANEOUS', 'CERTIFICATE_FEE', 'PROCESSING_FEE');

-- Create enum for fee_frequency
CREATE TYPE fee_frequency AS ENUM ('ONE_TIME', 'MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'YEARLY');

-- Create enum for payment_status
CREATE TYPE payment_status AS ENUM ('PENDING', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED');

-- Create enum for payment_method
CREATE TYPE payment_method AS ENUM ('CASH', 'BANK_TRANSFER', 'CHEQUE', 'ONLINE', 'MOBILE_WALLET', 'CARD');

-- Create fee_categories table
CREATE TABLE fee_categories (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    fee_type fee_type NOT NULL,
    fee_frequency fee_frequency NOT NULL DEFAULT 'YEARLY',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, name)
);

-- Create indexes for fee_categories
CREATE INDEX idx_fee_categories_school_id ON fee_categories(school_id);
CREATE INDEX idx_fee_categories_fee_type ON fee_categories(fee_type);
CREATE INDEX idx_fee_categories_is_active ON fee_categories(is_active);

-- Create fee_structures table
CREATE TABLE fee_structures (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    fee_category_id INTEGER NOT NULL REFERENCES fee_categories(id) ON DELETE CASCADE,
    class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NPR',
    due_date DATE,
    late_fee_amount NUMERIC(10,2) DEFAULT 0,
    late_fee_per_day NUMERIC(10,2) DEFAULT 0,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from DATE NOT NULL,
    valid_until DATE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for fee_structures
CREATE INDEX idx_fee_structures_school_id ON fee_structures(school_id);
CREATE INDEX idx_fee_structures_academic_year_id ON fee_structures(academic_year_id);
CREATE INDEX idx_fee_structures_fee_category_id ON fee_structures(fee_category_id);
CREATE INDEX idx_fee_structures_class_id ON fee_structures(class_id);
CREATE INDEX idx_fee_structures_is_active ON fee_structures(is_active);
CREATE INDEX idx_fee_structures_valid_from ON fee_structures(valid_from);
CREATE INDEX idx_fee_structures_deleted_at ON fee_structures(deleted_at);

-- Create student_fees table
CREATE TABLE student_fees (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id INTEGER NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    net_amount NUMERIC(10,2) GENERATED ALWAYS AS (amount - discount_amount) STORED,
    paid_amount NUMERIC(10,2) DEFAULT 0,
    balance_amount NUMERIC(10,2) GENERATED ALWAYS AS (net_amount - paid_amount) STORED,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    due_date DATE,
    paid_date DATE,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for student_fees
CREATE INDEX idx_student_fees_student_id ON student_fees(student_id);
CREATE INDEX idx_student_fees_fee_structure_id ON student_fees(fee_structure_id);
CREATE INDEX idx_student_fees_academic_year_id ON student_fees(academic_year_id);
CREATE INDEX idx_student_fees_class_id ON student_fees(class_id);
CREATE INDEX idx_student_fees_payment_status ON student_fees(payment_status);
CREATE INDEX idx_student_fees_due_date ON student_fees(due_date);

-- Create fee_invoices table
CREATE TABLE fee_invoices (
    id SERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    total_amount NUMERIC(10,2) NOT NULL,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    net_amount NUMERIC(10,2) NOT NULL,
    paid_amount NUMERIC(10,2) DEFAULT 0,
    balance_amount NUMERIC(10,2) GENERATED ALWAYS AS (net_amount - paid_amount) STORED,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    due_date DATE,
    issue_date DATE DEFAULT CURRENT_DATE,
    paid_date DATE,
    remarks TEXT,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for fee_invoices
CREATE UNIQUE INDEX idx_fee_invoices_invoice_number ON fee_invoices(invoice_number);
CREATE INDEX idx_fee_invoices_student_id ON fee_invoices(student_id);
CREATE INDEX idx_fee_invoices_academic_year_id ON fee_invoices(academic_year_id);
CREATE INDEX idx_fee_invoices_class_id ON fee_invoices(class_id);
CREATE INDEX idx_fee_invoices_payment_status ON fee_invoices(payment_status);
CREATE INDEX idx_fee_invoices_due_date ON fee_invoices(due_date);
CREATE INDEX idx_fee_invoices_deleted_at ON fee_invoices(deleted_at);

-- Create fee_invoice_items table
CREATE TABLE fee_invoice_items (
    id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES fee_invoices(id) ON DELETE CASCADE,
    fee_structure_id INTEGER NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    discount_percentage NUMERIC(5,2) DEFAULT 0,
    discount_amount NUMERIC(10,2) DEFAULT 0,
    net_amount NUMERIC(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fee_invoice_items
CREATE INDEX idx_fee_invoice_items_invoice_id ON fee_invoice_items(invoice_id);
CREATE INDEX idx_fee_invoice_items_fee_structure_id ON fee_invoice_items(fee_structure_id);

-- Create fee_payments table
CREATE TABLE fee_payments (
    id SERIAL PRIMARY KEY,
    payment_reference VARCHAR(50) UNIQUE NOT NULL,
    invoice_id INTEGER REFERENCES fee_invoices(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NPR',
    payment_method payment_method NOT NULL,
    payment_status payment_status NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    gateway_reference VARCHAR(100),
    payment_date DATE,
    remarks TEXT,
    processed_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for fee_payments
CREATE UNIQUE INDEX idx_fee_payments_payment_reference ON fee_payments(payment_reference);
CREATE INDEX idx_fee_payments_invoice_id ON fee_payments(invoice_id);
CREATE INDEX idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_payment_method ON fee_payments(payment_method);
CREATE INDEX idx_fee_payments_payment_status ON fee_payments(payment_status);
CREATE INDEX idx_fee_payments_payment_date ON fee_payments(payment_date);
CREATE INDEX idx_fee_payments_deleted_at ON fee_payments(deleted_at);

-- Create fee_discounts table
CREATE TABLE fee_discounts (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type VARCHAR(50) NOT NULL,
    discount_value NUMERIC(10,2) NOT NULL,
    applicable_categories VARCHAR(255),
    minimum_amount NUMERIC(10,2) DEFAULT 0,
    maximum_discount NUMERIC(10,2),
    valid_from DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fee_discounts
CREATE INDEX idx_fee_discounts_school_id ON fee_discounts(school_id);
CREATE INDEX idx_fee_discounts_discount_type ON fee_discounts(discount_type);
CREATE INDEX idx_fee_discounts_is_active ON fee_discounts(is_active);
CREATE INDEX idx_fee_discounts_valid_from ON fee_discounts(valid_from);
CREATE INDEX idx_fee_discounts_valid_until ON fee_discounts(valid_until);

-- Create fee_waivers table
CREATE TABLE fee_waivers (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id INTEGER NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    waiver_type VARCHAR(50) NOT NULL,
    waiver_percentage NUMERIC(5,2) DEFAULT 0,
    waiver_amount NUMERIC(10,2) DEFAULT 0,
    reason TEXT,
    approved_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    valid_from DATE,
    valid_until DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fee_waivers
CREATE INDEX idx_fee_waivers_student_id ON fee_waivers(student_id);
CREATE INDEX idx_fee_waivers_fee_structure_id ON fee_waivers(fee_structure_id);
CREATE INDEX idx_fee_waivers_waiver_type ON fee_waivers(waiver_type);
CREATE INDEX idx_fee_waivers_is_active ON fee_waivers(is_active);