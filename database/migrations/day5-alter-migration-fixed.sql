-- ===================================================
-- Day 5: ALTER MIGRATION - FIXED VERSION V2
-- ===================================================
-- Drop views first, then alter tables, then recreate views
-- ===================================================

BEGIN;

-- ===================================================
-- STEP 1: DROP VIEWS TEMPORARILY
-- ===================================================

DROP VIEW IF EXISTS v_student_summary CASCADE;
DROP VIEW IF EXISTS v_course_enrollment CASCADE;
DROP VIEW IF EXISTS v_attendance_rate CASCADE;

-- ===================================================
-- STEP 2: ALTER CLASSES TABLE
-- ===================================================

ALTER TABLE classes 
  ADD COLUMN IF NOT EXISTS school_year VARCHAR(20) DEFAULT '2024-2025',
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update school_year from academic_year if exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'classes' AND column_name = 'academic_year'
  ) THEN
    UPDATE classes 
    SET school_year = academic_year::TEXT || '-' || (academic_year + 1)::TEXT
    WHERE school_year = '2024-2025';
  END IF;
END $$;

-- Add constraint for school_year format
ALTER TABLE classes 
  DROP CONSTRAINT IF EXISTS check_school_year_format;

ALTER TABLE classes 
  ADD CONSTRAINT check_school_year_format 
  CHECK (school_year ~ '^\d{4}-\d{4}$');

-- Update indexes
CREATE INDEX IF NOT EXISTS idx_classes_school_year ON classes(school_year);
CREATE INDEX IF NOT EXISTS idx_classes_is_active ON classes(is_active);

-- ===================================================
-- STEP 3: ALTER COURSES TABLE
-- ===================================================

-- Add new columns
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS subject VARCHAR(50),
  ADD COLUMN IF NOT EXISTS credits DECIMAL(3,1) DEFAULT 1.0,
  ADD COLUMN IF NOT EXISTS school_year VARCHAR(20) DEFAULT '2024-2025',
  ADD COLUMN IF NOT EXISTS schedule JSONB,
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Update subject from course name
UPDATE courses 
SET subject = COALESCE(
  CASE 
    WHEN name ILIKE '%math%' THEN 'Mathematics'
    WHEN name ILIKE '%science%' THEN 'Science'
    WHEN name ILIKE '%english%' THEN 'English'
    WHEN name ILIKE '%history%' THEN 'History'
    WHEN name ILIKE '%physics%' THEN 'Physics'
    WHEN name ILIKE '%chemistry%' THEN 'Chemistry'
    WHEN name ILIKE '%biology%' THEN 'Biology'
    ELSE 'General'
  END,
  'General'
)
WHERE subject IS NULL;

-- Make subject NOT NULL
ALTER TABLE courses 
  ALTER COLUMN subject SET NOT NULL;

-- Update school_year from academic_year
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'courses' AND column_name = 'academic_year'
  ) THEN
    UPDATE courses 
    SET school_year = academic_year::TEXT || '-' || (academic_year + 1)::TEXT
    WHERE school_year = '2024-2025';
  END IF;
END $$;

-- Convert semester from INTEGER to VARCHAR (SAFE VERSION)
DO $$ 
DECLARE
  current_data_type TEXT;
BEGIN
  -- Get current data type
  SELECT data_type INTO current_data_type
  FROM information_schema.columns 
  WHERE table_name = 'courses' 
  AND column_name = 'semester';
  
  -- Only convert if it's integer
  IF current_data_type = 'integer' THEN
    -- Add temporary column
    ALTER TABLE courses ADD COLUMN semester_temp VARCHAR(20);
    
    -- Copy and transform data
    UPDATE courses 
    SET semester_temp = CASE 
      WHEN semester = 1 THEN '1'
      WHEN semester = 2 THEN '2'
      ELSE 'Full Year'
    END;
    
    -- Drop old column and rename new one
    ALTER TABLE courses DROP COLUMN semester;
    ALTER TABLE courses RENAME COLUMN semester_temp TO semester;
    
  ELSIF current_data_type IN ('character varying', 'varchar', 'text') THEN
    -- Already varchar, just ensure the values are standardized
    UPDATE courses 
    SET semester = CASE 
      WHEN semester IN ('1', '1.0', 'Semester 1', 'Fall') THEN '1'
      WHEN semester IN ('2', '2.0', 'Semester 2', 'Spring') THEN '2'
      ELSE 'Full Year'
    END
    WHERE semester IS NOT NULL;
    
    -- Ensure column is VARCHAR(20)
    ALTER TABLE courses ALTER COLUMN semester TYPE VARCHAR(20);
  END IF;
