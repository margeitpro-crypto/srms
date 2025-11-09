-- Migration 009: Create Reports and Analytics System
-- Description: Creates comprehensive reporting and analytics system

-- Create enum for report_type
CREATE TYPE report_type AS ENUM ('STUDENT_PERFORMANCE', 'ATTENDANCE', 'FEE_COLLECTION', 'EXAM_RESULTS', 'CERTIFICATE_ISSUANCE', 'USER_ACTIVITY', 'SYSTEM_USAGE', 'FINANCIAL', 'CUSTOM');

-- Create enum for report_status
CREATE TYPE report_status AS ENUM ('DRAFT', 'SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- Create enum for report_format
CREATE TYPE report_format AS ENUM ('PDF', 'EXCEL', 'CSV', 'JSON', 'HTML', 'CHART');

-- Create enum for chart_type
CREATE TYPE chart_type AS ENUM ('BAR', 'LINE', 'PIE', 'DOUGHNUT', 'SCATTER', 'AREA', 'COLUMN', 'TABLE');

-- Create report_templates table
CREATE TABLE report_templates (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    report_type report_type NOT NULL,
    query_template TEXT NOT NULL,
    parameters JSONB,
    filters JSONB,
    columns JSONB,
    default_format report_format NOT NULL DEFAULT 'PDF',
    available_formats report_format[] DEFAULT ARRAY['PDF', 'EXCEL'],
    chart_config JSONB,
    is_system BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for report_templates
CREATE INDEX idx_report_templates_school_id ON report_templates(school_id);
CREATE INDEX idx_report_templates_report_type ON report_templates(report_type);
CREATE INDEX idx_report_templates_is_system ON report_templates(is_system);
CREATE INDEX idx_report_templates_is_active ON report_templates(is_active);
CREATE INDEX idx_report_templates_deleted_at ON report_templates(deleted_at);

-- Create reports table
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    report_number VARCHAR(50) UNIQUE NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES report_templates(id) ON DELETE SET NULL,
    report_type report_type NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parameters JSONB,
    filters JSONB,
    status report_status NOT NULL DEFAULT 'DRAFT',
    format report_format NOT NULL DEFAULT 'PDF',
    file_path VARCHAR(500),
    file_size INTEGER,
    generated_at TIMESTAMP,
    expires_at TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    error_message TEXT,
    execution_time INTEGER,
    record_count INTEGER,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    generated_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for reports
CREATE UNIQUE INDEX idx_reports_report_number ON reports(report_number);
CREATE INDEX idx_reports_school_id ON reports(school_id);
CREATE INDEX idx_reports_template_id ON reports(template_id);
CREATE INDEX idx_reports_report_type ON reports(report_type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_format ON reports(format);
CREATE INDEX idx_reports_generated_at ON reports(generated_at);
CREATE INDEX idx_reports_expires_at ON reports(expires_at);
CREATE INDEX idx_reports_deleted_at ON reports(deleted_at);

-- Create report_schedules table
CREATE TABLE report_schedules (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    template_id INTEGER NOT NULL REFERENCES report_templates(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    schedule_cron VARCHAR(100) NOT NULL,
    parameters JSONB,
    filters JSONB,
    format report_format NOT NULL DEFAULT 'PDF',
    recipients JSONB,
    email_subject VARCHAR(500),
    email_template TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_run_at TIMESTAMP,
    next_run_at TIMESTAMP,
    run_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    failure_count INTEGER DEFAULT 0,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for report_schedules
CREATE INDEX idx_report_schedules_school_id ON report_schedules(school_id);
CREATE INDEX idx_report_schedules_template_id ON report_schedules(template_id);
CREATE INDEX idx_report_schedules_is_active ON report_schedules(is_active);
CREATE INDEX idx_report_schedules_next_run_at ON report_schedules(next_run_at);
CREATE INDEX idx_report_schedules_deleted_at ON report_schedules(deleted_at);

-- Create analytics_dashboards table
CREATE TABLE analytics_dashboards (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dashboard_config JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for analytics_dashboards
CREATE INDEX idx_analytics_dashboards_school_id ON analytics_dashboards(school_id);
CREATE INDEX idx_analytics_dashboards_is_default ON analytics_dashboards(is_default);
CREATE INDEX idx_analytics_dashboards_is_public ON analytics_dashboards(is_public);
CREATE INDEX idx_analytics_dashboards_is_active ON analytics_dashboards(is_active);
CREATE INDEX idx_analytics_dashboards_deleted_at ON analytics_dashboards(deleted_at);

-- Create dashboard_widgets table
CREATE TABLE dashboard_widgets (
    id SERIAL PRIMARY KEY,
    dashboard_id INTEGER NOT NULL REFERENCES analytics_dashboards(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    widget_type VARCHAR(50) NOT NULL,
    chart_type chart_type,
    position_x INTEGER DEFAULT 0,
    position_y INTEGER DEFAULT 0,
    width INTEGER DEFAULT 4,
    height INTEGER DEFAULT 4,
    data_source JSONB,
    query_config JSONB,
    display_config JSONB,
    refresh_interval INTEGER DEFAULT 300,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for dashboard_widgets
CREATE INDEX idx_dashboard_widgets_dashboard_id ON dashboard_widgets(dashboard_id);
CREATE INDEX idx_dashboard_widgets_widget_type ON dashboard_widgets(widget_type);
CREATE INDEX idx_dashboard_widgets_is_active ON dashboard_widgets(is_active);
CREATE INDEX idx_dashboard_widgets_deleted_at ON dashboard_widgets(deleted_at);

-- Create user_dashboard_assignments table
CREATE TABLE user_dashboard_assignments (
    id SERIAL PRIMARY KEY,
    dashboard_id INTEGER NOT NULL REFERENCES analytics_dashboards(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_default BOOLEAN DEFAULT FALSE,
    can_edit BOOLEAN DEFAULT FALSE,
    can_share BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(dashboard_id, user_id)
);

-- Create indexes for user_dashboard_assignments
CREATE INDEX idx_user_dashboard_assignments_dashboard_id ON user_dashboard_assignments(dashboard_id);
CREATE INDEX idx_user_dashboard_assignments_user_id ON user_dashboard_assignments(user_id);
CREATE INDEX idx_user_dashboard_assignments_is_default ON user_dashboard_assignments(is_default);

-- Create system_logs table
CREATE TABLE system_logs (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    log_level VARCHAR(20) NOT NULL,
    log_category VARCHAR(50) NOT NULL,
    log_message TEXT NOT NULL,
    log_data JSONB,
    ip_address INET,
    user_agent TEXT,
    request_id VARCHAR(100),
    session_id VARCHAR(100),
    endpoint VARCHAR(500),
    method VARCHAR(10),
    response_code INTEGER,
    response_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for system_logs
CREATE INDEX idx_system_logs_school_id ON system_logs(school_id);
CREATE INDEX idx_system_logs_user_id ON system_logs(user_id);
CREATE INDEX idx_system_logs_log_level ON system_logs(log_level);
CREATE INDEX idx_system_logs_log_category ON system_logs(log_category);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at);
CREATE INDEX idx_system_logs_request_id ON system_logs(request_id);
CREATE INDEX idx_system_logs_endpoint ON system_logs(endpoint);

-- Create user_activity_logs table
CREATE TABLE user_activity_logs (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    device_info JSONB,
    location_info JSONB,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user_activity_logs
CREATE INDEX idx_user_activity_logs_school_id ON user_activity_logs(school_id);
CREATE INDEX idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_user_activity_logs_activity_type ON user_activity_logs(activity_type);
CREATE INDEX idx_user_activity_logs_success ON user_activity_logs(success);
CREATE INDEX idx_user_activity_logs_created_at ON user_activity_logs(created_at);

-- Create data_export_logs table
CREATE TABLE data_export_logs (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    export_type VARCHAR(50) NOT NULL,
    export_format VARCHAR(50) NOT NULL,
    file_path VARCHAR(500),
    file_size INTEGER,
    record_count INTEGER,
    filters JSONB,
    parameters JSONB,
    execution_time INTEGER,
    status VARCHAR(50) NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for data_export_logs
CREATE INDEX idx_data_export_logs_school_id ON data_export_logs(school_id);
CREATE INDEX idx_data_export_logs_user_id ON data_export_logs(user_id);
CREATE INDEX idx_data_export_logs_export_type ON data_export_logs(export_type);
CREATE INDEX idx_data_export_logs_status ON data_export_logs(status);
CREATE INDEX idx_data_export_logs_created_at ON data_export_logs(created_at);