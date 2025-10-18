-- =====================================================
-- AI SCHOOL DASHBOARD - DATABASE SCHEMA
-- Version: 1.0
-- Database: PostgreSQL 16+
-- Description: Main schema creation script
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables (for development only)
-- CAUTION: This will delete all data!
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS grades CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS teachers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Drop custom types
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS gender_type CASCADE;
DROP TYPE IF EXISTS exam_type CASCADE;
DROP TYPE IF EXISTS attendance_status CASCADE;

-- =====================================================
-- CREATE CUSTOM TYPES
-- =====================================================

-- User roles enum
CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'parent', 'student');

-- Gender enum
CREATE TYPE gender_type AS ENUM ('M', 'F', 'Other');

-- Exam type enum
CREATE TYPE exam_type AS ENUM ('midterm', 'final', 'quiz', 'assignment', 'project');

-- Attendance status enum
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- =====================================================
-- TABLE 1: USERS (Authentication & Authorization)
-- =====================================================

CREATE TABLE users (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Authentication fields
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    
    -- Authorization
    role user_role NOT NULL DEFAULT 'student',
    
    -- Account status
    is_active BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Indexes for users table
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- Comments
COMMENT ON TABLE users IS 'Stores authentication and authorization data for all system users';
COMMENT ON COLUMN users.email IS 'Unique email address used for login';
COMMENT ON COLUMN users.password_hash IS 'Bcrypt hashed password (never store plain text)';
COMMENT ON COLUMN users.role IS 'User role: admin, teacher, parent, or student';

-- =====================================================
-- TABLE 2: TEACHERS
-- =====================================================

CREATE TABLE teachers (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Key to users
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    
    -- Professional information
    department VARCHAR(100),
    phone VARCHAR(20),
    hire_date DATE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_teacher_name CHECK (
        LENGTH(TRIM(first_name)) > 0 AND 
        LENGTH(TRIM(last_name)) > 0
    )
);

-- Indexes for teachers table
CREATE INDEX idx_teachers_user ON teachers(user_id);
CREATE INDEX idx_teachers_department ON teachers(department);
CREATE INDEX idx_teachers_name ON teachers(first_name, last_name);

-- Comments
COMMENT ON TABLE teachers IS 'Stores detailed information about teachers';
COMMENT ON COLUMN teachers.user_id IS 'Links to users table for authentication';
COMMENT ON COLUMN teachers.department IS 'Teaching department/subject area';

-- =====================================================
-- TABLE 3: CLASSES
-- =====================================================

CREATE TABLE classes (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Class information
    name VARCHAR(100) NOT NULL,
    grade_level INTEGER NOT NULL,
    academic_year INTEGER NOT NULL,
    
    -- Teacher assignment
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    
    -- Classroom info
    room_number VARCHAR(50),
    max_students INTEGER DEFAULT 40,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_grade_level CHECK (grade_level >= 6 AND grade_level <= 12),
    CONSTRAINT check_max_students CHECK (max_students > 0 AND max_students <= 50),
    CONSTRAINT unique_class_year UNIQUE (name, academic_year)
);

-- Indexes for classes table
CREATE INDEX idx_classes_teacher ON classes(teacher_id);
CREATE INDEX idx_classes_year ON classes(academic_year);
CREATE INDEX idx_classes_grade ON classes(grade_level);
CREATE INDEX idx_classes_name ON classes(name);

-- Comments
COMMENT ON TABLE classes IS 'Represents school classes/homerooms';
COMMENT ON COLUMN classes.grade_level IS 'Grade level 6-12 (middle and high school)';
COMMENT ON COLUMN classes.academic_year IS 'Academic year (e.g., 2024 for 2024-2025)';
COMMENT ON CONSTRAINT unique_class_year ON classes IS 'Class name must be unique per academic year';

-- =====================================================
-- TABLE 4: STUDENTS
-- =====================================================

CREATE TABLE students (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Key to users
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Personal information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender gender_type,
    
    -- Class assignment
    class_id UUID REFERENCES classes(id) ON DELETE SET NULL,
    
    -- Contact information
    phone VARCHAR(20),
    address TEXT,
    
    -- Parent/Guardian information
    parent_name VARCHAR(200),
    parent_phone VARCHAR(20),
    parent_email VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_student_age CHECK (
        date_of_birth <= CURRENT_DATE - INTERVAL '10 years' AND
        date_of_birth >= CURRENT_DATE - INTERVAL '25 years'
    ),
    CONSTRAINT check_student_name CHECK (
        LENGTH(TRIM(first_name)) > 0 AND 
        LENGTH(TRIM(last_name)) > 0
    )
);

-- Indexes for students table
CREATE INDEX idx_students_user ON students(user_id);
CREATE INDEX idx_students_class ON students(class_id);
CREATE INDEX idx_students_name ON students(first_name, last_name);
CREATE INDEX idx_students_dob ON students(date_of_birth);

-- Comments
COMMENT ON TABLE students IS 'Stores detailed information about students';
COMMENT ON COLUMN students.user_id IS 'Links to users table for authentication';
COMMENT ON COLUMN students.class_id IS 'Current class assignment (can be NULL for new students)';
COMMENT ON CONSTRAINT check_student_age ON students IS 'Students must be between 10-25 years old';

-- =====================================================
-- TABLE 5: COURSES
-- =====================================================

CREATE TABLE courses (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Course information
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    description TEXT,
    
    -- Assignment
    teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
    
    -- Academic info
    semester INTEGER NOT NULL,
    academic_year INTEGER NOT NULL,
    credits INTEGER DEFAULT 1,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_semester CHECK (semester IN (1, 2)),
    CONSTRAINT check_credits CHECK (credits > 0 AND credits <= 10),
    CONSTRAINT unique_course_class_semester UNIQUE (code, class_id, semester, academic_year)
);

-- Indexes for courses table
CREATE INDEX idx_courses_teacher ON courses(teacher_id);
CREATE INDEX idx_courses_class ON courses(class_id);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_year_semester ON courses(academic_year, semester);

-- Comments
COMMENT ON TABLE courses IS 'Represents courses taught in specific classes';
COMMENT ON COLUMN courses.code IS 'Unique course code (e.g., MATH101)';
COMMENT ON COLUMN courses.semester IS 'Semester number (1 or 2)';
COMMENT ON COLUMN courses.credits IS 'Number of credits for the course';

-- =====================================================
-- TABLE 6: GRADES
-- =====================================================

CREATE TABLE grades (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Keys
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    -- Grade information
    grade DECIMAL(5, 2) NOT NULL,
    exam_type exam_type NOT NULL,
    exam_date DATE NOT NULL,
    
    -- Weighting for average calculation
    weight DECIMAL(3, 2) DEFAULT 1.0,
    
    -- Additional info
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_grade_range CHECK (grade >= 0 AND grade <= 10),
    CONSTRAINT check_weight CHECK (weight > 0 AND weight <= 2.0),
    CONSTRAINT check_exam_date CHECK (exam_date <= CURRENT_DATE)
);

-- Indexes for grades table
CREATE INDEX idx_grades_student ON grades(student_id);
CREATE INDEX idx_grades_course ON grades(course_id);
CREATE INDEX idx_grades_date ON grades(exam_date);
CREATE INDEX idx_grades_type ON grades(exam_type);
CREATE INDEX idx_grades_student_course ON grades(student_id, course_id);

-- Comments
COMMENT ON TABLE grades IS 'Stores student grades for courses';
COMMENT ON COLUMN grades.grade IS 'Grade value on 0-10 scale';
COMMENT ON COLUMN grades.exam_type IS 'Type of assessment: midterm, final, quiz, assignment, project';
COMMENT ON COLUMN grades.weight IS 'Weight multiplier for calculating weighted average';

-- =====================================================
-- TABLE 7: ATTENDANCE
-- =====================================================

CREATE TABLE attendance (
    -- Primary Key
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Foreign Keys
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
    
    -- Attendance information
    date DATE NOT NULL,
    status attendance_status NOT NULL,
    
    -- Additional info
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT check_attendance_date CHECK (date <= CURRENT_DATE)
);

-- Indexes for attendance table
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_course ON attendance(course_id);

-- Unique constraint for daily general attendance (when course_id is NULL)
CREATE UNIQUE INDEX idx_unique_daily_attendance 
ON attendance(student_id, date) 
WHERE course_id IS NULL;

-- Comments
COMMENT ON TABLE attendance IS 'Tracks student attendance records';
COMMENT ON COLUMN attendance.course_id IS 'NULL for general attendance, set for course-specific attendance';
COMMENT ON COLUMN attendance.status IS 'Attendance status: present, absent, late, excused';
COMMENT ON INDEX idx_unique_daily_attendance ON attendance IS 'Ensures one daily attendance record per student when not course-specific';

-- =====================================================
-- CREATE TRIGGER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON classes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at BEFORE UPDATE ON attendance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Student summary with class info
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

COMMENT ON VIEW v_student_summary IS 'Quick overview of students with class and teacher info';

-- View: Course enrollment count
CREATE OR REPLACE VIEW v_course_enrollment AS
SELECT 
    c.id AS course_id,
    c.name AS course_name,
    c.code,
    cl.name AS class_name,
    t.first_name || ' ' || t.last_name AS teacher_name,
    COUNT(DISTINCT g.student_id) AS enrolled_students,
    c.academic_year,
    c.semester
FROM courses c
LEFT JOIN grades g ON c.id = g.course_id
LEFT JOIN classes cl ON c.class_id = cl.id
LEFT JOIN teachers t ON c.teacher_id = t.id
GROUP BY c.id, c.name, c.code, cl.name, t.first_name, t.last_name, c.academic_year, c.semester;

COMMENT ON VIEW v_course_enrollment IS 'Shows course enrollment statistics';

-- View: Attendance rate by student
CREATE OR REPLACE VIEW v_attendance_rate AS
SELECT 
    s.id AS student_id,
    s.first_name || ' ' || s.last_name AS student_name,
    c.name AS class_name,
    COUNT(*) AS total_days,
    COUNT(*) FILTER (WHERE a.status = 'present') AS present_days,
    COUNT(*) FILTER (WHERE a.status = 'absent') AS absent_days,
    COUNT(*) FILTER (WHERE a.status = 'late') AS late_days,
    COUNT(*) FILTER (WHERE a.status = 'excused') AS excused_days,
    ROUND(
        COUNT(*) FILTER (WHERE a.status = 'present') * 100.0 / NULLIF(COUNT(*), 0),
        2
    ) AS attendance_rate
FROM students s
LEFT JOIN attendance a ON s.id = a.student_id
LEFT JOIN classes c ON s.class_id = c.id
GROUP BY s.id, s.first_name, s.last_name, c.name;

COMMENT ON VIEW v_attendance_rate IS 'Calculates attendance rate percentage for each student';

-- =====================================================
-- GRANT PERMISSIONS (Adjust based on your needs)
-- =====================================================

-- Create application user (example)
-- CREATE USER school_app WITH PASSWORD 'your_secure_password';
-- GRANT CONNECT ON DATABASE school_dashboard TO school_app;
-- GRANT USAGE ON SCHEMA public TO school_app;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO school_app;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO school_app;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Check all indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check all constraints
SELECT conname, contype, conrelid::regclass AS table_name
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, conname;

-- =====================================================
-- END OF SCHEMA CREATION
-- =====================================================

-- Success message
DO $$ 
BEGIN 
    RAISE NOTICE 'Database schema created successfully!';
    RAISE NOTICE 'Tables: users, teachers, classes, students, courses, grades, attendance';
    RAISE NOTICE 'Views: v_student_summary, v_course_enrollment, v_attendance_rate';
    RAISE NOTICE 'Next step: Run seed data script';
END $$;
