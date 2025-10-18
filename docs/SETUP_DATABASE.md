# 🗄️ DATABASE SETUP GUIDE - Week 1-2

## 📋 Prerequisites

Before starting, ensure you have:
- ✅ PostgreSQL 16+ installed
- ✅ Python 3.10+ installed
- ✅ Git installed
- ✅ Basic SQL knowledge

---

## 🚀 STEP 1: Install PostgreSQL

### On macOS:
```bash
brew install postgresql@16
brew services start postgresql@16
```

### On Ubuntu/Debian:
```bash
sudo apt update
sudo apt install postgresql-16 postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### On Windows:
Download installer from: https://www.postgresql.org/download/windows/

---

## 🔧 STEP 2: Create Database

### 1. Access PostgreSQL
```bash
# Connect as postgres user
sudo -u postgres psql

# Or on Windows (in Command Prompt)
psql -U postgres
```

### 2. Create Database and User
```sql
-- Create database
CREATE DATABASE school_dashboard;

-- Create application user (optional, for production)
CREATE USER school_app WITH PASSWORD 'your_secure_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE school_dashboard TO school_app;

-- Connect to the database
\c school_dashboard

-- Grant schema permissions
GRANT ALL ON SCHEMA public TO school_app;

-- Exit psql
\q
```

---

## 📊 STEP 3: Run Database Schema Migration

### 1. Navigate to project directory
```bash
cd ai-school-dashboard/database/migrations
```

### 2. Run the migration script
```bash
# Using psql command
psql -U postgres -d school_dashboard -f 001_create_schema.sql

# Or connect first, then run
psql -U postgres -d school_dashboard
\i 001_create_schema.sql
```

### 3. Verify tables were created
```sql
-- List all tables
\dt

-- Expected output:
-- public | users      | table | postgres
-- public | teachers   | table | postgres
-- public | classes    | table | postgres
-- public | students   | table | postgres
-- public | courses    | table | postgres
-- public | grades     | table | postgres
-- public | attendance | table | postgres

-- Check a specific table structure
\d students

-- View all indexes
\di

-- View all constraints
SELECT conname, contype, conrelid::regclass 
FROM pg_constraint 
WHERE connamespace = 'public'::regnamespace;
```

---

## 🎲 STEP 4: Generate Mock Data

### 1. Install Python dependencies
```bash
cd ../scripts

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install requirements
pip install -r requirements.txt
```

### 2. Run mock data generator

#### Basic usage (default: 100 students, 20 teachers):
```bash
python generate_mock_data.py \
  --host localhost \
  --port 5432 \
  --dbname school_dashboard \
  --user postgres \
  --password your_postgres_password
```

#### Custom data volume:
```bash
python generate_mock_data.py \
  --students 500 \
  --teachers 50 \
  --grades 5000 \
  --days 180 \
  --host localhost \
  --dbname school_dashboard \
  --user postgres \
  --password your_password
```

#### Save sample to JSON file:
```bash
python generate_mock_data.py \
  --students 100 \
  --teachers 20 \
  --output ../data/sample_data.json
```

### 3. Verify data insertion
```sql
-- Connect to database
psql -U postgres -d school_dashboard

-- Check record counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'teachers', COUNT(*) FROM teachers
UNION ALL
SELECT 'classes', COUNT(*) FROM classes
UNION ALL
SELECT 'students', COUNT(*) FROM students
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'grades', COUNT(*) FROM grades
UNION ALL
SELECT 'attendance', COUNT(*) FROM attendance;

-- Sample queries
-- Get all students with their classes
SELECT s.first_name, s.last_name, c.name as class_name
FROM students s
LEFT JOIN classes c ON s.class_id = c.id
LIMIT 10;

-- Calculate average grade per student
SELECT 
  s.first_name || ' ' || s.last_name as student_name,
  ROUND(AVG(g.grade), 2) as avg_grade,
  COUNT(g.id) as total_exams
