-- Add workflow_type column to appoinments table
-- Options: Schedule, Walk_In
-- Run this on database: heathcare_db

ALTER TABLE `appoinments`
ADD COLUMN `workflow_type` VARCHAR(50) NULL DEFAULT NULL AFTER `visit_type`;
