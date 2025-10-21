-- ===================================================
-- ROLLBACK SCRIPT
-- ===================================================
-- Chạy script này nếu migration gặp lỗi và cần rollback
-- ===================================================

BEGIN;

\echo 'Starting rollback...'

-- Drop views if they exist
DROP VIEW IF EXISTS v_student_summary CASCADE;
DROP VIEW IF EXISTS v_course_enrollment CASCADE;
DROP VIEW IF EXISTS v_attendance_rate CASCADE;

-- Remove new columns from classes
ALTER TABLE classes 
  DROP COLUMN IF EXISTS school_year CASCADE,
  DROP COLUMN IF EXISTS is_active CASCADE;

-- Remove new columns from courses
ALTER TABLE courses 
  DROP COLUMN IF EXISTS subject CASCADE,
  DROP COLUMN IF EXISTS credits CASCADE,
  DROP COLUMN IF EXISTS school_year CASCADE,
  DROP COLUMN IF EXISTS schedule CASCADE,
  DROP COLUMN IF EXISTS is_active CASCADE;

-- If semester was converted, you may need to manually fix it
-- Check current type first with: 
-- SELECT data_type FROM information_schema.columns WHERE table_name='courses' AND column_name='semester';

-- Remove new columns from grades
ALTER TABLE grades
  DROP COLUMN IF EXISTS score CASCADE,
  DROP COLUMN IF EXISTS letter_grade CASCADE,
  DROP COLUMN IF EXISTS grade_type CASCADE,
  DROP COLUMN IF EXISTS semester CASCADE,
  DROP COLUMN IF EXISTS graded_date CASCADE,
  DROP COLUMN IF EXISTS notes CASCADE,
  DROP COLUMN IF EXISTS is_published CASCADE;

-- Remove new columns from attendance
ALTER TABLE attendance
  DROP COLUMN IF EXISTS check_in_time CASCADE,
  DROP COLUMN IF EXISTS check_out_time CASCADE,
  DROP COLUMN IF EXISTS marked_by CASCADE;

-- Drop indexes
DROP INDEX IF EXISTS idx_classes_school_year;
DROP INDEX IF EXISTS idx_classes_is_active;
DROP INDEX IF EXISTS idx_courses_subject;
DROP INDEX IF EXISTS idx_courses_school_year;
DROP INDEX IF EXISTS idx_courses_is_active;
DROP INDEX IF EXISTS idx_grades_semester;
DROP INDEX IF EXISTS idx_grades_graded_date;
DROP INDEX IF EXISTS idx_grades_is_published;
DROP INDEX IF EXISTS idx_attendance_marked_by;

COMMIT;

SELECT '✅ Rollback completed!' AS status;
