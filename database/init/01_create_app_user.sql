-- SRMS Database Initialization Script
-- Note: For complete setup, use scripts in database/setup/ directory

CREATE DATABASE IF NOT EXISTS srms CHARACTER SET = 'utf8mb4' COLLATE = 'utf8mb4_general_ci';
CREATE USER IF NOT EXISTS 'srms_user'@'localhost' IDENTIFIED BY 'srms_pass';
CREATE USER IF NOT EXISTS 'srms_user'@'%' IDENTIFIED BY 'srms_pass';
GRANT ALL PRIVILEGES ON srms.* TO 'srms_user'@'localhost';
GRANT ALL PRIVILEGES ON srms.* TO 'srms_user'@'%';
FLUSH PRIVILEGES;
