-- SRMS Database Schema Initialization
-- This script initializes the database schema based on the Prisma migration

-- Switch to the srms database
USE srms;

-- Create all tables
-- Based on Prisma migration: backend/prisma/migrations/20251108060933_init/migration.sql

-- CreateTable
CREATE TABLE `audit_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity` VARCHAR(191) NOT NULL,
    `entityId` INTEGER NULL,
    `oldValues` JSON NULL,
    `newValues` JSON NULL,
    `ipAddress` VARCHAR(191) NULL,
    `userAgent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `audit_logs_action_idx`(`action`),
    INDEX `audit_logs_createdAt_idx`(`createdAt`),
    INDEX `audit_logs_entity_idx`(`entity`),
    INDEX `audit_logs_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `billNo` VARCHAR(191) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `balance` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NPR',
    `dueDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
    `description` VARCHAR(191) NULL,
    `billData` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `examFeeId` INTEGER NULL,

    UNIQUE INDEX `bills_billNo_key`(`billNo`),
    INDEX `bills_billNo_idx`(`billNo`),
    INDEX `bills_status_idx`(`status`),
    INDEX `bills_studentId_idx`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificate_bills` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `billNo` VARCHAR(191) NOT NULL,
    `totalAmount` DOUBLE NOT NULL,
    `paidAmount` DOUBLE NOT NULL DEFAULT 0,
    `balance` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NPR',
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `unitPrice` DOUBLE NOT NULL,
    `dueDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
    `description` VARCHAR(191) NULL,
    `billData` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `certificateId` INTEGER NULL,
    `certificateFeeId` INTEGER NULL,

    UNIQUE INDEX `certificate_bills_billNo_key`(`billNo`),
    INDEX `certificate_bills_billNo_idx`(`billNo`),
    INDEX `certificate_bills_status_idx`(`status`),
    INDEX `certificate_bills_studentId_idx`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificate_fees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NPR',
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `totalAmount` DOUBLE NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `feeStructureId` INTEGER NOT NULL,

    INDEX `certificate_fees_status_idx`(`status`),
    INDEX `certificate_fees_studentId_idx`(`studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificate_payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NPR',
    `method` ENUM('CASH', 'BANK_TRANSFER', 'ONLINE_PAYMENT', 'CARD', 'MOBILE_WALLET', 'CHEQUE') NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
    `transactionId` VARCHAR(191) NULL,
    `gatewayRef` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `certificateBillId` INTEGER NOT NULL,
    `processedById` INTEGER NULL,

    UNIQUE INDEX `certificate_payments_paymentId_key`(`paymentId`),
    INDEX `certificate_payments_method_idx`(`method`),
    INDEX `certificate_payments_paidAt_idx`(`paidAt`),
    INDEX `certificate_payments_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificate_templates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('MARKSHEET', 'TRANSCRIPT', 'PASSING_CERTIFICATE', 'MIGRATION_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'CUSTOM') NOT NULL,
    `template` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isDefault` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,

    INDEX `certificate_templates_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `certificates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `certificateNo` VARCHAR(191) NOT NULL,
    `type` ENUM('MARKSHEET', 'TRANSCRIPT', 'PASSING_CERTIFICATE', 'MIGRATION_CERTIFICATE', 'CHARACTER_CERTIFICATE', 'COMPLETION_CERTIFICATE', 'ACHIEVEMENT_CERTIFICATE', 'PARTICIPATION_CERTIFICATE', 'CUSTOM') NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `issueDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `validUntil` DATETIME(3) NULL,
    `verificationCode` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'READY', 'ISSUED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `templateData` JSON NULL,
    `pdfPath` VARCHAR(191) NULL,
    `downloadCount` INTEGER NOT NULL DEFAULT 0,
    `lastDownloaded` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `examResultId` INTEGER NULL,
    `templateId` INTEGER NULL,
    `issuedById` INTEGER NULL,

    UNIQUE INDEX `certificates_certificateNo_key`(`certificateNo`),
    UNIQUE INDEX `certificates_verificationCode_key`(`verificationCode`),
    INDEX `certificates_status_idx`(`status`),
    INDEX `certificates_studentId_idx`(`studentId`),
    INDEX `certificates_type_idx`(`type`),
    INDEX `certificates_verificationCode_idx`(`verificationCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_fees` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NPR',
    `dueDate` DATETIME(3) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `examId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,
    `feeStructureId` INTEGER NOT NULL,

    INDEX `exam_fees_status_idx`(`status`),
    UNIQUE INDEX `exam_fees_examId_studentId_key`(`examId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'PUBLISHED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `totalMarks` DOUBLE NULL,
    `obtainedMarks` DOUBLE NULL,
    `percentage` DOUBLE NULL,
    `grade` VARCHAR(191) NULL,
    `gradePoints` DOUBLE NULL,
    `rank` INTEGER NULL,
    `remarks` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `examId` INTEGER NOT NULL,
    `studentId` INTEGER NOT NULL,

    INDEX `exam_results_isPublished_idx`(`isPublished`),
    INDEX `exam_results_status_idx`(`status`),
    UNIQUE INDEX `exam_results_examId_studentId_key`(`examId`, `studentId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_subject_results` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marks` DOUBLE NOT NULL,
    `maxMarks` DOUBLE NOT NULL DEFAULT 100,
    `grade` VARCHAR(191) NULL,
    `gradePoints` DOUBLE NULL,
    `isAbsent` BOOLEAN NOT NULL DEFAULT false,
    `remarks` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `examResultId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,

    UNIQUE INDEX `exam_subject_results_examResultId_subjectId_key`(`examResultId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exam_subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `maxMarks` DOUBLE NOT NULL DEFAULT 100,
    `minMarks` DOUBLE NOT NULL DEFAULT 0,
    `examDate` DATETIME(3) NULL,
    `duration` INTEGER NULL,
    `instructions` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `examId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,

    UNIQUE INDEX `exam_subjects_examId_subjectId_key`(`examId`, `subjectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exams` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `examType` ENUM('UNIT_TEST', 'MIDTERM', 'FINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT') NOT NULL DEFAULT 'FINAL',
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `schoolId` INTEGER NULL,
    `createdById` INTEGER NULL,

    UNIQUE INDEX `exams_code_key`(`code`),
    INDEX `exams_examType_idx`(`examType`),
    INDEX `exams_schoolId_idx`(`schoolId`),
    INDEX `exams_startDate_endDate_idx`(`startDate`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fee_structures` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('EXAM_FEE', 'CERTIFICATE_FEE', 'PROCESSING_FEE', 'LATE_FEE', 'REISSUE_FEE', 'VERIFICATION_FEE', 'CUSTOM') NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NPR',
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `validFrom` DATETIME(3) NOT NULL,
    `validUntil` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `schoolId` INTEGER NULL,
    `createdById` INTEGER NULL,

    INDEX `fee_structures_schoolId_idx`(`schoolId`),
    INDEX `fee_structures_type_idx`(`type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `marks` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `marks` DOUBLE NOT NULL,
    `grade` VARCHAR(191) NULL,
    `gradePoints` DOUBLE NULL,
    `maxMarks` DOUBLE NOT NULL DEFAULT 100,
    `minMarks` DOUBLE NOT NULL DEFAULT 0,
    `examType` ENUM('UNIT_TEST', 'MIDTERM', 'FINAL', 'PRACTICAL', 'PROJECT', 'ASSIGNMENT') NOT NULL DEFAULT 'FINAL',
    `examDate` DATETIME(3) NULL,
    `remarks` VARCHAR(191) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `publishedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `studentId` INTEGER NOT NULL,
    `subjectId` INTEGER NOT NULL,

    INDEX `marks_examType_idx`(`examType`),
    INDEX `marks_isPublished_idx`(`isPublished`),
    INDEX `marks_studentId_idx`(`studentId`),
    INDEX `marks_subjectId_idx`(`subjectId`),
    UNIQUE INDEX `marks_studentId_subjectId_examType_key`(`studentId`, `subjectId`, `examType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `type` ENUM('INFO', 'WARNING', 'ERROR', 'SUCCESS') NOT NULL DEFAULT 'INFO',
    `targetId` INTEGER NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `userId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `notifications_isRead_idx`(`isRead`),
    INDEX `notifications_type_idx`(`type`),
    INDEX `notifications_userId_idx`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `payments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paymentId` VARCHAR(191) NOT NULL,
    `amount` DOUBLE NOT NULL,
    `currency` VARCHAR(191) NOT NULL DEFAULT 'NPR',
    `method` ENUM('CASH', 'BANK_TRANSFER', 'ONLINE_PAYMENT', 'CARD', 'MOBILE_WALLET', 'CHEQUE') NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REFUNDED', 'PARTIALLY_PAID') NOT NULL DEFAULT 'PENDING',
    `transactionId` VARCHAR(191) NULL,
    `gatewayRef` VARCHAR(191) NULL,
    `remarks` VARCHAR(191) NULL,
    `paidAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `billId` INTEGER NOT NULL,
    `processedById` INTEGER NULL,

    UNIQUE INDEX `payments_paymentId_key`(`paymentId`),
    INDEX `payments_method_idx`(`method`),
    INDEX `payments_paidAt_idx`(`paidAt`),
    INDEX `payments_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `schools` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `principal` VARCHAR(191) NULL,
    `established` DATETIME(3) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdById` INTEGER NULL,

    UNIQUE INDEX `schools_code_key`(`code`),
    INDEX `schools_code_idx`(`code`),
    INDEX `schools_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `rollNo` VARCHAR(191) NOT NULL,
    `class` VARCHAR(191) NOT NULL,
    `section` VARCHAR(191) NOT NULL,
    `dateOfBirth` DATETIME(3) NULL,
    `gender` ENUM('MALE', 'FEMALE', 'OTHER') NULL,
    `address` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `parentName` VARCHAR(191) NULL,
    `parentPhone` VARCHAR(191) NULL,
    `parentEmail` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `schoolId` INTEGER NOT NULL,
    `createdById` INTEGER NULL,

    INDEX `students_class_section_idx`(`class`, `section`),
    INDEX `students_rollNo_idx`(`rollNo`),
    INDEX `students_schoolId_idx`(`schoolId`),
    UNIQUE INDEX `students_rollNo_class_section_schoolId_key`(`rollNo`, `class`, `section`, `schoolId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `credits` INTEGER NULL DEFAULT 1,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `subjects_code_key`(`code`),
    INDEX `subjects_code_idx`(`code`),
    INDEX `subjects_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_settings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `key` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `system_settings_key_key`(`key`),
    INDEX `system_settings_key_idx`(`key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCHOOL_ADMIN', 'TEACHER', 'STUDENT', 'PARENT') NOT NULL DEFAULT 'STUDENT',
    `name` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    INDEX `users_email_idx`(`email`),
    INDEX `users_role_idx`(`role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraints
ALTER TABLE `bills` ADD CONSTRAINT `bills_examFeeId_fkey` FOREIGN KEY (`examFeeId`) REFERENCES `exam_fees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `bills` ADD CONSTRAINT `bills_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `certificate_bills` ADD CONSTRAINT `certificate_bills_certificateFeeId_fkey` FOREIGN KEY (`certificateFeeId`) REFERENCES `certificate_fees`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `certificate_bills` ADD CONSTRAINT `certificate_bills_certificateId_fkey` FOREIGN KEY (`certificateId`) REFERENCES `certificates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `certificate_bills` ADD CONSTRAINT `certificate_bills_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `certificate_fees` ADD CONSTRAINT `certificate_fees_feeStructureId_fkey` FOREIGN KEY (`feeStructureId`) REFERENCES `fee_structures`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `certificate_fees` ADD CONSTRAINT `certificate_fees_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `certificate_payments` ADD CONSTRAINT `certificate_payments_certificateBillId_fkey` FOREIGN KEY (`certificateBillId`) REFERENCES `certificate_bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `certificate_payments` ADD CONSTRAINT `certificate_payments_processedById_fkey` FOREIGN KEY (`processedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `certificate_templates` ADD CONSTRAINT `certificate_templates_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `certificates` ADD CONSTRAINT `certificates_examResultId_fkey` FOREIGN KEY (`examResultId`) REFERENCES `exam_results`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_issuedById_fkey` FOREIGN KEY (`issuedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `certificates` ADD CONSTRAINT `certificates_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `certificate_templates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `exam_fees` ADD CONSTRAINT `exam_fees_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `exam_fees` ADD CONSTRAINT `exam_fees_feeStructureId_fkey` FOREIGN KEY (`feeStructureId`) REFERENCES `fee_structures`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `exam_fees` ADD CONSTRAINT `exam_fees_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `exam_results` ADD CONSTRAINT `exam_results_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `exam_results` ADD CONSTRAINT `exam_results_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `exam_subject_results` ADD CONSTRAINT `exam_subject_results_examResultId_fkey` FOREIGN KEY (`examResultId`) REFERENCES `exam_results`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `exam_subject_results` ADD CONSTRAINT `exam_subject_results_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `exam_subjects` ADD CONSTRAINT `exam_subjects_examId_fkey` FOREIGN KEY (`examId`) REFERENCES `exams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `exam_subjects` ADD CONSTRAINT `exam_subjects_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `exams` ADD CONSTRAINT `exams_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `exams` ADD CONSTRAINT `exams_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `fee_structures` ADD CONSTRAINT `fee_structures_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `fee_structures` ADD CONSTRAINT `fee_structures_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `marks` ADD CONSTRAINT `marks_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `marks` ADD CONSTRAINT `marks_subjectId_fkey` FOREIGN KEY (`subjectId`) REFERENCES `subjects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `payments` ADD CONSTRAINT `payments_billId_fkey` FOREIGN KEY (`billId`) REFERENCES `bills`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `payments` ADD CONSTRAINT `payments_processedById_fkey` FOREIGN KEY (`processedById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `schools` ADD CONSTRAINT `schools_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `students` ADD CONSTRAINT `students_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE `students` ADD CONSTRAINT `students_schoolId_fkey` FOREIGN KEY (`schoolId`) REFERENCES `schools`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Display confirmation
SELECT 'Database schema initialized successfully!' AS Status;