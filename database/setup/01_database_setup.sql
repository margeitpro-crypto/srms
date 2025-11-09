-- SRMS Database Setup Script
-- This script creates the database, user, and initializes the schema

-- Create the database
CREATE DATABASE IF NOT EXISTS srms 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

-- Create the application user
CREATE USER IF NOT EXISTS 'srms_user'@'localhost' 
  IDENTIFIED BY 'srms_pass';

CREATE USER IF NOT EXISTS 'srms_user'@'%' 
  IDENTIFIED BY 'srms_pass';

-- Grant necessary privileges
GRANT ALL PRIVILEGES ON srms.* TO 'srms_user'@'localhost';
GRANT ALL PRIVILEGES ON srms.* TO 'srms_user'@'%';

-- Grant additional permissions needed for migrations
GRANT CREATE, ALTER, DROP, INDEX, REFERENCES ON srms.* TO 'srms_user'@'localhost';
GRANT CREATE, ALTER, DROP, INDEX, REFERENCES ON srms.* TO 'srms_user'@'%';

-- Flush privileges to ensure they take effect
FLUSH PRIVILEGES;

-- Switch to the srms database
USE srms;

-- Display confirmation
SELECT 'Database setup completed successfully!' AS Status;

-- Show database information
SELECT 
  SCHEMA_NAME AS 'Database',
  DEFAULT_CHARACTER_SET_NAME AS 'Character Set',
  DEFAULT_COLLATION_NAME AS 'Collation'
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME = 'srms';

-- Show user information
SELECT 
  User AS 'Username',
  Host AS 'Host',
  'Created/Updated' AS 'Status'
FROM mysql.user
WHERE User = 'srms_user';