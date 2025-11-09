-- Migration 003: Create Students and Student Management
-- Description: Creates comprehensive student management system

-- Create enum for student status
CREATE TYPE student_status AS ENUM ('ACTIVE', 'INACTIVE', 'GRADUATED', 'TRANSFERRED', 'SUSPENDED', 'DROPPED');

-- Create enum for gender
CREATE TYPE gender AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- Create enum for blood group
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN');

-- Create students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    date_of_birth DATE,
    gender gender,
    blood_group blood_group,
    nationality VARCHAR(50) DEFAULT 'Nepali',
    religion VARCHAR(50),
    caste VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    permanent_address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    father_name VARCHAR(255),
    father_phone VARCHAR(20),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(255),
    mother_phone VARCHAR(20),
    mother_occupation VARCHAR(100),
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_occupation VARCHAR(100),
    guardian_relation VARCHAR(50),
    photo_url VARCHAR(500),
    status student_status NOT NULL DEFAULT 'ACTIVE',
    admission_date DATE,
    admission_number VARCHAR(50),
    roll_number VARCHAR(20),
    previous_school VARCHAR(255),
    remarks TEXT,
    is_transport_required BOOLEAN DEFAULT FALSE,
    is_hostel_required BOOLEAN DEFAULT FALSE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for students
CREATE UNIQUE INDEX idx_students_student_id ON students(student_id);
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_first_name ON students(first_name);
CREATE INDEX idx_students_last_name ON students(last_name);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_deleted_at ON students(deleted_at);

-- Create student_enrollments table
CREATE TABLE student_enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE SET NULL,
    roll_number VARCHAR(20),
    enrollment_date DATE NOT NULL,
    status student_status NOT NULL DEFAULT 'ACTIVE',
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, academic_year_id)
);

-- Create indexes for student_enrollments
CREATE INDEX idx_student_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX idx_student_enrollments_academic_year_id ON student_enrollments(academic_year_id);
CREATE INDEX idx_student_enrollments_class_id ON student_enrollments(class_id);
CREATE INDEX idx_student_enrollments_section_id ON student_enrollments(section_id);
CREATE INDEX idx_student_enrollments_status ON student_enrollments(status);

-- Create student_documents table
CREATE TABLE student_documents (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    description TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMP,
    uploaded_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for student_documents
CREATE INDEX idx_student_documents_student_id ON student_documents(student_id);
CREATE INDEX idx_student_documents_document_type ON student_documents(document_type);
CREATE INDEX idx_student_documents_is_verified ON student_documents(is_verified);

-- Create student_categories table
CREATE TABLE student_categories (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, name)
);

-- Create indexes for student_categories
CREATE INDEX idx_student_categories_school_id ON student_categories(school_id);
CREATE INDEX idx_student_categories_is_active ON student_categories(is_active);

-- Create student_category_assignments table
CREATE TABLE student_category_assignments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES student_categories(id) ON DELETE CASCADE,
    assigned_date DATE NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, category_id)
);

-- Create indexes for student_category_assignments
CREATE INDEX idx_student_category_assignments_student_id ON student_category_assignments(student_id);
CREATE INDEX idx_student_category_assignments_category_id ON student_category_assignments(category_id);

-- Create student_attendance table
CREATE TABLE student_attendance (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE SET NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    remarks TEXT,
    marked_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, attendance_date)
);

-- Create indexes for student_attendance
CREATE INDEX idx_student_attendance_student_id ON student_attendance(student_id);
CREATE INDEX idx_student_attendance_academic_year_id ON student_attendance(academic_year_id);
CREATE INDEX idx_student_attendance_class_id ON student_attendance(class_id);
CREATE INDEX idx_student_attendance_attendance_date ON student_attendance(attendance_date);
CREATE INDEX idx_student_attendance_status ON student_attendance(status);