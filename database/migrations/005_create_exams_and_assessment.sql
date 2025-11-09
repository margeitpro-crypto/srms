-- Migration 005: Create Exams and Assessment System
-- Description: Creates comprehensive exam and assessment management system

-- Create enum for exam type
CREATE TYPE exam_type AS ENUM ('UNIT_TEST', 'MIDTERM', 'FINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT', 'QUIZ');

-- Create enum for exam status
CREATE TYPE exam_status AS ENUM ('DRAFT', 'SCHEDULED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'POSTPONED');

-- Create enum for result_status
CREATE TYPE result_status AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'PUBLISHED', 'CANCELLED');

-- Create exams table
CREATE TABLE exams (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    exam_type exam_type NOT NULL DEFAULT 'FINAL',
    status exam_status NOT NULL DEFAULT 'DRAFT',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    result_publish_date DATE,
    total_marks INTEGER DEFAULT 100,
    pass_marks INTEGER DEFAULT 40,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE(school_id, code)
);

-- Create indexes for exams
CREATE INDEX idx_exams_school_id ON exams(school_id);
CREATE INDEX idx_exams_academic_year_id ON exams(academic_year_id);
CREATE INDEX idx_exams_exam_type ON exams(exam_type);
CREATE INDEX idx_exams_status ON exams(status);
CREATE INDEX idx_exams_start_date ON exams(start_date);
CREATE INDEX idx_exams_end_date ON exams(end_date);
CREATE INDEX idx_exams_is_published ON exams(is_published);
CREATE INDEX idx_exams_deleted_at ON exams(deleted_at);

-- Create exam_subjects table
CREATE TABLE exam_subjects (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    class_subject_id INTEGER REFERENCES class_subjects(id) ON DELETE SET NULL,
    exam_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER,
    max_marks INTEGER DEFAULT 100,
    pass_marks INTEGER DEFAULT 40,
    practical_marks INTEGER DEFAULT 0,
    theory_marks INTEGER DEFAULT 100,
    room_number VARCHAR(50),
    supervisor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    instructions TEXT,
    is_practical BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, subject_id)
);

-- Create indexes for exam_subjects
CREATE INDEX idx_exam_subjects_exam_id ON exam_subjects(exam_id);
CREATE INDEX idx_exam_subjects_subject_id ON exam_subjects(subject_id);
CREATE INDEX idx_exam_subjects_class_subject_id ON exam_subjects(class_subject_id);
CREATE INDEX idx_exam_subjects_exam_date ON exam_subjects(exam_date);
CREATE INDEX idx_exam_subjects_supervisor_id ON exam_subjects(supervisor_id);

-- Create exam_results table
CREATE TABLE exam_results (
    id SERIAL PRIMARY KEY,
    exam_id INTEGER NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id INTEGER REFERENCES sections(id) ON DELETE SET NULL,
    result_status result_status NOT NULL DEFAULT 'PENDING',
    total_marks_obtained NUMERIC(10,2),
    total_max_marks NUMERIC(10,2),
    percentage NUMERIC(5,2),
    grade VARCHAR(10),
    grade_point NUMERIC(3,2),
    rank INTEGER,
    remarks TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_id, student_id)
);

-- Create indexes for exam_results
CREATE INDEX idx_exam_results_exam_id ON exam_results(exam_id);
CREATE INDEX idx_exam_results_student_id ON exam_results(student_id);
CREATE INDEX idx_exam_results_academic_year_id ON exam_results(academic_year_id);
CREATE INDEX idx_exam_results_class_id ON exam_results(class_id);
CREATE INDEX idx_exam_results_section_id ON exam_results(section_id);
CREATE INDEX idx_exam_results_result_status ON exam_results(result_status);
CREATE INDEX idx_exam_results_percentage ON exam_results(percentage);
CREATE INDEX idx_exam_results_grade ON exam_results(grade);
CREATE INDEX idx_exam_results_is_published ON exam_results(is_published);

-- Create exam_subject_results table
CREATE TABLE exam_subject_results (
    id SERIAL PRIMARY KEY,
    exam_result_id INTEGER NOT NULL REFERENCES exam_results(id) ON DELETE CASCADE,
    exam_subject_id INTEGER NOT NULL REFERENCES exam_subjects(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    marks_obtained NUMERIC(10,2),
    practical_marks_obtained NUMERIC(10,2),
    theory_marks_obtained NUMERIC(10,2),
    max_marks NUMERIC(10,2),
    practical_max_marks NUMERIC(10,2),
    theory_max_marks NUMERIC(10,2),
    percentage NUMERIC(5,2),
    grade VARCHAR(10),
    grade_point NUMERIC(3,2),
    is_absent BOOLEAN DEFAULT FALSE,
    remarks TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_result_id, subject_id)
);

-- Create indexes for exam_subject_results
CREATE INDEX idx_exam_subject_results_exam_result_id ON exam_subject_results(exam_result_id);
CREATE INDEX idx_exam_subject_results_exam_subject_id ON exam_subject_results(exam_subject_id);
CREATE INDEX idx_exam_subject_results_student_id ON exam_subject_results(student_id);
CREATE INDEX idx_exam_subject_results_subject_id ON exam_subject_results(subject_id);
CREATE INDEX idx_exam_subject_results_grade ON exam_subject_results(grade);
CREATE INDEX idx_exam_subject_results_is_absent ON exam_subject_results(is_absent);

-- Create grading_schemes table
CREATE TABLE grading_schemes (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id INTEGER NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    min_percentage NUMERIC(5,2) NOT NULL,
    max_percentage NUMERIC(5,2) NOT NULL,
    grade VARCHAR(10) NOT NULL,
    grade_point NUMERIC(3,2),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, academic_year_id, grade)
);

-- Create indexes for grading_schemes
CREATE INDEX idx_grading_schemes_school_id ON grading_schemes(school_id);
CREATE INDEX idx_grading_schemes_academic_year_id ON grading_schemes(academic_year_id);
CREATE INDEX idx_grading_schemes_grade ON grading_schemes(grade);
CREATE INDEX idx_grading_schemes_is_active ON grading_schemes(is_active);

-- Create exam_attendance table
CREATE TABLE exam_attendance (
    id SERIAL PRIMARY KEY,
    exam_subject_id INTEGER NOT NULL REFERENCES exam_subjects(id) ON DELETE CASCADE,
    student_id INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
    remarks TEXT,
    marked_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(exam_subject_id, student_id, attendance_date)
);

-- Create indexes for exam_attendance
CREATE INDEX idx_exam_attendance_exam_subject_id ON exam_attendance(exam_subject_id);
CREATE INDEX idx_exam_attendance_student_id ON exam_attendance(student_id);
CREATE INDEX idx_exam_attendance_attendance_date ON exam_attendance(attendance_date);
CREATE INDEX idx_exam_attendance_status ON exam_attendance(status);