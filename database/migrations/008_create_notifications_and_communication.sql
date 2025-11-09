-- Migration 008: Create Notifications and Communication System
-- Description: Creates comprehensive notification and communication management system

-- Create enum for notification_type
CREATE TYPE notification_type AS ENUM ('SYSTEM', 'EXAM', 'FEE', 'CERTIFICATE', 'ATTENDANCE', 'RESULT', 'HOLIDAY', 'EVENT', 'GENERAL', 'URGENT');

-- Create enum for notification_priority
CREATE TYPE notification_priority AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- Create enum for notification_status
CREATE TYPE notification_status AS ENUM ('DRAFT', 'SCHEDULED', 'SENT', 'DELIVERED', 'FAILED', 'CANCELLED');

-- Create enum for notification_channel
CREATE TYPE notification_channel AS ENUM ('EMAIL', 'SMS', 'PUSH', 'IN_APP', 'WHATSAPP', 'WEBHOOK');

-- Create notification_templates table
CREATE TABLE notification_templates (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    notification_type notification_type NOT NULL,
    title_template VARCHAR(500) NOT NULL,
    message_template TEXT NOT NULL,
    email_template TEXT,
    sms_template VARCHAR(500),
    push_template VARCHAR(500),
    variables JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    is_system BOOLEAN DEFAULT FALSE,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for notification_templates
CREATE INDEX idx_notification_templates_school_id ON notification_templates(school_id);
CREATE INDEX idx_notification_templates_notification_type ON notification_templates(notification_type);
CREATE INDEX idx_notification_templates_is_active ON notification_templates(is_active);
CREATE INDEX idx_notification_templates_is_system ON notification_templates(is_system);
CREATE INDEX idx_notification_templates_deleted_at ON notification_templates(deleted_at);

-- Create notifications table
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    notification_number VARCHAR(50) UNIQUE NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    template_id INTEGER REFERENCES notification_templates(id) ON DELETE SET NULL,
    notification_type notification_type NOT NULL,
    title VARCHAR(500) NOT NULL,
    message TEXT NOT NULL,
    priority notification_priority NOT NULL DEFAULT 'MEDIUM',
    status notification_status NOT NULL DEFAULT 'DRAFT',
    scheduled_at TIMESTAMP,
    sent_at TIMESTAMP,
    expires_at TIMESTAMP,
    target_audience VARCHAR(50),
    target_users JSONB,
    target_classes JSONB,
    target_sections JSONB,
    metadata JSONB,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    sent_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for notifications
CREATE UNIQUE INDEX idx_notifications_notification_number ON notifications(notification_number);
CREATE INDEX idx_notifications_school_id ON notifications(school_id);
CREATE INDEX idx_notifications_template_id ON notifications(template_id);
CREATE INDEX idx_notifications_notification_type ON notifications(notification_type);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_at ON notifications(scheduled_at);
CREATE INDEX idx_notifications_sent_at ON notifications(sent_at);
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at);
CREATE INDEX idx_notifications_deleted_at ON notifications(deleted_at);

-- Create notification_recipients table
CREATE TABLE notification_recipients (
    id SERIAL PRIMARY KEY,
    notification_id INTEGER NOT NULL REFERENCES notifications(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_type VARCHAR(50) NOT NULL,
    recipient_id INTEGER,
    channel notification_channel NOT NULL,
    delivery_status notification_status NOT NULL DEFAULT 'SENT',
    delivered_at TIMESTAMP,
    read_at TIMESTAMP,
    clicked_at TIMESTAMP,
    response_data JSONB,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    last_retry_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for notification_recipients
CREATE INDEX idx_notification_recipients_notification_id ON notification_recipients(notification_id);
CREATE INDEX idx_notification_recipients_user_id ON notification_recipients(user_id);
CREATE INDEX idx_notification_recipients_recipient_type ON notification_recipients(recipient_type);
CREATE INDEX idx_notification_recipients_channel ON notification_recipients(channel);
CREATE INDEX idx_notification_recipients_delivery_status ON notification_recipients(delivery_status);
CREATE INDEX idx_notification_recipients_read_at ON notification_recipients(read_at);

-- Create user_notification_preferences table
CREATE TABLE user_notification_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    is_enabled BOOLEAN DEFAULT TRUE,
    frequency VARCHAR(50) DEFAULT 'IMMEDIATE',
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, notification_type, channel)
);

