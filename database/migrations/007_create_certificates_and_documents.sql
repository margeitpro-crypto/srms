-- Migration 007: Create Certificates and Document Management
-- Description: Creates comprehensive certificate and document management system

-- Create enum for certificate type
CREATE TYPE certificate_type AS ENUM ('MARKSHEET', 'TRANSFER_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'BIRTH_CERTIFICATE', 'MIGRATION_CERTIFICATE', 'COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'CUSTOM');

-- Create enum for certificate_status
CREATE TYPE certificate_status AS ENUM ('PENDING', 'PROCESSING', 'APPROVED', 'ISSUED', 'CANCELLED', 'EXPIRED');

-- Create enum for document_type
CREATE TYPE document_type AS ENUM ('CERTIFICATE', 'REPORT_CARD', 'LEAVING_CERTIFICATE', 'BONAFIDE_CERTIFICATE', 'FEE_RECEIPT', 'OTHER');

-- Create certificate_templates table
CREATE TABLE certificate_templates (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    certificate_type certificate_type NOT NULL,
    template_html TEXT,
    template_css TEXT,
    template_variables JSONB,
    header_image VARCHAR(500),
    footer_image VARCHAR(500),
    watermark_image VARCHAR(500),
    signature_required BOOLEAN DEFAULT TRUE,
    principal_signature_required BOOLEAN DEFAULT TRUE,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for certificate_templates
CREATE INDEX idx_certificate_templates_school_id ON certificate_templates(school_id);
CREATE INDEX idx_certificate_templates_certificate_type ON certificate_templates(certificate_type);
CREATE INDEX idx_certificate_templates_is_default ON certificate_templates(is_default);
CREATE INDEX idx_certificate_templates_is_active ON certificate_templates(is_active);
CREATE INDEX idx_certificate_templates_deleted_at ON certificate_templates(deleted_at);

-- Create certificates table
CREATE TABLE certificates (
    id SERIAL PRIMARY KEY,
    certificate_number VARCHAR(50) UNIQUE NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    certificate_template_id INTEGER REFERENCES certificate_templates(id) ON DELETE SET NULL,
    certificate_type certificate_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE,
    verification_code VARCHAR(100) UNIQUE,
    certificate_status certificate_status NOT NULL DEFAULT 'PENDING',
    certificate_data JSONB,
    pdf_path VARCHAR(500),
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMP,
    issued_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for certificates
CREATE UNIQUE INDEX idx_certificates_certificate_number ON certificates(certificate_number);
CREATE UNIQUE INDEX idx_certificates_verification_code ON certificates(verification_code);
CREATE INDEX idx_certificates_school_id ON certificates(school_id);
CREATE INDEX idx_certificates_student_id ON certificates(student_id);
CREATE INDEX idx_certificates_academic_year_id ON certificates(academic_year_id);
CREATE INDEX idx_certificates_certificate_type ON certificates(certificate_type);
CREATE INDEX idx_certificates_certificate_status ON certificates(certificate_status);
CREATE INDEX idx_certificates_issue_date ON certificates(issue_date);
CREATE INDEX idx_certificates_deleted_at ON certificates(deleted_at);

-- Create certificate_requests table
CREATE TABLE certificate_requests (
    id SERIAL PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    certificate_type certificate_type NOT NULL,
    certificate_template_id INTEGER REFERENCES certificate_templates(id) ON DELETE SET NULL,
    request_date DATE NOT NULL DEFAULT CURRENT_DATE,
    required_date DATE,
    purpose TEXT,
    request_status certificate_status NOT NULL DEFAULT 'PENDING',
    request_data JSONB,
    supporting_documents JSONB,
    requested_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    processed_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    processed_at TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for certificate_requests
CREATE UNIQUE INDEX idx_certificate_requests_request_number ON certificate_requests(request_number);
CREATE INDEX idx_certificate_requests_student_id ON certificate_requests(student_id);
CREATE INDEX idx_certificate_requests_school_id ON certificate_requests(school_id);
CREATE INDEX idx_certificate_requests_academic_year_id ON certificate_requests(academic_year_id);
CREATE INDEX idx_certificate_requests_certificate_type ON certificate_requests(certificate_type);
CREATE INDEX idx_certificate_requests_request_status ON certificate_requests(request_status);
CREATE INDEX idx_certificate_requests_request_date ON certificate_requests(request_date);

-- Create documents table
CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    mime_type VARCHAR(100),
    description TEXT,
    tags JSONB,
    is_public BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    expiry_date DATE,
    uploaded_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for documents
CREATE INDEX idx_documents_school_id ON documents(school_id);
CREATE INDEX idx_documents_student_id ON documents(student_id);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_document_type ON documents(document_type);
CREATE INDEX idx_documents_is_public ON documents(is_public);
CREATE INDEX idx_documents_expiry_date ON documents(expiry_date);
CREATE INDEX idx_documents_deleted_at ON documents(deleted_at);

-- Create document_categories table
CREATE TABLE document_categories (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, name)
);

-- Create indexes for document_categories
CREATE INDEX idx_document_categories_school_id ON document_categories(school_id);
CREATE INDEX idx_document_categories_is_active ON document_categories(is_active);

-- Create document_category_assignments table
CREATE TABLE document_category_assignments (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES document_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(document_id, category_id)
);

-- Create indexes for document_category_assignments
CREATE INDEX idx_document_category_assignments_document_id ON document_category_assignments(document_id);
CREATE INDEX idx_document_category_assignments_category_id ON document_category_assignments(category_id);

-- Create certificate_signatures table
CREATE TABLE certificate_signatures (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    certificate_id INTEGER REFERENCES certificates(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    signature_type VARCHAR(50) NOT NULL,
    signature_image VARCHAR(500),
    signature_text VARCHAR(255),
    position_x INTEGER,
    position_y INTEGER,
    width INTEGER,
    height INTEGER,
    page_number INTEGER DEFAULT 1,
    is_required BOOLEAN DEFAULT TRUE,
    is_digital BOOLEAN DEFAULT FALSE,
    signed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for certificate_signatures
CREATE INDEX idx_certificate_signatures_school_id ON certificate_signatures(school_id);
CREATE INDEX idx_certificate_signatures_certificate_id ON certificate_signatures(certificate_id);
CREATE INDEX idx_certificate_signatures_user_id ON certificate_signatures(user_id);
CREATE INDEX idx_certificate_signatures_signature_type ON certificate_signatures(signature_type);