END $$;

-- Add constraints
ALTER TABLE courses 
  DROP CONSTRAINT IF EXISTS check_credits_range;

ALTER TABLE courses 
  ADD CONSTRAINT check_credits_range 
  CHECK (credits >= 0.5 AND credits <= 10.0);

ALTER TABLE courses 
  DROP CONSTRAINT IF EXISTS check_semester_value;

ALTER TABLE courses 
  ADD CONSTRAINT check_semester_value 
  CHECK (semester IN ('1', '2', 'Full Year'));

-- Update indexes
CREATE INDEX IF NOT EXISTS idx_courses_subject ON courses(subject);
CREATE INDEX IF NOT EXISTS idx_courses_school_year ON courses(school_year);
CREATE INDEX IF NOT EXISTS idx_courses_is_active ON courses(is_active);

-- ===================================================
-- STEP 4: ALTER GRADES TABLE
-- ===================================================

-- Add new columns
ALTER TABLE grades
  ADD COLUMN IF NOT EXISTS score DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS letter_grade VARCHAR(2),
  ADD COLUMN IF NOT EXISTS grade_type VARCHAR(20),
  ADD COLUMN IF NOT EXISTS semester VARCHAR(10),
  ADD COLUMN IF NOT EXISTS graded_date DATE,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

-- Migrate old 'grade' to 'score' (0-10 to 0-100)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'grades' AND column_name = 'grade'
  ) THEN
    UPDATE grades 
    SET score = grade * 10
    WHERE score IS NULL;
  END IF;
END $$;

-- Map exam_type to grade_type
DO $$ 
BEGIN
  -- Check if exam_type exists and is enum
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'grades' AND column_name = 'exam_type'
  ) THEN
    UPDATE grades 
    SET grade_type = CASE 
      WHEN exam_type::TEXT = 'midterm' THEN 'Midterm'
      WHEN exam_type::TEXT = 'final' THEN 'Final'
      WHEN exam_type::TEXT = 'quiz' THEN 'Quiz'
      WHEN exam_type::TEXT = 'assignment' THEN 'Assignment'
      WHEN exam_type::TEXT = 'project' THEN 'Project'
      ELSE 'Assignment'
    END
    WHERE grade_type IS NULL;
  END IF;
END $$;

-- Set defaults
UPDATE grades SET semester = '1' WHERE semester IS NULL;
UPDATE grades SET graded_date = CURRENT_DATE WHERE graded_date IS NULL;

-- Set graded_date from exam_date
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'grades' AND column_name = 'exam_date'
  ) THEN
    UPDATE grades 
    SET graded_date = exam_date
    WHERE exam_date IS NOT NULL;
  END IF;
END $$;

-- Make required columns NOT NULL
ALTER TABLE grades 
  ALTER COLUMN score SET NOT NULL,
  ALTER COLUMN grade_type SET NOT NULL,
  ALTER COLUMN semester SET NOT NULL,
  ALTER COLUMN graded_date SET NOT NULL;

-- Add constraints
ALTER TABLE grades 
  DROP CONSTRAINT IF EXISTS check_score_range;

ALTER TABLE grades 
  ADD CONSTRAINT check_score_range 
  CHECK (score >= 0 AND score <= 100);

ALTER TABLE grades 
  DROP CONSTRAINT IF EXISTS check_grade_type_enum;

ALTER TABLE grades 
  ADD CONSTRAINT check_grade_type_enum 
  CHECK (grade_type IN ('Quiz', 'Test', 'Assignment', 'Project', 'Midterm', 'Final', 'Participation'));

ALTER TABLE grades 
  DROP CONSTRAINT IF EXISTS check_semester_enum;