-- Create indexes for user_notification_preferences
CREATE INDEX idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);
CREATE INDEX idx_user_notification_preferences_notification_type ON user_notification_preferences(notification_type);
CREATE INDEX idx_user_notification_preferences_channel ON user_notification_preferences(channel);
CREATE INDEX idx_user_notification_preferences_is_enabled ON user_notification_preferences(is_enabled);

-- Create communication_logs table
CREATE TABLE communication_logs (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    communication_type VARCHAR(50) NOT NULL,
    sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    recipient_type VARCHAR(50) NOT NULL,
    recipient_count INTEGER DEFAULT 0,
    subject VARCHAR(500),
    message TEXT,
    channel notification_channel NOT NULL,
    status notification_status NOT NULL DEFAULT 'SENT',
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    failed_at TIMESTAMP,
    error_message TEXT,
    response_data JSONB,
    attachment_paths JSONB,
    cost DECIMAL(10,2) DEFAULT 0,
    provider_response JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for communication_logs
CREATE INDEX idx_communication_logs_school_id ON communication_logs(school_id);
CREATE INDEX idx_communication_logs_communication_type ON communication_logs(communication_type);
CREATE INDEX idx_communication_logs_sender_id ON communication_logs(sender_id);
CREATE INDEX idx_communication_logs_channel ON communication_logs(channel);
CREATE INDEX idx_communication_logs_status ON communication_logs(status);
CREATE INDEX idx_communication_logs_sent_at ON communication_logs(sent_at);

-- Create announcement_categories table
CREATE TABLE announcement_categories (
    id SERIAL PRIMARY KEY,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    color_code VARCHAR(7),
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    display_order INTEGER DEFAULT 0,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(school_id, name)
);

-- Create indexes for announcement_categories
CREATE INDEX idx_announcement_categories_school_id ON announcement_categories(school_id);
CREATE INDEX idx_announcement_categories_is_active ON announcement_categories(is_active);
CREATE INDEX idx_announcement_categories_display_order ON announcement_categories(display_order);

-- Create announcements table
CREATE TABLE announcements (
    id SERIAL PRIMARY KEY,
    announcement_number VARCHAR(50) UNIQUE NOT NULL,
    school_id INTEGER NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES announcement_categories(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    priority notification_priority NOT NULL DEFAULT 'MEDIUM',
    is_featured BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    publish_at TIMESTAMP,
    expires_at TIMESTAMP,
    target_audience VARCHAR(50),
    target_users JSONB,
    target_classes JSONB,
    target_sections JSONB,
    attachment_paths JSONB,
    view_count INTEGER DEFAULT 0,
    created_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    published_by_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for announcements
CREATE UNIQUE INDEX idx_announcements_announcement_number ON announcements(announcement_number);
CREATE INDEX idx_announcements_school_id ON announcements(school_id);
CREATE INDEX idx_announcements_category_id ON announcements(category_id);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_is_published ON announcements(is_published);
CREATE INDEX idx_announcements_publish_at ON announcements(publish_at);
CREATE INDEX idx_announcements_expires_at ON announcements(expires_at);
CREATE INDEX idx_announcements_deleted_at ON announcements(deleted_at);

-- Create announcement_views table
CREATE TABLE announcement_views (
    id SERIAL PRIMARY KEY,
    announcement_id INTEGER NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    UNIQUE(announcement_id, user_id)
);

-- Create indexes for announcement_views
CREATE INDEX idx_announcement_views_announcement_id ON announcement_views(announcement_id);
CREATE INDEX idx_announcement_views_user_id ON announcement_views(user_id);
CREATE INDEX idx_announcement_views_viewed_at ON announcement_views(viewed_at);