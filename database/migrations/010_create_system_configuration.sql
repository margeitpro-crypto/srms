-- Migration 010: Create System Configuration and Security
-- Description: Creates comprehensive system configuration and security management system

-- Create enum for setting_type
CREATE TYPE setting_type AS ENUM ('STRING', 'INTEGER', 'BOOLEAN', 'FLOAT', 'JSON', 'DATE', 'DATETIME', 'EMAIL', 'URL', 'PASSWORD');

-- Create enum for permission_level
CREATE TYPE permission_level AS ENUM ('VIEW', 'CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'PUBLISH', 'ADMIN');

-- Create enum for backup_status
CREATE TYPE backup_status AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- Create system_settings table
CREATE TABLE system_settings (
    id SERIAL PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type setting_type NOT NULL DEFAULT 'STRING',
    description TEXT,
    category VARCHAR(50) NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE,
    is_system BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    validation_rules JSONB,
    options JSONB,
    min_value INTEGER,
    max_value INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for system_settings
CREATE UNIQUE INDEX idx_system_settings_setting_key ON system_settings(setting_key);
CREATE INDEX idx_system_settings_category ON system_settings(category);
CREATE INDEX idx_system_settings_is_system ON system_settings(is_system);
CREATE INDEX idx_system_settings_is_editable ON system_settings(is_editable);

-- Create school_settings table
CREATE TABLE school_settings (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    setting_type setting_type NOT NULL DEFAULT 'STRING',
    description TEXT,
    category VARCHAR(50) NOT NULL,
    is_encrypted BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    validation_rules JSONB,
    options JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, setting_key)
);

-- Create indexes for school_settings
CREATE INDEX idx_school_settings_school_id ON school_settings(school_id);
CREATE INDEX idx_school_settings_category ON school_settings(category);
CREATE INDEX idx_school_settings_setting_key ON school_settings(setting_key);

-- Create permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    permission_name VARCHAR(100) UNIQUE NOT NULL,
    permission_code VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    permission_level permission_level NOT NULL DEFAULT 'VIEW',
    is_system BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for permissions
CREATE UNIQUE INDEX idx_permissions_permission_name ON permissions(permission_name);
CREATE UNIQUE INDEX idx_permissions_permission_code ON permissions(permission_code);
CREATE INDEX idx_permissions_module ON permissions(module);
CREATE INDEX idx_permissions_category ON permissions(category);
CREATE INDEX idx_permissions_is_system ON permissions(is_system);
CREATE INDEX idx_permissions_is_active ON permissions(is_active);

-- Create role_permissions table
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role VARCHAR(50) NOT NULL,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role, permission_id)
);

-- Create indexes for role_permissions
CREATE INDEX idx_role_permissions_role ON role_permissions(role);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_role_permissions_is_active ON role_permissions(is_active);

-- Create user_permissions table
CREATE TABLE user_permissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    is_granted BOOLEAN DEFAULT TRUE,
    granted_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, permission_id)
);

-- Create indexes for user_permissions
CREATE INDEX idx_user_permissions_user_id ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission_id ON user_permissions(permission_id);
CREATE INDEX idx_user_permissions_is_granted ON user_permissions(is_granted);
CREATE INDEX idx_user_permissions_expires_at ON user_permissions(expires_at);

