"""
AI School Dashboard - Mock Data Generator (Fixed Version)
==========================================
Generates realistic test data for development and testing.

Requirements:
    pip install faker psycopg2-binary python-dotenv

Usage:
    python generate_mock_data_fixed.py --students 100 --teachers 20 --password YOUR_PASSWORD

Author: AI School Dashboard Team
Version: 1.1 (Fixed)
"""

import argparse
import json
import random
import sys
from datetime import datetime, timedelta
from typing import List, Dict, Any

# Third-party imports
try:
    from faker import Faker
    import psycopg2
    from psycopg2.extras import execute_values
except ImportError as e:
    print(f"Error: Missing required package - {e}")
    print("Install with: pip install faker psycopg2-binary python-dotenv")
    sys.exit(1)

# Initialize Faker with English locale only (avoid UTF8 encoding issues)
fake = Faker('en_US')
Faker.seed(42)
random.seed(42)

# Constants
CURRENT_ACADEMIC_YEAR = 2024
GRADE_LEVELS = [6, 7, 8, 9, 10, 11, 12]
SUBJECTS = [
    ('MATH', 'Mathematics'),
    ('PHYS', 'Physics'),
    ('CHEM', 'Chemistry'),
    ('BIO', 'Biology'),
    ('LIT', 'Literature'),
    ('ENG', 'English'),
    ('HIST', 'History'),
    ('GEO', 'Geography'),
    ('PE', 'Physical Education'),
    ('IT', 'Computer Science')
]

DEPARTMENTS = ['Math Dept', 'Physics Dept', 'Chemistry Dept', 'Literature Dept', 'English Dept', 'Social Studies Dept']
ATTENDANCE_WEIGHTS = [0.85, 0.05, 0.07, 0.03]
EXAM_TYPES = {
    'quiz': 0.2,
    'assignment': 0.2,
    'midterm': 0.3,
    'final': 0.3
}

def generate_admin_user() -> Dict[str, Any]:
    """Generate default admin user"""
    return {
        'email': 'admin@school.edu.vn',
        'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIQn8Qzp.2',
        'role': 'admin',
        'is_active': True
    }

def generate_teachers(count: int) -> List[Dict[str, Any]]:
    """Generate teacher records with associated user accounts"""
    teachers = []
    
    for i in range(count):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"teacher{i+1}@school.edu.vn"
        
        user = {
            'email': email,
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIQn8Qzp.2',
            'role': 'teacher',
            'is_active': True
        }
        
        teacher = {
            'user': user,
            'first_name': first_name,
            'last_name': last_name,
            'department': random.choice(DEPARTMENTS),
            'phone': fake.phone_number()[:20],  # Limit to 20 chars
            'hire_date': fake.date_between(start_date='-10y', end_date='today')
        }
        
        teachers.append(teacher)
    
    print(f"✓ Generated {count} teachers")
    return teachers

def generate_classes(teacher_count: int) -> List[Dict[str, Any]]:
    """Generate class records"""
    classes = []
    
    for grade in GRADE_LEVELS:
        num_classes = random.randint(3, 4)
        
        for section in range(1, num_classes + 1):
            class_data = {
                'name': f"{grade}A{section}",
                'grade_level': grade,
                'academic_year': CURRENT_ACADEMIC_YEAR,
                'teacher_id': None,
                'room_number': f"{grade}{section:02d}",
                'max_students': 40
            }
            classes.append(class_data)
    
    print(f"✓ Generated {len(classes)} classes")
    return classes

def generate_students(count: int, num_classes: int) -> List[Dict[str, Any]]:
    """Generate student records with associated user accounts"""
    students = []
    
    for i in range(count):
        first_name = fake.first_name()
        last_name = fake.last_name()
        email = f"student{i+1}@school.edu.vn"
        
        user = {
            'email': email,
            'password_hash': '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYIQn8Qzp.2',
            'role': 'student',
            'is_active': True
        }
        
        age = random.randint(10, 18)
        dob = fake.date_of_birth(minimum_age=age, maximum_age=age)
        
        student = {
            'user': user,
            'first_name': first_name,
            'last_name': last_name,
            'date_of_birth': dob,
            'gender': random.choice(['M', 'F']),
            'class_id': None,
            'phone': fake.phone_number()[:20] if random.random() > 0.3 else None,
            'address': fake.address() if random.random() > 0.2 else None,
            'parent_name': fake.name(),
            'parent_phone': fake.phone_number()[:20],
            'parent_email': fake.email() if random.random() > 0.3 else None
        }
        
        students.append(student)
    
    print(f"✓ Generated {count} students")
    return students

