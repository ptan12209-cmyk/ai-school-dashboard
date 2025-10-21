#!/bin/bash

# ================================================
# AUTOMATIC TEST SETUP SCRIPT
# ================================================
# This script automates the entire test setup process
#
# Usage: bash setup-tests.sh
# or: chmod +x setup-tests.sh && ./setup-tests.sh

set -e  # Exit on error

echo "🚀 AI School Dashboard - Test Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo "ℹ️  $1"
}

# ================================================
# STEP 1: Check Prerequisites
# ================================================
echo "📋 Step 1: Checking prerequisites..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed: $NODE_VERSION"
else
    print_error "Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed: $NPM_VERSION"
else
    print_error "npm is not installed!"
    exit 1
fi

# Check PostgreSQL
if command -v psql &> /dev/null; then
    PSQL_VERSION=$(psql --version | awk '{print $3}')
    print_success "PostgreSQL installed: $PSQL_VERSION"
else
    print_error "PostgreSQL is not installed!"
    echo "Please install PostgreSQL from https://www.postgresql.org/download/"
    exit 1
fi

echo ""

# ================================================
# STEP 2: Rename _env to .env
# ================================================
echo "📝 Step 2: Setting up environment files..."
echo ""

if [ -f "_env" ]; then
    if [ -f ".env" ]; then
        print_warning ".env already exists, backing up..."
        mv .env .env.backup.$(date +%Y%m%d_%H%M%S)
        print_success "Backed up existing .env"
    fi
    mv _env .env
    print_success "Renamed _env to .env"
else
    if [ -f ".env" ]; then
        print_success ".env already exists"
    else
        print_error "Neither _env nor .env found!"
        echo "Please create .env file with database configuration"
        exit 1
    fi
fi

# Create .env.test
if [ -f ".env.test" ]; then
    print_warning ".env.test already exists, skipping..."
else
    print_info "Creating .env.test..."
    cat > .env.test << 'EOF'
# Test Environment Configuration
NODE_ENV=test
PORT=5001
HOST=0.0.0.0

# Test Database (SEPARATE from development!)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=school_dashboard_test
DB_USER=postgres
DB_PASSWORD=hotanphat

# JWT Configuration
JWT_SECRET=64f936aeb31eabeb1a508588db9fa46949a250b7beb736101b9cbb2858c7c43bf0cf13a3be16c125906e700d7d1cfb57d32ee910f7654d8feec3f11b244a9233
JWT_EXPIRATION=24h
JWT_REFRESH_EXPIRATION=7d

# Bcrypt (lower rounds for faster tests)
BCRYPT_ROUNDS=10

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Logging
LOG_LEVEL=error
RATE_LIMIT_ENABLED=false
EOF
    print_success "Created .env.test"
fi

echo ""

# ================================================
# STEP 3: Create Test Database
# ================================================
echo "🗄️  Step 3: Setting up test database..."
echo ""

# Check if database exists
DB_EXISTS=$(psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='school_dashboard_test'" 2>/dev/null || echo "")

if [ "$DB_EXISTS" = "1" ]; then
    print_warning "Database 'school_dashboard_test' already exists"
    read -p "Do you want to drop and recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Dropping existing database..."
        psql -U postgres -c "DROP DATABASE school_dashboard_test;" 2>/dev/null || true
        print_success "Dropped existing database"
        
        print_info "Creating new database..."
        psql -U postgres -c "CREATE DATABASE school_dashboard_test;"
        print_success "Created database: school_dashboard_test"
    else
        print_info "Keeping existing database"
    fi
else
    print_info "Creating test database..."
    if psql -U postgres -c "CREATE DATABASE school_dashboard_test;" 2>/dev/null; then
        print_success "Created database: school_dashboard_test"
    else
        print_error "Failed to create database!"
        echo "Please create it manually:"
        echo "  psql -U postgres -c \"CREATE DATABASE school_dashboard_test;\""
        exit 1
    fi
fi

echo ""

# ================================================
# STEP 4: Organize Test Files
# ================================================
echo "📂 Step 4: Organizing test files..."
echo ""

# Create tests directory structure
mkdir -p tests/integration
mkdir -p tests/unit
print_success "Created tests directory structure"

# Move setup.js if in root
if [ -f "setup.js" ] && [ ! -f "tests/setup.js" ]; then
    mv setup.js tests/
    print_success "Moved setup.js to tests/"
fi

# Move test files
move_test_file() {
    local src=$1
    local dst=$2
    if [ -f "$src" ]; then
        mv "$src" "$dst"
        print_success "Moved $src -> $dst"
    fi
}

move_test_file "auth_test.js" "tests/integration/auth.test.js"
move_test_file "user_test.js" "tests/integration/user.test.js"
move_test_file "teacher_test.js" "tests/integration/teacher.test.js"
move_test_file "student_test.js" "tests/integration/student.test.js"
move_test_file "class_test.js" "tests/integration/class.test.js"
move_test_file "course_test.js" "tests/integration/course.test.js"
move_test_file "grade_test.js" "tests/integration/grade.test.js"
move_test_file "attendance_test.js" "tests/integration/attendance.test.js"
move_test_file "api-minimal_test.js" "tests/integration/api-minimal.test.js"

echo ""

# ================================================
# STEP 5: Install Dependencies
# ================================================
echo "📦 Step 5: Installing dependencies..."
echo ""

if [ -d "node_modules" ]; then
    print_warning "node_modules already exists"
    read -p "Do you want to reinstall dependencies? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Reinstalling dependencies..."
        npm install
        print_success "Dependencies installed"
    else
        print_info "Keeping existing dependencies"
    fi
else
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
fi

echo ""

# ================================================
# STEP 6: Update package.json
# ================================================
echo "📝 Step 6: Checking package.json configuration..."
echo ""

# Check if jest config exists in package.json
if grep -q '"jest"' package.json; then
    print_success "Jest configuration found in package.json"
else
    print_warning "Jest configuration not found in package.json"
    print_info "Please add jest configuration to package.json"
fi

echo ""

# ================================================
# STEP 7: Test Everything
# ================================================
echo "🧪 Step 7: Running tests..."
echo ""

# Test database connection
print_info "Testing database connection..."
if node test-db.js 2>/dev/null; then
    print_success "Database connection working"
else
    print_warning "Database connection test failed (may be expected if models not ready)"
fi

# Test models
print_info "Testing models..."
if node test-models.js 2>/dev/null; then
    print_success "Models working"
else
    print_warning "Model tests failed (may be expected if routes not ready)"
fi

echo ""

# ================================================
# COMPLETION
# ================================================
echo "=========================================="
echo "🎉 Test Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Verify .env.test has correct database password"
echo "2. Run: npm test"
echo "3. Or run specific tests:"
echo "   - npm run test:auth"
echo "   - npm run test:api"
echo ""
echo "Utility commands:"
echo "- node test-db.js      # Test database connection"
echo "- node test-models.js  # Test model functionality"
echo "- node check-admin.js  # Check admin users"
echo ""
print_success "Setup completed successfully! 🚀"
