# 🗄️ DATABASE DESIGN - AI SCHOOL DASHBOARD

## 📊 ENTITY RELATIONSHIP DIAGRAM (ERD)

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   USERS     │       │  STUDENTS   │       │   CLASSES   │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │◄──────┤ user_id(FK) │       │ id (PK)     │
│ email       │       │ id (PK)     │──────►│ name        │
│ password    │       │ first_name  │       │ grade_level │
│ role        │       │ last_name   │       │ teacher_id  │
│ created_at  │       │ dob         │       │ academic_yr │
└─────────────┘       │ class_id(FK)│◄──────┤ created_at  │
       │              │ created_at  │       └─────────────┘
       │              └─────────────┘              │
       │                     │                     │
       │                     │                     │
       │              ┌──────┴──────┐             │
       │              │             │             │
       │              ▼             ▼             │
       │       ┌─────────────┐ ┌─────────────┐   │
       │       │   GRADES    │ │ ATTENDANCE  │   │
       │       ├─────────────┤ ├─────────────┤   │
       │       │ id (PK)     │ │ id (PK)     │   │
       │       │ student_id  │ │ student_id  │   │
       │       │ course_id   │ │ date        │   │
       │       │ grade       │ │ status      │   │
       │       │ exam_type   │ │ notes       │   │
       │       │ exam_date   │ │ created_at  │   │
       │       └─────────────┘ └─────────────┘   │
       │                                          │
       │                                          │
       └──────►┌─────────────┐◄──────────────────┘
               │  TEACHERS   │
               ├─────────────┤
               │ id (PK)     │
               │ user_id(FK) │
               │ first_name  │
               │ last_name   │
               │ department  │
               │ created_at  │
               └─────────────┘
                      │
                      │
                      ▼
               ┌─────────────┐
               │  COURSES    │
               ├─────────────┤
               │ id (PK)     │
               │ name        │
               │ code        │
               │ teacher_id  │
               │ class_id    │
               │ semester    │
               │ created_at  │
               └─────────────┘