FROM students s
JOIN grades g ON s.id = g.student_id
GROUP BY s.id, s.first_name, s.last_name
ORDER BY avg_grade DESC
LIMIT 10;

-- Check attendance rate
SELECT * FROM v_attendance_rate LIMIT 10;
```

---

## 🔍 STEP 5: Test Database Performance

### 1. Run EXPLAIN ANALYZE on common queries
```sql
-- Test student list query
EXPLAIN ANALYZE
SELECT s.*, c.name as class_name 
FROM students s 
LEFT JOIN classes c ON s.class_id = c.id 
WHERE c.grade_level = 10;

-- Test grade aggregation
EXPLAIN ANALYZE
SELECT 
  student_id,
  AVG(grade) as avg_grade
FROM grades
GROUP BY student_id;
```

### 2. Check index usage
```sql
-- Show index statistics
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

---

## 📝 STEP 6: Database Backup

### Create backup
```bash
# Full database dump
pg_dump -U postgres school_dashboard > school_dashboard_backup.sql

# Compressed backup
pg_dump -U postgres school_dashboard | gzip > school_dashboard_backup.sql.gz

# Schema only (no data)
pg_dump -U postgres --schema-only school_dashboard > schema_only.sql

# Data only (no schema)
pg_dump -U postgres --data-only school_dashboard > data_only.sql
```

### Restore backup
```bash
# From SQL file
psql -U postgres -d school_dashboard < school_dashboard_backup.sql

# From compressed file
gunzip < school_dashboard_backup.sql.gz | psql -U postgres -d school_dashboard
```

---

## 🐛 Common Issues & Troubleshooting

### Issue 1: "psql: command not found"
**Solution**: Add PostgreSQL to PATH
```bash
# On macOS
echo 'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# On Linux
sudo ln -s /usr/lib/postgresql/16/bin/psql /usr/local/bin/psql
```

### Issue 2: "FATAL: password authentication failed"
**Solution**: Update pg_hba.conf
```bash
# Find config file
sudo find / -name pg_hba.conf 2>/dev/null

# Edit file (change peer to md5 for local connections)
sudo nano /etc/postgresql/16/main/pg_hba.conf

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Issue 3: "permission denied for schema public"
**Solution**: Grant proper permissions
```sql
GRANT ALL ON SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
```

### Issue 4: "column does not exist"
**Solution**: Verify schema was created correctly
```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check table structure
\d table_name
```

### Issue 5: Mock data script fails with "import error"
**Solution**: Install missing packages
```bash
pip install --upgrade pip
pip install -r requirements.txt

# If specific package fails
pip install faker psycopg2-binary python-dotenv
```

---

## ✅ Verification Checklist

Before proceeding to Week 3-4 (Backend Development), verify:

- [ ] PostgreSQL is installed and running
- [ ] Database `school_dashboard` is created
- [ ] All 7 tables are created (users, teachers, classes, students, courses, grades, attendance)
- [ ] All indexes are created
- [ ] All views are created (v_student_summary, v_course_enrollment, v_attendance_rate)
- [ ] Mock data is inserted successfully
- [ ] Sample queries return expected results
- [ ] Backup script works correctly
- [ ] You understand the ERD and table relationships

---

## 📚 Next Steps

After completing database setup:

1. ✅ **Week 3-4**: Backend API Development (Node.js/Express)
2. ⏳ **Week 5-6**: Frontend Development (React)
3. ⏳ **Week 7-8**: AI Integration
4. ⏳ **Week 9-10**: Testing & Deployment

---

## 📞 Support

If you encounter issues not covered in this guide:

1. Check PostgreSQL logs: `tail -f /var/log/postgresql/postgresql-16-main.log`
2. Review database error messages carefully
3. Consult PostgreSQL documentation: https://www.postgresql.org/docs/16/
4. Check project README for updates

---

**Document Version**: 1.0  
**Last Updated**: December 2024  
**Estimated Time**: 3-4 hours for complete setup