-- Create security_logs table
CREATE TABLE security_logs (
    id SERIAL PRIMARY KEY,
    school_id INTEGER REFERENCES schools(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id INTEGER,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(100),
    device_info JSONB,
    location_info JSONB,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    additional_data JSONB,
    risk_level VARCHAR(20) DEFAULT 'LOW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for security_logs
CREATE INDEX idx_security_logs_school_id ON security_logs(school_id);
CREATE INDEX idx_security_logs_user_id ON security_logs(user_id);
CREATE INDEX idx_security_logs_action ON security_logs(action);
CREATE INDEX idx_security_logs_resource_type ON security_logs(resource_type);
CREATE INDEX idx_security_logs_success ON security_logs(success);
CREATE INDEX idx_security_logs_risk_level ON security_logs(risk_level);
CREATE INDEX idx_security_logs_created_at ON security_logs(created_at);

-- Create login_attempts table
CREATE TABLE login_attempts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    location_info JSONB,
    success BOOLEAN DEFAULT FALSE,
    failure_reason VARCHAR(100),
    attempt_count INTEGER DEFAULT 1,
    locked_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for login_attempts
CREATE INDEX idx_login_attempts_email ON login_attempts(email);
CREATE INDEX idx_login_attempts_ip_address ON login_attempts(ip_address);
CREATE INDEX idx_login_attempts_success ON login_attempts(success);
CREATE INDEX idx_login_attempts_locked_until ON login_attempts(locked_until);
CREATE INDEX idx_login_attempts_created_at ON login_attempts(created_at);

-- Create password_history table
CREATE TABLE password_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changed_by VARCHAR(50) DEFAULT 'USER',
    reason TEXT
);

-- Create indexes for password_history
CREATE INDEX idx_password_history_user_id ON password_history(user_id);
CREATE INDEX idx_password_history_changed_at ON password_history(changed_at);

-- Create api_keys table
CREATE TABLE api_keys (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    key_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) UNIQUE NOT NULL,
    api_secret VARCHAR(255),
    permissions JSONB,
    allowed_ips INET[],
    allowed_domains VARCHAR(255)[],
    rate_limit INTEGER DEFAULT 1000,
    rate_limit_window INTEGER DEFAULT 3600,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for api_keys
CREATE UNIQUE INDEX idx_api_keys_api_key ON api_keys(api_key);
CREATE INDEX idx_api_keys_school_id ON api_keys(school_id);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active);
CREATE INDEX idx_api_keys_expires_at ON api_keys(expires_at);
CREATE INDEX idx_api_keys_deleted_at ON api_keys(deleted_at);