ALTER TABLE grades 
  ADD CONSTRAINT check_semester_enum 
  CHECK (semester IN ('1', '2', 'Final'));

-- Update indexes
CREATE INDEX IF NOT EXISTS idx_grades_semester ON grades(semester);
CREATE INDEX IF NOT EXISTS idx_grades_graded_date ON grades(graded_date);
CREATE INDEX IF NOT EXISTS idx_grades_is_published ON grades(is_published);

-- ===================================================
-- STEP 5: ALTER ATTENDANCE TABLE
-- ===================================================

ALTER TABLE attendance
  ADD COLUMN IF NOT EXISTS check_in_time TIME,
  ADD COLUMN IF NOT EXISTS check_out_time TIME,
  ADD COLUMN IF NOT EXISTS marked_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Convert status from enum to VARCHAR if needed
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'attendance' 
    AND column_name = 'status'
    AND data_type = 'USER-DEFINED'
  ) THEN
    ALTER TABLE attendance ALTER COLUMN status TYPE VARCHAR(20) USING status::TEXT;
  END IF;
END $$;

-- Standardize status values
UPDATE attendance 
SET status = CASE 
  WHEN LOWER(status) = 'present' THEN 'Present'
  WHEN LOWER(status) = 'absent' THEN 'Absent'
  WHEN LOWER(status) = 'late' THEN 'Late'
  WHEN LOWER(status) = 'excused' THEN 'Excused'
  ELSE status
END;

-- Add constraint
ALTER TABLE attendance 
  DROP CONSTRAINT IF EXISTS check_status_enum;

ALTER TABLE attendance 
  ADD CONSTRAINT check_status_enum 
  CHECK (status IN ('Present', 'Absent', 'Late', 'Excused'));

CREATE INDEX IF NOT EXISTS idx_attendance_marked_by ON attendance(marked_by);

-- ===================================================
-- STEP 6: RECREATE VIEWS
-- ===================================================

-- View: Student summary
CREATE OR REPLACE VIEW v_student_summary AS
SELECT 
    s.id,
    s.first_name,
    s.last_name,
    s.date_of_birth,
    s.gender,
    c.name AS class_name,
    c.grade_level,
    t.first_name || ' ' || t.last_name AS homeroom_teacher,
    u.email,
    s.created_at
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LEFT JOIN teachers t ON c.teacher_id = t.id
JOIN users u ON s.user_id = u.id
WHERE u.is_active = true;

-- View: Course enrollment
CREATE OR REPLACE VIEW v_course_enrollment AS
SELECT 
    c.id AS course_id,
    c.name AS course_name,
    c.code,
    cl.name AS class_name,
    t.first_name || ' ' || t.last_name AS teacher_name,
    COUNT(DISTINCT g.student_id) AS enrolled_students,
    c.school_year,
    c.semester
FROM courses c
LEFT JOIN grades g ON c.id = g.course_id
LEFT JOIN classes cl ON c.class_id = cl.id
LEFT JOIN teachers t ON c.teacher_id = t.id
GROUP BY c.id, c.name, c.code, cl.name, t.first_name, t.last_name, c.school_year, c.semester;

-- View: Attendance rate
CREATE OR REPLACE VIEW v_attendance_rate AS
SELECT 
    s.id AS student_id,
    s.first_name || ' ' || s.last_name AS student_name,
    c.name AS class_name,
    COUNT(*) AS total_days,
    COUNT(*) FILTER (WHERE a.status = 'Present') AS present_days,
    COUNT(*) FILTER (WHERE a.status = 'Absent') AS absent_days,
    COUNT(*) FILTER (WHERE a.status = 'Late') AS late_days,
    COUNT(*) FILTER (WHERE a.status = 'Excused') AS excused_days,
    ROUND(
        COUNT(*) FILTER (WHERE a.status = 'Present') * 100.0 / NULLIF(COUNT(*), 0),
        2
    ) AS attendance_rate
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
LEFT JOIN classes c ON s.class_id = c.id
GROUP BY s.id, s.first_name, s.last_name, c.name;

COMMIT;

-- ===================================================
-- SUCCESS
-- ===================================================

SELECT '✅ Migration completed successfully!' AS status;

-- Show updated columns
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