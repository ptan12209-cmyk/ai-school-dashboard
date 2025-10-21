-- ===================================================
-- CHECK DATABASE STATUS BEFORE MIGRATION
-- ===================================================
-- Chạy script này để kiểm tra trạng thái hiện tại của database
-- trước khi chạy migration
-- ===================================================

\echo '=================================================='
\echo 'CHECKING CURRENT DATABASE STATUS'
\echo '=================================================='

-- Check courses.semester column
\echo ''
\echo '1. COURSES TABLE - SEMESTER COLUMN:'
SELECT 
  column_name,
  data_type,
  character_maximum_length,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'courses' AND column_name = 'semester';

-- Check sample semester values
\echo ''
\echo '2. SAMPLE SEMESTER VALUES:'
SELECT semester, COUNT(*) as count 
FROM courses 
GROUP BY semester 
ORDER BY semester;

-- Check if columns already exist
\echo ''
\echo '3. NEW COLUMNS STATUS (should not exist yet):'
SELECT 
  table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name IN ('classes', 'courses', 'grades', 'attendance')
  AND column_name IN ('school_year', 'is_active', 'subject', 'score', 'letter_grade', 
                      'grade_type', 'semester', 'graded_date', 'is_published', 
                      'check_in_time', 'marked_by')
ORDER BY table_name, column_name;

-- Check existing views
\echo ''
\echo '4. EXISTING VIEWS (will be dropped and recreated):'
SELECT 
  table_name as view_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('v_student_summary', 'v_course_enrollment', 'v_attendance_rate');

\echo ''
\echo '=================================================='
\echo 'STATUS CHECK COMPLETE'
\echo '=================================================='