def insert_users(conn, users: List[Dict[str, Any]]) -> Dict[str, str]:
    """Insert users and return email to id mapping"""
    cursor = conn.cursor()
    
    email_to_id = {}
    
    # Insert in batches to ensure all RETURNING values are captured
    batch_size = 50
    for i in range(0, len(users), batch_size):
        batch = users[i:i + batch_size]
        
        values = [
            (
                u['email'],
                u['password_hash'],
                u['role'],
                u['is_active']
            )
            for u in batch
        ]
        
        query = """
            INSERT INTO users (email, password_hash, role, is_active)
            VALUES %s
            RETURNING email, id
        """
        
        execute_values(cursor, query, values, template='(%s, %s, %s, %s)')
        results = cursor.fetchall()
        
        # Add to mapping
        for email, user_id in results:
            email_to_id[email] = str(user_id)
    
    cursor.close()
    
    print(f"✓ Inserted {len(users)} users into database")
    print(f"  📧 Created {len(email_to_id)} email mappings")
    
    if len(email_to_id) != len(users):
        print(f"⚠️  WARNING: Expected {len(users)} mappings but got {len(email_to_id)}")
        print(f"⚠️  Missing {len(users) - len(email_to_id)} mappings!")
    
    return email_to_id

def insert_teachers(conn, teachers: List[Dict[str, Any]], email_to_id: Dict[str, str]) -> List[str]:
    """Insert teachers and return list of teacher IDs"""
    cursor = conn.cursor()
    
    values = []
    for i, t in enumerate(teachers):
        teacher_email = t['user']['email']
        
        # Debug: Check if email exists
        if teacher_email not in email_to_id:
            print(f"\n❌ ERROR: Email '{teacher_email}' not found in mapping!")
            print(f"📧 Available emails in mapping ({len(email_to_id)}):")
            for j, email in enumerate(sorted(email_to_id.keys())):
                if j < 10:  # Show first 10
                    print(f"  {j+1}. {email}")
            print(f"\n🔍 All teacher emails generated:")
            for j, teacher in enumerate(teachers):
                print(f"  {j+1}. {teacher['user']['email']}")
            raise KeyError(f"Email {teacher_email} not found in email_to_id mapping")
        
        values.append((
            email_to_id[teacher_email],
            t['first_name'],
            t['last_name'],
            t['department'],
            t['phone'],
            t['hire_date']
        ))
    
    query = """
        INSERT INTO teachers (user_id, first_name, last_name, department, phone, hire_date)
        VALUES %s
        RETURNING id
    """
    
    execute_values(cursor, query, values)
    results = cursor.fetchall()
    
    teacher_ids = [str(teacher_id[0]) for teacher_id in results]
    cursor.close()
    
    print(f"✓ Inserted {len(teachers)} teachers into database")
    return teacher_ids

def insert_classes(conn, classes: List[Dict[str, Any]], teacher_ids: List[str]) -> List[str]:
    """Insert classes and return list of class IDs"""
    cursor = conn.cursor()
    
    values = [
        (
            c['name'],
            c['grade_level'],
            c['academic_year'],
            random.choice(teacher_ids),
            c['room_number'],
            c['max_students']
        )
        for c in classes
    ]
    
    query = """
        INSERT INTO classes (name, grade_level, academic_year, teacher_id, room_number, max_students)
        VALUES %s
        RETURNING id
    """
    
    execute_values(cursor, query, values)
    results = cursor.fetchall()
    
    class_ids = [str(class_id[0]) for class_id in results]
    cursor.close()
    
    print(f"✓ Inserted {len(classes)} classes into database")
    return class_ids

