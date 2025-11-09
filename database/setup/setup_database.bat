@echo off
echo SRMS Database Setup Script
echo =========================

echo Creating database and user...
mysql -u root -p < database/setup/01_database_setup.sql

if %errorlevel% neq 0 (
    echo Error creating database and user
    exit /b %errorlevel%
)

echo Initializing database schema...
mysql -u root -p < database/setup/02_initialize_schema.sql

if %errorlevel% neq 0 (
    echo Error initializing database schema
    exit /b %errorlevel%
)

echo Inserting initial data...
mysql -u root -p < database/setup/03_insert_initial_data.sql

if %errorlevel% neq 0 (
    echo Error inserting initial data
    exit /b %errorlevel%
)

echo Database setup completed successfully!
echo ======================================
echo Database: srms
echo Username: srms_user
echo Password: srms_pass
echo ======================================