```

## 📋 BẢNG CHI TIẾT

### 1. **users** - Bảng người dùng (Authentication)
Lưu thông tin đăng nhập và phân quyền cho tất cả người dùng trong hệ thống.

| Column       | Type         | Constraints              | Description                    |
|--------------|--------------|--------------------------|--------------------------------|
| id           | UUID         | PRIMARY KEY              | Unique identifier              |
| email        | VARCHAR(255) | UNIQUE, NOT NULL         | Email đăng nhập                |
| password_hash| VARCHAR(255) | NOT NULL                 | Mật khẩu đã hash (bcrypt)      |
| role         | ENUM         | NOT NULL                 | admin/teacher/parent/student   |
| is_active    | BOOLEAN      | DEFAULT true             | Trạng thái tài khoản           |
| created_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian tạo                  |
| updated_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian cập nhật             |

**Indexes:**
- `idx_users_email` ON (email)
- `idx_users_role` ON (role)

**Business Rules:**
- Email phải unique và valid format
- Password phải >= 8 ký tự
- Role mặc định là 'student'

---

### 2. **students** - Bảng học sinh
Thông tin chi tiết về học sinh.

| Column       | Type         | Constraints              | Description                    |
|--------------|--------------|--------------------------|--------------------------------|
| id           | UUID         | PRIMARY KEY              | Unique identifier              |
| user_id      | UUID         | FOREIGN KEY → users(id)  | Liên kết với bảng users        |
| first_name   | VARCHAR(100) | NOT NULL                 | Tên                            |
| last_name    | VARCHAR(100) | NOT NULL                 | Họ                             |
| date_of_birth| DATE         | NOT NULL                 | Ngày sinh                      |
| gender       | ENUM         | CHECK(M/F/Other)         | Giới tính                      |
| class_id     | UUID         | FOREIGN KEY → classes(id)| Lớp hiện tại                   |
| phone        | VARCHAR(20)  | NULL                     | Số điện thoại                  |
| address      | TEXT         | NULL                     | Địa chỉ                        |
| parent_name  | VARCHAR(200) | NULL                     | Tên phụ huynh                  |
| parent_phone | VARCHAR(20)  | NULL                     | SĐT phụ huynh                  |
| created_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian tạo                  |
| updated_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian cập nhật             |

**Indexes:**
- `idx_students_class` ON (class_id)
- `idx_students_user` ON (user_id)
- `idx_students_name` ON (first_name, last_name)

**Business Rules:**
- Mỗi user_id chỉ được liên kết với 1 student
- date_of_birth phải >= 10 năm trước
- class_id có thể NULL (học sinh mới chưa xếp lớp)

---

### 3. **teachers** - Bảng giáo viên
Thông tin chi tiết về giáo viên.

| Column       | Type         | Constraints              | Description                    |
|--------------|--------------|--------------------------|--------------------------------|
| id           | UUID         | PRIMARY KEY              | Unique identifier              |
| user_id      | UUID         | FOREIGN KEY → users(id)  | Liên kết với bảng users        |
| first_name   | VARCHAR(100) | NOT NULL                 | Tên                            |
| last_name    | VARCHAR(100) | NOT NULL                 | Họ                             |
| department   | VARCHAR(100) | NULL                     | Khoa/Bộ môn                    |
| phone        | VARCHAR(20)  | NULL                     | Số điện thoại                  |
| hire_date    | DATE         | NULL                     | Ngày bắt đầu làm việc          |
| created_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian tạo                  |
| updated_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian cập nhật             |

**Indexes:**
- `idx_teachers_user` ON (user_id)
- `idx_teachers_department` ON (department)

**Business Rules:**
- Mỗi user_id chỉ được liên kết với 1 teacher
- department có thể NULL nếu là giáo viên thay thế

---

### 4. **classes** - Bảng lớp học
Thông tin về các lớp học.

| Column       | Type         | Constraints              | Description                    |
|--------------|--------------|--------------------------|--------------------------------|
| id           | UUID         | PRIMARY KEY              | Unique identifier              |
| name         | VARCHAR(100) | NOT NULL                 | Tên lớp (VD: 10A1)             |
| grade_level  | INTEGER      | CHECK(1-12)              | Khối (6-12)                    |
| teacher_id   | UUID         | FOREIGN KEY → teachers(id)| Giáo viên chủ nhiệm           |
| academic_year| INTEGER      | NOT NULL                 | Năm học (VD: 2024)             |
| room_number  | VARCHAR(50)  | NULL                     | Phòng học                      |
| max_students | INTEGER      | DEFAULT 40               | Sĩ số tối đa                   |
| created_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian tạo                  |
| updated_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian cập nhật             |

**Indexes:**
- `idx_classes_teacher` ON (teacher_id)
- `idx_classes_year` ON (academic_year)
- `idx_classes_grade` ON (grade_level)

**Business Rules:**
- Tên lớp phải unique trong cùng academic_year
- grade_level phải trong khoảng 6-12 (cấp 2-3)
- max_students mặc định 40, có thể điều chỉnh

---

### 5. **courses** - Bảng môn học
Danh sách các môn học và phân công giảng dạy.

| Column       | Type         | Constraints              | Description                    |
|--------------|--------------|--------------------------|--------------------------------|
| id           | UUID         | PRIMARY KEY              | Unique identifier              |
| name         | VARCHAR(100) | NOT NULL                 | Tên môn (VD: Toán học)         |
| code         | VARCHAR(20)  | UNIQUE, NOT NULL         | Mã môn (VD: MATH101)           |
| teacher_id   | UUID         | FOREIGN KEY → teachers(id)| Giáo viên phụ trách           |
| class_id     | UUID         | FOREIGN KEY → classes(id)| Lớp học môn này                |
| semester     | INTEGER      | CHECK(1,2)               | Học kỳ (1 hoặc 2)              |
| academic_year| INTEGER      | NOT NULL                 | Năm học                        |
| credits      | INTEGER      | DEFAULT 1                | Số tín chỉ                     |
| created_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian tạo                  |
| updated_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian cập nhật             |

**Indexes:**
- `idx_courses_teacher` ON (teacher_id)
- `idx_courses_class` ON (class_id)
- `idx_courses_code` ON (code)

**Business Rules:**
- Mã môn (code) phải unique
- Một môn học có thể được dạy bởi nhiều giáo viên (các lớp khác nhau)
- semester phải là 1 hoặc 2

---

### 6. **grades** - Bảng điểm số
Lưu trữ điểm số của học sinh cho từng môn.

| Column       | Type         | Constraints              | Description                    |
|--------------|--------------|--------------------------|--------------------------------|
| id           | UUID         | PRIMARY KEY              | Unique identifier              |
| student_id   | UUID         | FOREIGN KEY → students(id)| Học sinh                      |
| course_id    | UUID         | FOREIGN KEY → courses(id)| Môn học                        |
| grade        | DECIMAL(5,2) | CHECK(0-10)              | Điểm số (thang 10)             |
| exam_type    | ENUM         | NOT NULL                 | midterm/final/quiz/assignment  |
| exam_date    | DATE         | NOT NULL                 | Ngày thi/nộp bài               |
| weight       | DECIMAL(3,2) | DEFAULT 1.0              | Trọng số (để tính điểm TB)     |
| notes        | TEXT         | NULL                     | Ghi chú của giáo viên          |
| created_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian tạo                  |
| updated_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian cập nhật             |

**Indexes:**
- `idx_grades_student` ON (student_id)
- `idx_grades_course` ON (course_id)
- `idx_grades_date` ON (exam_date)
- `idx_grades_student_course` ON (student_id, course_id)

**Business Rules:**
- Điểm số phải trong khoảng 0-10
- exam_type phải thuộc danh sách cho phép
- weight mặc định 1.0, dùng để tính điểm trung bình có trọng số

---

### 7. **attendance** - Bảng điểm danh
Theo dõi chuyên cần của học sinh.

| Column       | Type         | Constraints              | Description                    |
|--------------|--------------|--------------------------|--------------------------------|
| id           | UUID         | PRIMARY KEY              | Unique identifier              |
| student_id   | UUID         | FOREIGN KEY → students(id)| Học sinh                      |
| course_id    | UUID         | FOREIGN KEY → courses(id)| Môn học (NULL = điểm danh chung)|
| date         | DATE         | NOT NULL                 | Ngày điểm danh                 |
| status       | ENUM         | NOT NULL                 | present/absent/late/excused    |
| notes        | TEXT         | NULL                     | Ghi chú (lý do vắng...)        |
| created_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian tạo                  |
| updated_at   | TIMESTAMP    | DEFAULT CURRENT_TIMESTAMP| Thời gian cập nhật             |

**Indexes:**
- `idx_attendance_student` ON (student_id)
- `idx_attendance_date` ON (date)
- `idx_attendance_student_date` ON (student_id, date)
- `idx_attendance_course` ON (course_id)

**Business Rules:**
- Một học sinh chỉ có 1 record điểm danh/ngày (nếu course_id = NULL)
- Nếu course_id khác NULL, có thể có nhiều record/ngày (điểm danh từng tiết)
- status phải thuộc danh sách: present/absent/late/excused

---

## 🔗 QUAN HỆ GIỮA CÁC BẢNG

1. **users ↔ students/teachers**: One-to-One
   - Một user chỉ có thể là student HOẶC teacher
   - user.role xác định loại

2. **classes ↔ students**: One-to-Many
   - Một lớp có nhiều học sinh
   - Một học sinh thuộc một lớp

3. **teachers ↔ classes**: One-to-Many
   - Một giáo viên chủ nhiệm nhiều lớp
   - Một lớp có một GVCN

4. **courses ↔ classes**: Many-to-One
   - Một lớp có nhiều môn học
   - Một môn học thuộc một lớp cụ thể

5. **students ↔ grades**: One-to-Many
   - Một học sinh có nhiều điểm
   - Một điểm thuộc một học sinh

6. **courses ↔ grades**: One-to-Many
   - Một môn có nhiều điểm (của nhiều học sinh)
   - Một điểm thuộc một môn

7. **students ↔ attendance**: One-to-Many
   - Một học sinh có nhiều bản ghi điểm danh
   - Một bản ghi thuộc một học sinh

---

## 📐 CONSTRAINTS & VALIDATION RULES

### Database Level Constraints:
```sql
-- Check grade range
ALTER TABLE grades ADD CONSTRAINT check_grade_range 
CHECK (grade >= 0 AND grade <= 10);

