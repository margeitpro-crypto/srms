#!/bin/bash

# Backup script for SRMS database

BACKUP_DIR="./database/backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$DATE.sql"

mkdir -p $BACKUP_DIR

pg_dump $DATABASE_URL > $BACKUP_FILE

echo "Backup created: $BACKUP_FILE"
