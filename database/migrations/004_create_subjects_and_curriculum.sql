-- Migration 004: Create Subjects and Curriculum Management
-- Description: Creates comprehensive subject and curriculum management system

-- Create enum for subject type
CREATE TYPE subject_type AS ENUM ('THEORY', 'PRACTICAL', 'BOTH');

-- Create enum for subject status
CREATE TYPE subject_status AS ENUM ('ACTIVE', 'INACTIVE', 'DRAFT');

-- Create subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    subject_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    subject_type subject_type NOT NULL DEFAULT 'THEORY',
    credits INTEGER DEFAULT 1,
    max_marks INTEGER DEFAULT 100,
    pass_marks INTEGER DEFAULT 40,
    practical_marks INTEGER DEFAULT 0,
    theory_marks INTEGER DEFAULT 100,
    is_compulsory BOOLEAN DEFAULT TRUE,
    status subject_status NOT NULL DEFAULT 'ACTIVE',
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(school_id, subject_code)
);

-- Create indexes for subjects
CREATE INDEX idx_subjects_school_id ON subjects(school_id);
CREATE INDEX idx_subjects_subject_code ON subjects(subject_code);
CREATE INDEX idx_subjects_name ON subjects(name);
CREATE INDEX idx_subjects_status ON subjects(status);
CREATE INDEX idx_subjects_deleted_at ON subjects(deleted_at);

-- Create subject_categories table
CREATE TABLE subject_categories (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, name)
);

-- Create indexes for subject_categories
CREATE INDEX idx_subject_categories_school_id ON subject_categories(school_id);
CREATE INDEX idx_subject_categories_is_active ON subject_categories(is_active);

-- Create subject_category_assignments table
CREATE TABLE subject_category_assignments (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES subject_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, category_id)
);

-- Create indexes for subject_category_assignments
CREATE INDEX idx_subject_category_assignments_subject_id ON subject_category_assignments(subject_id);
CREATE INDEX idx_subject_category_assignments_category_id ON subject_category_assignments(category_id);

-- Create class_subjects table (curriculum mapping)
CREATE TABLE class_subjects (
    id SERIAL PRIMARY KEY,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    max_marks INTEGER DEFAULT 100,
    pass_marks INTEGER DEFAULT 40,
    practical_marks INTEGER DEFAULT 0,
    theory_marks INTEGER DEFAULT 100,
    is_compulsory BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, subject_id, academic_year_id)
);

-- Create indexes for class_subjects
CREATE INDEX idx_class_subjects_class_id ON class_subjects(class_id);
CREATE INDEX idx_class_subjects_subject_id ON class_subjects(subject_id);
CREATE INDEX idx_class_subjects_academic_year_id ON class_subjects(academic_year_id);
CREATE INDEX idx_class_subjects_teacher_id ON class_subjects(teacher_id);
CREATE INDEX idx_class_subjects_is_compulsory ON class_subjects(is_compulsory);

-- Create subject_prerequisites table
CREATE TABLE subject_prerequisites (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    prerequisite_subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    minimum_grade VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, prerequisite_subject_id)
);

-- Create indexes for subject_prerequisites
CREATE INDEX idx_subject_prerequisites_subject_id ON subject_prerequisites(subject_id);
CREATE INDEX idx_subject_prerequisites_prerequisite_subject_id ON subject_prerequisites(prerequisite_subject_id);

-- Create subject_resources table
CREATE TABLE subject_resources (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    file_size INTEGER,
    file_type VARCHAR(100),
    external_url VARCHAR(500),
    is_public BOOLEAN DEFAULT FALSE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for subject_resources
CREATE INDEX idx_subject_resources_subject_id ON subject_resources(subject_id);
CREATE INDEX idx_subject_resources_resource_type ON subject_resources(resource_type);
CREATE INDEX idx_subject_resources_is_public ON subject_resources(is_public);

-- Create subject_textbooks table
CREATE TABLE subject_textbooks (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    isbn VARCHAR(50),
    edition VARCHAR(50),
    publication_year INTEGER,
    description TEXT,
    cover_image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for subject_textbooks
CREATE INDEX idx_subject_textbooks_subject_id ON subject_textbooks(subject_id);
CREATE INDEX idx_subject_textbooks_is_active ON subject_textbooks(is_active);

-- Create subject_lessons table
CREATE TABLE subject_lessons (
    id SERIAL PRIMARY KEY,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_subject_id INTEGER REFERENCES class_subjects(id) ON DELETE CASCADE,
    lesson_number INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    learning_objectives TEXT,
    materials_required TEXT,
    assessment_methods TEXT,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subject_id, lesson_number)
);

-- Create indexes for subject_lessons
CREATE INDEX idx_subject_lessons_subject_id ON subject_lessons(subject_id);
CREATE INDEX idx_subject_lessons_class_subject_id ON subject_lessons(class_subject_id);
CREATE INDEX idx_subject_lessons_lesson_number ON subject_lessons(lesson_number);