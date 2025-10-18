# 🚀 QUICK START GUIDE - Week 1-2

Get your AI School Dashboard database up and running in 15 minutes!

---

## ⚡ Prerequisites

- PostgreSQL 16+ installed
- Python 3.10+ installed
- Basic command line knowledge

---

## 📦 Installation Steps

### 1️⃣ Clone & Setup (1 min)
```bash
# Navigate to project
cd ai-school-dashboard

# Create .env file
cp .env.example .env

# Edit .env with your database credentials
nano .env  # or use your favorite editor
```

### 2️⃣ Create Database (2 min)
```bash
# Start PostgreSQL (if not running)
# macOS: brew services start postgresql@16
# Linux: sudo systemctl start postgresql

# Create database
psql -U postgres -c "CREATE DATABASE school_dashboard;"
```

### 3️⃣ Run Migrations (3 min)
```bash
cd database/migrations
psql -U postgres -d school_dashboard -f 001_create_schema.sql
```

Expected output:
```
CREATE TYPE
CREATE TABLE
...
Database schema created successfully!
```

### 4️⃣ Generate Mock Data (5 min)
```bash
cd ../../scripts

# Setup Python environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Generate data (100 students, 20 teachers)
python generate_mock_data.py \
  --host localhost \
  --dbname school_dashboard \
  --user postgres \
  --password YOUR_PASSWORD
```

Expected output:
```
✓ Generated 20 teachers
✓ Generated 28 classes
✓ Generated 100 students
✓ Inserted 2000 grades
✓ Inserted 9000 attendance records
🎉 Mock data generation completed!
```

### 5️⃣ Verify Setup (2 min)
```bash
psql -U postgres -d school_dashboard
```

```sql
-- Check tables
\dt

-- Check record counts
SELECT 'students' as table, COUNT(*) FROM students
UNION ALL SELECT 'teachers', COUNT(*) FROM teachers
UNION ALL SELECT 'grades', COUNT(*) FROM grades;

-- Sample query
SELECT first_name, last_name FROM students LIMIT 5;

-- Exit
\q
```

---

## ✅ Success Criteria

You should see:
- ✅ 7 tables created (users, teachers, classes, students, courses, grades, attendance)
- ✅ 120+ users (1 admin + 20 teachers + 100 students)
- ✅ 28 classes
- ✅ 2000+ grades
- ✅ 9000+ attendance records

---

## 🎯 Default Login Credentials

After setup, you can use these credentials for testing:

| Role    | Email                       | Password    |
|---------|----------------------------|-------------|
| Admin   | admin@school.edu.vn        | Admin@123   |
| Teacher | teacher1@school.edu.vn     | Teacher@123 |
| Student | student1@school.edu.vn     | Student@123 |

---

## 🐛 Quick Troubleshooting

**Problem**: "psql: command not found"  
**Fix**: Add PostgreSQL to PATH or use full path to psql

**Problem**: "permission denied for schema public"  
**Fix**: 
```sql
GRANT ALL ON SCHEMA public TO postgres;
```

**Problem**: Mock data script fails  
**Fix**: Check database connection in .env and ensure PostgreSQL is running

**Problem**: "ImportError: No module named faker"  
**Fix**: 
```bash
pip install faker psycopg2-binary python-dotenv
```

---

## 📚 Next Steps

After completing setup:

1. ✅ **You're here!** Week 1-2: Database Setup ✓
2. 🔨 **Week 3-4**: Backend API Development (Node.js/Express)
3. 🎨 **Week 5-6**: Frontend Development (React)
4. 🤖 **Week 7-8**: AI Integration
5. 🚀 **Week 9-10**: Testing & Deployment

---

## 📖 Detailed Documentation

For more information, see:
- 📄 [Database Design](./docs/DATABASE_DESIGN.md)
- 🛠️ [Setup Guide](./docs/SETUP_DATABASE.md)
- ✅ [Week 1-2 Completion](./docs/WEEK_1-2_COMPLETION.md)

---

## 💬 Need Help?

Check the documentation or review the detailed setup guide for more information.

---

**Estimated Total Time**: 15 minutes  
**Difficulty**: ⭐⭐ Beginner  
**Status**: Week 1-2 Complete ✅