-- Check age
ALTER TABLE students ADD CONSTRAINT check_student_age 
CHECK (date_of_birth <= CURRENT_DATE - INTERVAL '10 years');

-- Check grade level
ALTER TABLE classes ADD CONSTRAINT check_grade_level 
CHECK (grade_level >= 6 AND grade_level <= 12);

-- Unique class name per year
ALTER TABLE classes ADD CONSTRAINT unique_class_year 
UNIQUE (name, academic_year);

-- Unique attendance per student per day (general)
ALTER TABLE attendance ADD CONSTRAINT unique_attendance_student_date 
UNIQUE (student_id, date) WHERE course_id IS NULL;
```

### Application Level Validations:
- Email format validation (regex)
- Password strength (min 8 chars, 1 uppercase, 1 number)
- Phone number format (Vietnamese format)
- Future date prevention (exam_date, attendance date)

---

## 🎯 INDEXES STRATEGY

### Priority 1 (Most Critical):
- Foreign keys (auto-indexed)
- Search fields (email, name)
- Filter fields (date, class_id, course_id)

### Priority 2 (Nice to Have):
- Composite indexes for common queries
- Sorting fields (created_at)

### Query Examples:
```sql
-- Get all students in a class with their grades
SELECT s.*, g.grade, c.name as course_name
FROM students s
JOIN grades g ON s.id = g.student_id
JOIN courses c ON g.course_id = c.id
WHERE s.class_id = ?;
-- Uses: idx_students_class, idx_grades_student