def insert_students(conn, students: List[Dict[str, Any]], email_to_id: Dict[str, str], class_ids: List[str]) -> List[str]:
    """Insert students and return list of student IDs"""
    cursor = conn.cursor()
    
    students_per_class = len(students) // len(class_ids)
    
    values = []
    for i, s in enumerate(students):
        student_email = s['user']['email']
        
        if student_email not in email_to_id:
            raise KeyError(f"Student email {student_email} not found in mapping")
        
        class_id = class_ids[i // students_per_class] if i < len(students) - len(class_ids) else random.choice(class_ids)
        
        values.append((
            email_to_id[student_email],
            s['first_name'],
            s['last_name'],
            s['date_of_birth'],
            s['gender'],
            class_id,
            s['phone'],
            s['address'],
            s['parent_name'],
            s['parent_phone'],
            s['parent_email']
        ))
    
    query = """
        INSERT INTO students (
            user_id, first_name, last_name, date_of_birth, gender, class_id,
            phone, address, parent_name, parent_phone, parent_email
        )
        VALUES %s
        RETURNING id
    """
    
    execute_values(cursor, query, values)
    results = cursor.fetchall()
    
    student_ids = [str(student_id[0]) for student_id in results]
    cursor.close()
    
    print(f"✓ Inserted {len(students)} students into database")
    return student_ids

def generate_courses(class_ids: List[str], teacher_ids: List[str]) -> List[Dict[str, Any]]:
    """Generate course records"""
    courses = []
    used_codes = set()  # Track used course codes to ensure uniqueness
    
    for class_id in class_ids:
        num_subjects = random.randint(8, len(SUBJECTS))
        selected_subjects = random.sample(SUBJECTS, num_subjects)
        
        for semester in [1, 2]:
            for code_prefix, name in selected_subjects:
                # Generate unique code
                while True:
                    code_suffix = random.randint(100, 999)
                    code = f"{code_prefix}{code_suffix}"
                    if code not in used_codes:
                        used_codes.add(code)
                        break
                
                course = {
                    'name': name,
                    'code': code,
                    'description': f"{name} - Semester {semester}",
                    'teacher_id': random.choice(teacher_ids),
                    'class_id': class_id,
                    'semester': semester,
                    'academic_year': CURRENT_ACADEMIC_YEAR,
                    'credits': random.choice([1, 2, 3])
                }
                courses.append(course)
    
    print(f"✓ Generated {len(courses)} courses")
    return courses
    
    print(f"✓ Generated {len(courses)} courses")
    return courses

def insert_courses(conn, courses: List[Dict[str, Any]]) -> List[str]:
    """Insert courses and return list of course IDs"""
    cursor = conn.cursor()
    
    values = [
        (
            c['name'],
            c['code'],
            c['description'],
            c['teacher_id'],
            c['class_id'],
            c['semester'],
            c['academic_year'],
            c['credits']
        )
        for c in courses
    ]
    
    query = """
        INSERT INTO courses (
            name, code, description, teacher_id, class_id, semester, academic_year, credits
        )
        VALUES %s
        RETURNING id
    """
    
    execute_values(cursor, query, values)
    results = cursor.fetchall()
    
    course_ids = [str(course_id[0]) for course_id in results]
    cursor.close()
    
    print(f"✓ Inserted {len(courses)} courses into database")
    return course_ids

def generate_grades(student_ids: List[str], course_ids: List[str], count: int) -> List[Dict[str, Any]]:
    """Generate grade records"""
    grades = []
    
    for student_id in student_ids:
        num_courses = random.randint(8, min(10, len(course_ids)))
        student_courses = random.sample(course_ids, num_courses)
        
        for course_id in student_courses:
            base_grade = random.uniform(5.0, 9.5)
            
            for exam_type, weight in EXAM_TYPES.items():
                grade_value = max(0, min(10, base_grade + random.uniform(-1.5, 1.5)))
                
                if exam_type == 'quiz':
                    exam_date = fake.date_between(start_date='-60d', end_date='-30d')
                elif exam_type == 'assignment':
                    exam_date = fake.date_between(start_date='-45d', end_date='-15d')
                elif exam_type == 'midterm':
                    exam_date = fake.date_between(start_date='-30d', end_date='-10d')
                else:
                    exam_date = fake.date_between(start_date='-10d', end_date='today')
                
                grade = {
                    'student_id': student_id,
                    'course_id': course_id,
                    'grade': round(grade_value, 2),
                    'exam_type': exam_type,
                    'exam_date': exam_date,
                    'weight': weight,
                    'notes': fake.sentence() if random.random() > 0.8 else None
                }
                grades.append(grade)
                
                if len(grades) >= count:
                    print(f"✓ Generated {len(grades)} grades")
                    return grades
    
    print(f"✓ Generated {len(grades)} grades")
    return grades

def insert_grades(conn, grades: List[Dict[str, Any]]):
    """Insert grades"""
    cursor = conn.cursor()
    
    values = [
        (
            g['student_id'],
            g['course_id'],
            g['grade'],
            g['exam_type'],
            g['exam_date'],
            g['weight'],
            g['notes']
        )
        for g in grades
    ]
    
    query = """
        INSERT INTO grades (student_id, course_id, grade, exam_type, exam_date, weight, notes)
        VALUES %s
    """
    
    execute_values(cursor, query, values)
    cursor.close()
    
    print(f"✓ Inserted {len(grades)} grades into database")

def generate_attendance(student_ids: List[str], days: int = 90) -> List[Dict[str, Any]]:
    """Generate attendance records"""
    attendance = []
    
    start_date = datetime.now() - timedelta(days=days)
    statuses = ['present', 'absent', 'late', 'excused']
    
    for student_id in student_ids:
        for day in range(days):
            if day % 7 in [5, 6]:
                continue
            
            if random.random() < 0.1:
                continue
            
            date = start_date + timedelta(days=day)
            status = random.choices(statuses, weights=ATTENDANCE_WEIGHTS)[0]
            
            record = {
                'student_id': student_id,
                'course_id': None,
                'date': date.date(),
                'status': status,
                'notes': fake.sentence() if status != 'present' and random.random() > 0.7 else None
            }
            attendance.append(record)
    
    print(f"✓ Generated {len(attendance)} attendance records")
    return attendance

def insert_attendance(conn, attendance: List[Dict[str, Any]]):
    """Insert attendance records"""
    cursor = conn.cursor()
    
    values = [
        (
            a['student_id'],
            a['course_id'],
            a['date'],
            a['status'],
            a['notes']
        )
        for a in attendance
    ]
    
    query = """
        INSERT INTO attendance (student_id, course_id, date, status, notes)
        VALUES %s
    """
    
    execute_values(cursor, query, values)
    cursor.close()
    
    print(f"✓ Inserted {len(attendance)} attendance records into database")

def main():
    parser = argparse.ArgumentParser(description='Generate mock data for AI School Dashboard')
    parser.add_argument('--students', type=int, default=100, help='Number of students (default: 100)')
    parser.add_argument('--teachers', type=int, default=20, help='Number of teachers (default: 20)')
    parser.add_argument('--grades', type=int, default=2000, help='Number of grades (default: 2000)')
    parser.add_argument('--days', type=int, default=90, help='Days of attendance history (default: 90)')
    parser.add_argument('--host', default='localhost', help='Database host')
    parser.add_argument('--port', default='5432', help='Database port')
    parser.add_argument('--dbname', default='school_dashboard', help='Database name')
    parser.add_argument('--user', default='postgres', help='Database user')
    parser.add_argument('--password', default='postgres', help='Database password')
    parser.add_argument('--output', help='Output JSON file path (optional)')
    
    args = parser.parse_args()
    
    print("=" * 60)
    print("AI SCHOOL DASHBOARD - MOCK DATA GENERATOR (FIXED)")
    print("=" * 60)
    print(f"Generating data for {args.students} students and {args.teachers} teachers...")
    print()
    
    # Generate data
    print("📊 Generating mock data...")
    admin = generate_admin_user()
    teachers = generate_teachers(args.teachers)
    classes = generate_classes(args.teachers)
    students = generate_students(args.students, len(classes))
    
    all_users = [admin] + [t['user'] for t in teachers] + [s['user'] for s in students]
    
    # Connect to database
    conn = None
    try:
        print("\n🔌 Connecting to database...")
        conn = psycopg2.connect(
            host=args.host,
            port=args.port,
            dbname=args.dbname,
            user=args.user,
            password=args.password
        )
        conn.autocommit = False
        print("✓ Connected to database successfully")
        
        print("\n💾 Inserting data into database...")
        
        email_to_id = insert_users(conn, all_users)
        teacher_ids = insert_teachers(conn, teachers, email_to_id)
        class_ids = insert_classes(conn, classes, teacher_ids)
        student_ids = insert_students(conn, students, email_to_id, class_ids)
        course_ids = insert_courses(conn, generate_courses(class_ids, teacher_ids))
        
        grades = generate_grades(student_ids, course_ids, args.grades)
        insert_grades(conn, grades)
        
        attendance = generate_attendance(student_ids, args.days)
        insert_attendance(conn, attendance)
        
        conn.commit()
        print("\n✅ All data inserted successfully!")
        
        print("\n" + "=" * 60)
        print("📈 SUMMARY")
        print("=" * 60)
        print(f"Users:      {len(all_users)}")
        print(f"Teachers:   {len(teachers)}")
        print(f"Classes:    {len(classes)}")
        print(f"Students:   {len(students)}")
        print(f"Courses:    {len(course_ids)}")
        print(f"Grades:     {len(grades)}")
        print(f"Attendance: {len(attendance)}")
        print("=" * 60)
        
        print("\n🎉 Mock data generation completed successfully!")
        print("\n🔑 Default login credentials:")
        print("   Admin:    admin@school.edu.vn / Admin@123")
        print("   Teacher:  teacher1@school.edu.vn / Teacher@123")
        print("   Student:  student1@school.edu.vn / Student@123")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        if conn:
            conn.rollback()
        import traceback
        traceback.print_exc()
        sys.exit(1)
    finally:
        if conn:
            conn.close()
            print("\n🔌 Database connection closed")

if __name__ == '__main__':
    main()