-- Create system_backups table
CREATE TABLE system_backups (
    id SERIAL PRIMARY KEY,
    backup_name VARCHAR(255) NOT NULL,
    backup_type VARCHAR(50) NOT NULL,
    backup_size BIGINT,
    backup_path VARCHAR(500),
    checksum VARCHAR(255),
    status backup_status NOT NULL DEFAULT 'PENDING',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    error_message TEXT,
    retention_days INTEGER DEFAULT 30,
    is_automated BOOLEAN DEFAULT FALSE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for system_backups
CREATE INDEX idx_system_backups_backup_type ON system_backups(backup_type);
CREATE INDEX idx_system_backups_status ON system_backups(status);
CREATE INDEX idx_system_backups_started_at ON system_backups(started_at);
CREATE INDEX idx_system_backups_completed_at ON system_backups(completed_at);
CREATE INDEX idx_system_backups_is_automated ON system_backups(is_automated);

-- Create system_health table
CREATE TABLE system_health (
    id SERIAL PRIMARY KEY,
    component VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL,
    metrics JSONB,
    error_count INTEGER DEFAULT 0,
    last_error_at TIMESTAMP,
    last_check_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    next_check_at TIMESTAMP,
    uptime_percentage DECIMAL(5,2),
    response_time INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(component)
);

-- Create indexes for system_health
CREATE INDEX idx_system_health_component ON system_health(component);
CREATE INDEX idx_system_health_status ON system_health(status);
CREATE INDEX idx_system_health_last_check_at ON system_health(last_check_at);
CREATE INDEX idx_system_health_next_check_at ON system_health(next_check_at);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category, is_system, is_editable) VALUES
('app_name', 'School Management System', 'STRING', 'Application name', 'GENERAL', true, false),
('app_version', '1.0.0', 'STRING', 'Application version', 'GENERAL', true, false),
('maintenance_mode', 'false', 'BOOLEAN', 'System maintenance mode', 'GENERAL', true, true),
('max_login_attempts', '5', 'INTEGER', 'Maximum failed login attempts before lockout', 'SECURITY', true, true),
('lockout_duration_minutes', '30', 'INTEGER', 'Account lockout duration in minutes', 'SECURITY', true, true),
('session_timeout_minutes', '60', 'INTEGER', 'User session timeout in minutes', 'SECURITY', true, true),
('password_expiry_days', '90', 'INTEGER', 'Password expiry duration in days', 'SECURITY', true, true),
('backup_retention_days', '30', 'INTEGER', 'Backup retention period in days', 'BACKUP', true, true),
('auto_backup_enabled', 'true', 'BOOLEAN', 'Enable automated backups', 'BACKUP', true, true),
('auto_backup_schedule', '0 2 * * *', 'STRING', 'Automated backup cron schedule', 'BACKUP', true, true),
('email_smtp_host', '', 'STRING', 'SMTP host for email notifications', 'EMAIL', true, true),
('email_smtp_port', '587', 'INTEGER', 'SMTP port for email notifications', 'EMAIL', true, true),
('email_smtp_username', '', 'STRING', 'SMTP username for email notifications', 'EMAIL', true, true),
('email_smtp_password', '', 'PASSWORD', 'SMTP password for email notifications', 'EMAIL', true, true),
('sms_api_key', '', 'STRING', 'SMS API key for notifications', 'SMS', true, true),
('sms_api_secret', '', 'PASSWORD', 'SMS API secret for notifications', 'SMS', true, true),
('file_upload_max_size_mb', '10', 'INTEGER', 'Maximum file upload size in MB', 'FILES', true, true),
('allowed_file_types', 'pdf,doc,docx,xls,xlsx,jpg,jpeg,png', 'STRING', 'Allowed file types for upload', 'FILES', true, true),
('student_photo_max_size_mb', '2', 'INTEGER', 'Maximum student photo size in MB', 'FILES', true, true),
('report_generation_timeout_seconds', '300', 'INTEGER', 'Report generation timeout in seconds', 'REPORTS', true, true),
('max_concurrent_reports', '5', 'INTEGER', 'Maximum concurrent report generations', 'REPORTS', true, true),
('audit_log_retention_days', '365', 'INTEGER', 'Audit log retention period in days', 'AUDIT', true, true),
('system_log_retention_days', '30', 'INTEGER', 'System log retention period in days', 'AUDIT', true, true),
('enable_api_logging', 'true', 'BOOLEAN', 'Enable API request logging', 'AUDIT', true, true),
('enable_user_activity_logging', 'true', 'BOOLEAN', 'Enable user activity logging', 'AUDIT', true, true),
('default_language', 'en', 'STRING', 'Default application language', 'LOCALIZATION', true, true),
('timezone', 'UTC', 'STRING', 'System timezone', 'LOCALIZATION', true, true),
('date_format', 'YYYY-MM-DD', 'STRING', 'Default date format', 'LOCALIZATION', true, true),
('time_format', 'HH24:MI', 'STRING', 'Default time format', 'LOCALIZATION', true, true),
('currency_symbol', '$', 'STRING', 'Default currency symbol', 'LOCALIZATION', true, true),
('currency_code', 'USD', 'STRING', 'Default currency code', 'LOCALIZATION', true, true),
('decimal_places', '2', 'INTEGER', 'Number of decimal places for currency', 'LOCALIZATION', true, true),
('enable_multi_language', 'true', 'BOOLEAN', 'Enable multi-language support', 'LOCALIZATION', true, true),
('supported_languages', 'en,ne', 'STRING', 'Supported languages (comma separated)', 'LOCALIZATION', true, true);