-- Calculate attendance rate
SELECT s.id, s.first_name, 
       COUNT(CASE WHEN a.status = 'present' THEN 1 END) * 100.0 / COUNT(*) as rate
FROM students s
JOIN attendance a ON s.id = a.student_id
WHERE a.date BETWEEN ? AND ?
GROUP BY s.id;
-- Uses: idx_attendance_student_date
```

---

## 📊 DATA VOLUME ESTIMATES (1000 students)

| Table      | Estimated Rows | Growth Rate    |
|------------|----------------|----------------|
| users      | ~1,200         | +100/year      |
| students   | ~1,000         | +200/year      |
| teachers   | ~50            | +5/year        |
| classes    | ~30            | Stable         |
| courses    | ~300           | Stable         |
| grades     | ~50,000        | +10,000/year   |
| attendance | ~180,000       | +36,000/year   |

**Storage Estimate**: ~500 MB/year (without AI data)

---

## 🔐 SECURITY CONSIDERATIONS

1. **Passwords**: NEVER store plain text, always bcrypt hash
2. **PII Data**: Encrypt sensitive fields (phone, address)
3. **Access Control**: Row-level security based on user role
4. **Audit Trail**: Log all changes to grades
5. **Soft Delete**: Use `deleted_at` instead of hard delete

---

## 🚀 MIGRATION STRATEGY

1. Create tables in order (respect FK dependencies):
   - users → teachers, classes
   - students → courses
   - grades, attendance

2. Seed in order:
   - Admin user → Teachers → Classes
   - Students → Courses
   - Mock grades & attendance

3. Create indexes AFTER bulk insert

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Next Review**: After Phase 1 Testing
