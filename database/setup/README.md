# SRMS Database Setup

This directory contains scripts to set up the Student Result Management System (SRMS) database.

## Database Structure

The SRMS database is designed to manage:
- User accounts and roles (students, teachers, admins, etc.)
- School information and academic structure
- Student records and enrollment
- Subject management and curriculum
- Exam scheduling and result management
- Fee structures and payment processing
- Certificate generation and management
- Reporting and analytics
- Notifications and communication

## Setup Scripts

1. **01_database_setup.sql** - Creates the database and user account
2. **02_initialize_schema.sql** - Creates all database tables and relationships
3. **03_insert_initial_data.sql** - Inserts sample data for testing
4. **setup_database.bat** - Windows batch script to run all setup steps

## Database Credentials

- **Database Name**: `srms`
- **Username**: `srms_user`
- **Password**: `srms_pass`
- **Host**: `localhost`
- **Port**: `3306` (default MySQL port)

## Setup Instructions

### Prerequisites
- MySQL Server 8.0 or higher
- MySQL Command Line Client

### Windows Setup
1. Make sure MySQL Server is running
2. Open Command Prompt as Administrator
3. Navigate to the project root directory
4. Run the setup script:
   ```cmd
   database\setup\setup_database.bat
   ```
5. Enter the MySQL root password when prompted

### Manual Setup
1. Create the database and user:
   ```sql
   mysql -u root -p < database/setup/01_database_setup.sql
   ```

2. Initialize the schema:
   ```sql
   mysql -u root -p < database/setup/02_initialize_schema.sql
   ```

3. Insert initial data:
   ```sql
   mysql -u root -p < database/setup/03_insert_initial_data.sql
   ```

## Database Schema Overview

The database contains the following main entities:

### Core Entities
- **users** - User accounts with roles
- **schools** - School information
- **students** - Student records
- **subjects** - Academic subjects
- **exams** - Exam schedules and information

### Academic Management
- **exam_results** - Overall exam results
- **exam_subject_results** - Subject-wise results
- **marks** - Individual subject marks

### Financial Management
- **fee_structures** - Fee definitions
- **exam_fees** - Exam fee records
- **bills** - Billing information
- **payments** - Payment records

### Certificate Management
- **certificate_templates** - Certificate templates
- **certificates** - Generated certificates
- **certificate_bills** - Certificate billing
- **certificate_payments** - Certificate payment records

### System Management
- **system_settings** - Application settings
- **audit_logs** - Audit trail
- **notifications** - User notifications

## Default Data

The setup includes sample data for:
- 6 user accounts (admin, district admin, school admin, teacher, student, parent)
- 3 schools
- 8 subjects
- 4 students
- 3 exams
- Sample results, fees, bills, and certificates

## Connection String

For the backend application, use the following connection string format:

```
mysql://srms_user:srms_pass@localhost:3306/srms
```

## Troubleshooting

### Access Denied Errors
- Ensure MySQL root user has privileges to create databases and users
- Check that the MySQL server is running
- Verify the root password is correct

### Database Already Exists
- Drop the existing database and user before running setup:
  ```sql
  DROP DATABASE IF EXISTS srms;
  DROP USER IF EXISTS 'srms_user'@'localhost';
  DROP USER IF EXISTS 'srms_user'@'%';
  ```

### Schema Creation Errors
- Ensure all foreign key references are correct
- Check that MySQL version supports the used features