-- Insert default permissions
INSERT INTO permissions (permission_name, permission_code, description, module, category, permission_level, is_system, is_active) VALUES
('View Dashboard', 'DASHBOARD_VIEW', 'View system dashboard', 'DASHBOARD', 'GENERAL', 'VIEW', true, true),
('Manage System Settings', 'SYSTEM_SETTINGS_MANAGE', 'Manage system-wide settings', 'SYSTEM', 'ADMIN', 'ADMIN', true, true),
('View System Logs', 'SYSTEM_LOGS_VIEW', 'View system logs and monitoring', 'SYSTEM', 'AUDIT', 'VIEW', true, true),
('Manage Users', 'USERS_MANAGE', 'Create, update, and delete users', 'USERS', 'ADMIN', 'ADMIN', true, true),
('View Users', 'USERS_VIEW', 'View user information', 'USERS', 'GENERAL', 'VIEW', true, true),
('Manage Roles', 'ROLES_MANAGE', 'Manage user roles and permissions', 'USERS', 'ADMIN', 'ADMIN', true, true),
('Manage Schools', 'SCHOOLS_MANAGE', 'Create, update, and delete schools', 'SCHOOLS', 'ADMIN', 'ADMIN', true, true),
('View Schools', 'SCHOOLS_VIEW', 'View school information', 'SCHOOLS', 'GENERAL', 'VIEW', true, true),
('Manage Students', 'STUDENTS_MANAGE', 'Create, update, and delete students', 'STUDENTS', 'ADMIN', 'ADMIN', true, true),
('View Students', 'STUDENTS_VIEW', 'View student information', 'STUDENTS', 'GENERAL', 'VIEW', true, true),
('Manage Exams', 'EXAMS_MANAGE', 'Create, update, and delete exams', 'EXAMS', 'ADMIN', 'ADMIN', true, true),
('View Exams', 'EXAMS_VIEW', 'View exam information', 'EXAMS', 'GENERAL', 'VIEW', true, true),
('Manage Results', 'RESULTS_MANAGE', 'Manage exam results and grades', 'EXAMS', 'ADMIN', 'ADMIN', true, true),
('View Results', 'RESULTS_VIEW', 'View exam results', 'EXAMS', 'GENERAL', 'VIEW', true, true),
('Manage Fees', 'FEES_MANAGE', 'Create, update, and delete fee structures', 'FEES', 'ADMIN', 'ADMIN', true, true),
('View Fees', 'FEES_VIEW', 'View fee information', 'FEES', 'GENERAL', 'VIEW', true, true),
('Manage Certificates', 'CERTIFICATES_MANAGE', 'Create, update, and delete certificates', 'CERTIFICATES', 'ADMIN', 'ADMIN', true, true),
('View Certificates', 'CERTIFICATES_VIEW', 'View certificate information', 'CERTIFICATES', 'GENERAL', 'VIEW', true, true),
('Manage Reports', 'REPORTS_MANAGE', 'Create, update, and delete reports', 'REPORTS', 'ADMIN', 'ADMIN', true, true),
('View Reports', 'REPORTS_VIEW', 'View reports and analytics', 'REPORTS', 'GENERAL', 'VIEW', true, true),
('Manage Notifications', 'NOTIFICATIONS_MANAGE', 'Create, update, and delete notifications', 'NOTIFICATIONS', 'ADMIN', 'ADMIN', true, true),
('View Notifications', 'NOTIFICATIONS_VIEW', 'View notifications and announcements', 'NOTIFICATIONS', 'GENERAL', 'VIEW', true, true),
('Manage Documents', 'DOCUMENTS_MANAGE', 'Create, update, and delete documents', 'DOCUMENTS', 'ADMIN', 'ADMIN', true, true),
('View Documents', 'DOCUMENTS_VIEW', 'View documents and files', 'DOCUMENTS', 'GENERAL', 'VIEW', true, true),
('Manage Backups', 'BACKUPS_MANAGE', 'Create, update, and delete system backups', 'SYSTEM', 'ADMIN', 'ADMIN', true, true),
('View Backups', 'BACKUPS_VIEW', 'View backup information', 'SYSTEM', 'GENERAL', 'VIEW', true, true),
('Approve Certificates', 'CERTIFICATES_APPROVE', 'Approve certificate requests', 'CERTIFICATES', 'APPROVAL', 'APPROVE', true, true),
('Publish Announcements', 'ANNOUNCEMENTS_PUBLISH', 'Publish announcements and notices', 'NOTIFICATIONS', 'PUBLISH', 'PUBLISH', true, true),
('Manage API Keys', 'API_KEYS_MANAGE', 'Manage API keys and integrations', 'SYSTEM', 'ADMIN', 'ADMIN', true, true),
('View API Keys', 'API_KEYS_VIEW', 'View API key information', 'SYSTEM', 'GENERAL', 'VIEW', true, true);