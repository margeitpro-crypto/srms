-- Migration 002: Create Schools and Academic Structure
-- Description: Creates school management and academic structure tables

-- Create enum for school status
CREATE TYPE school_status AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING');

-- Create schools table
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    principal_name VARCHAR(255),
    established_year INTEGER,
    school_type VARCHAR(50),
    board VARCHAR(100),
    status school_status NOT NULL DEFAULT 'PENDING',
    logo_url VARCHAR(500),
    description TEXT,
    settings JSONB,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for schools
CREATE UNIQUE INDEX idx_schools_code ON schools(code);
CREATE INDEX idx_schools_name ON schools(name);
CREATE INDEX idx_schools_status ON schools(status);
CREATE INDEX idx_schools_deleted_at ON schools(deleted_at);

-- Create districts table
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    province VARCHAR(100),
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for districts
CREATE UNIQUE INDEX idx_districts_code ON districts(code);
CREATE INDEX idx_districts_name ON districts(name);

-- Insert districts data for Nepal
INSERT INTO districts (name, code, province) VALUES
('Kathmandu', 'KTM', 'Bagmati Province'),
('Bhaktapur', 'BKT', 'Bagmati Province'),
('Lalitpur', 'LTP', 'Bagmati Province'),
('Pokhara', 'PKR', 'Gandaki Province'),
('Dharan', 'DHN', 'Koshi Province'),
('Biratnagar', 'BRT', 'Koshi Province'),
('Birgunj', 'BRG', 'Madhesh Province'),
('Janakpur', 'JNP', 'Madhesh Province'),
('Nepalgunj', 'NGJ', 'Lumbini Province'),
('Butwal', 'BTW', 'Lumbini Province');

-- Create school_districts junction table
CREATE TABLE school_districts (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    district_id INTEGER NOT NULL REFERENCES districts(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, district_id)
);

-- Create indexes for school_districts
CREATE INDEX idx_school_districts_school_id ON school_districts(school_id);
CREATE INDEX idx_school_districts_district_id ON school_districts(district_id);

-- Create academic_years table
CREATE TABLE academic_years (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, name)
);

-- Create indexes for academic_years
CREATE INDEX idx_academic_years_school_id ON academic_years(school_id);
CREATE INDEX idx_academic_years_is_current ON academic_years(is_current);
CREATE INDEX idx_academic_years_is_active ON academic_years(is_active);

-- Create classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    grade_level INTEGER,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(school_id, name)
);

-- Create indexes for classes
CREATE INDEX idx_classes_school_id ON classes(school_id);
CREATE INDEX idx_classes_grade_level ON classes(grade_level);
CREATE INDEX idx_classes_is_active ON classes(is_active);
CREATE INDEX idx_classes_deleted_at ON classes(deleted_at);

-- Create sections table
CREATE TABLE sections (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    capacity INTEGER DEFAULT 40,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(class_id, name)
);

-- Create indexes for sections
CREATE INDEX idx_sections_class_id ON sections(class_id);
CREATE INDEX idx_sections_name ON sections(name);
CREATE INDEX idx_sections_is_active ON sections(is_active);
CREATE INDEX idx_sections_deleted_at ON sections(deleted_at);

-- Create school_settings table
CREATE TABLE school_settings (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    key VARCHAR(255) NOT NULL,
    value TEXT,
    type VARCHAR(50) DEFAULT 'string',
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, key)
);

-- Create indexes for school_settings
CREATE INDEX idx_school_settings_school_id ON school_settings(school_id);
CREATE INDEX idx_school_settings_key ON school_settings(key);