// test-modules.js - Script to test Student & Teacher Modules
// Run this file to check if all components are properly integrated
// Note: This is a Node.js script, not a React component

// ==========================================
// 1. CHECK IMPORTS - Verify all files exist
// ==========================================

const checkImports = () => {
  const requiredFiles = {
    // Redux Slices
    studentSlice: () => import('./src/redux/slices/studentSlice'),
    teacherSlice: () => import('./src/redux/slices/teacherSlice'),
    
    // Student Components
    StudentList: () => import('./src/components/students/StudentList'),
    StudentForm: () => import('./src/components/students/StudentForm'),
    StudentCard: () => import('./src/components/students/StudentCard'),
    StudentFilter: () => import('./src/components/students/StudentFilter'),
    
    // Teacher Components  
    TeacherList: () => import('./src/components/teachers/TeacherList'),
    TeacherForm: () => import('./src/components/teachers/TeacherForm'),
    TeacherCard: () => import('./src/components/teachers/TeacherCard'),
    TeacherFilter: () => import('./src/components/teachers/TeacherFilter'),
    
    // Pages
    StudentsPage: () => import('./src/pages/StudentsPage'),
    TeachersPage: () => import('./src/pages/TeachersPage'),
    
    // Services
    studentService: () => import('./src/services/studentService'),
    teacherService: () => import('./src/services/teacherService'),
  };

  console.log('🔍 Checking file imports...\n');
  
  Object.entries(requiredFiles).forEach(async ([name, importFn]) => {
    try {
      await importFn();
      console.log(`✅ ${name} - OK`);
    } catch (error) {
      console.error(`❌ ${name} - MISSING or ERROR`);
      console.error(`   Error: ${error.message}`);
    }
  });
};

// ==========================================
// 2. CHECK REDUX STORE
// ==========================================

const checkReduxStore = async () => {
  console.log('\n🔍 Checking Redux Store Configuration...\n');
  
  try {
    const { default: store } = await import('./src/redux/store.js');
    const state = store.getState();
  
    // Check if slices are registered
    const requiredSlices = ['students', 'teachers', 'auth'];
    
    requiredSlices.forEach(slice => {
      if (state[slice]) {
        console.log(`✅ Redux slice '${slice}' is registered`);
        console.log(`   Initial state keys: ${Object.keys(state[slice]).join(', ')}`);
      } else {
        console.error(`❌ Redux slice '${slice}' is NOT registered`);
        console.error(`   Add to store.js: ${slice}: ${slice}Reducer`);
      }
    });
  } catch (error) {
    console.error('❌ Could not load Redux store');
    console.error(`   Error: ${error.message}`);
  }
};

// ==========================================
// 3. TEST COMPONENT RENDERING
// ==========================================

// Remove JSX component wrapper - not needed for Node.js testing

const testComponentRendering = async () => {
  console.log('\n🔍 Testing Component File Existence...\n');
  
  const components = [
    { name: 'StudentsPage', path: './src/pages/StudentsPage' },
    { name: 'TeachersPage', path: './src/pages/TeachersPage' },
  ];

  for (const { name, path } of components) {
    try {
      await import(path);
      console.log(`✅ ${name} - File exists and can be imported`);
    } catch (error) {
      console.error(`❌ ${name} - File missing or has errors`);
      console.error(`   Error: ${error.message}`);
    }
  }
};

// ==========================================
// 4. TEST API ENDPOINTS
// ==========================================

const testAPIEndpoints = async () => {
  console.log('\n🔍 Testing API Endpoints...\n');
  
  const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  const endpoints = [
    { name: 'Students List', url: '/api/students', method: 'GET' },
    { name: 'Teachers List', url: '/api/teachers', method: 'GET' },
    { name: 'Departments', url: '/api/teachers/departments', method: 'GET' },
    { name: 'Subjects', url: '/api/teachers/subjects', method: 'GET' },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseURL}${endpoint.url}`, {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json',
          // Add auth token if needed
          // 'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        console.log(`✅ ${endpoint.name} - Status: ${response.status}`);
      } else {
        console.log(`⚠️  ${endpoint.name} - Status: ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ ${endpoint.name} - Failed to connect`);
      console.error(`   Make sure backend is running on ${baseURL}`);
    }
  }
};

// ==========================================
// 5. CHECK ROUTES CONFIGURATION
// ==========================================

const checkRoutes = async () => {
  console.log('\n🔍 Checking Routes Configuration...\n');
  
  try {
    const { default: routes } = await import('./src/routes.js');
    
    const requiredPaths = [
      '/students',
      '/teachers',
      '/dashboard'
    ];
    
    requiredPaths.forEach(path => {
      const route = routes.find(r => r.path === path);
      if (route) {
        console.log(`✅ Route '${path}' is configured`);
        if (route.element) {
          console.log(`   Component: ${route.element.type?.name || 'Component configured'}`);
        }
      } else {
        console.error(`❌ Route '${path}' is NOT configured`);
        console.error(`   Add route configuration to routes.js`);
      }
    });
  } catch (error) {
    console.error('❌ Could not check routes - routes.js may be missing or misconfigured');
  }
};

// ==========================================
// 6. TEST MOCK DATA
// ==========================================

const generateMockData = () => {
  console.log('\n📝 Generating Mock Data...\n');
  
  // Mock Students
  const mockStudents = [
    {
      id: 1,
      studentId: 'STU001',
      name: 'John Doe',
      email: 'john.doe@school.edu',
      phone: '0123456789',
      gender: 'Male',
      dateOfBirth: '2005-05-15',
      address: '123 Main St, City',
      classId: 1,
      className: 'Class 10A',
      status: 'Active',
      gradeAverage: 8.5,
      parentName: 'Jane Doe',
      parentPhone: '0987654321',
      enrollmentDate: '2020-09-01'
    },
    {
      id: 2,
      studentId: 'STU002',
      name: 'Alice Smith',
      email: 'alice.smith@school.edu',
      phone: '0123456788',
      gender: 'Female',
      dateOfBirth: '2005-08-20',
      address: '456 Oak Ave, City',
      classId: 1,
      className: 'Class 10A',
      status: 'Active',
      gradeAverage: 9.2,
      parentName: 'Bob Smith',
      parentPhone: '0987654322',
      enrollmentDate: '2020-09-01'
    }
  ];

  // Mock Teachers
  const mockTeachers = [
    {
      id: 1,
      teacherId: 'TCH001',
      name: 'Dr. Robert Johnson',
      email: 'robert.johnson@school.edu',
      phone: '0123456700',
      gender: 'Male',
      dateOfBirth: '1980-03-10',
      address: '789 Teacher St, City',
      department: 'Mathematics',
      subjects: ['Algebra', 'Calculus', 'Statistics'],
      qualifications: ['B.Sc', 'M.Sc', 'PhD'],
      specialization: 'STEM Education',
      experience: 15,
      joiningDate: '2010-08-01',
      employmentType: 'Full-time',
      salary: 5000,
      status: 'Active',
      rating: 4.5,
      classes: ['Class 10A', 'Class 11B']
    },
    {
      id: 2,
      teacherId: 'TCH002',
      name: 'Ms. Sarah Williams',
      email: 'sarah.williams@school.edu',
      phone: '0123456701',
      gender: 'Female',
      dateOfBirth: '1985-07-22',
      address: '321 Educator Ln, City',
      department: 'Science',
      subjects: ['Physics', 'Chemistry'],
      qualifications: ['B.Sc', 'M.Sc', 'B.Ed'],
      specialization: 'Science Education',
      experience: 10,
      joiningDate: '2015-08-01',
      employmentType: 'Full-time',
      salary: 4500,
      status: 'Active',
      rating: 4.8,
      classes: ['Class 10B', 'Class 11A']
    }
  ];

  console.log('✅ Generated 2 mock students');
  console.log('✅ Generated 2 mock teachers');
  
  // Save to localStorage for testing
  localStorage.setItem('mockStudents', JSON.stringify(mockStudents));
  localStorage.setItem('mockTeachers', JSON.stringify(mockTeachers));
  
  console.log('\n📦 Mock data saved to localStorage');
  console.log('   Access with: JSON.parse(localStorage.getItem("mockStudents"))');
  console.log('   Access with: JSON.parse(localStorage.getItem("mockTeachers"))');
  
  return { mockStudents, mockTeachers };
};

// ==========================================
// 7. TEST REDUX ACTIONS
// ==========================================

const testReduxActions = async () => {
  console.log('\n🔍 Testing Redux Actions...\n');
  
  try {
    // Test Student Actions
    const studentActions = await import('./src/redux/slices/studentSlice.js');
    const studentActionNames = [
      'fetchStudents',
      'createStudent',
      'updateStudent',
      'deleteStudent',
      'setSearchTerm',
      'setFilters'
    ];
    
    console.log('Student Module Actions:');
    studentActionNames.forEach(action => {
      if (studentActions[action]) {
        console.log(`  ✅ ${action}`);
      } else {
        console.log(`  ❌ ${action} - Missing`);
      }
    });
    
    // Test Teacher Actions
    const teacherActions = await import('./src/redux/slices/teacherSlice.js');
    const teacherActionNames = [
      'fetchTeachers',
      'createTeacher', 
      'updateTeacher',
      'deleteTeacher',
      'fetchDepartments',
      'fetchSubjects'
    ];
    
    console.log('\nTeacher Module Actions:');
    teacherActionNames.forEach(action => {
      if (teacherActions[action]) {
        console.log(`  ✅ ${action}`);
      } else {
        console.log(`  ❌ ${action} - Missing`);
      }
    });
    
  } catch (error) {
    console.error('❌ Could not test Redux actions');
    console.error(`   Error: ${error.message}`);
  }
};

// ==========================================
// 8. COMMON ISSUES & FIXES
// ==========================================

const showCommonFixes = () => {
  console.log('\n🔧 Common Issues & Fixes:\n');
  
  const issues = [
    {
      issue: 'Module not found errors',
      fixes: [
        'Check file paths and names (case-sensitive)',
        'Ensure all files are in correct folders',
        'Run: npm install to install dependencies'
      ]
    },
    {
      issue: 'Redux state undefined',
      fixes: [
        'Add reducer to store.js',
        'Check import statements in store.js',
        'Verify slice name matches state key'
      ]
    },
    {
      issue: 'API calls failing',
      fixes: [
        'Check if backend is running',
        'Verify API base URL in .env file',
        'Check CORS configuration',
        'Add authentication token if required'
      ]
    },
    {
      issue: 'Ant Design styles not working',
      fixes: [
        'Import antd CSS: import "antd/dist/reset.css"',
        'Wrap app with ConfigProvider',
        'Check Ant Design version compatibility'
      ]
    },
    {
      issue: 'Routing not working',
      fixes: [
        'Add routes to routes.js',
        'Check PrivateRoute component',
        'Verify role-based access control'
      ]
    }
  ];
  
  issues.forEach(({ issue, fixes }) => {
    console.log(`❓ Issue: ${issue}`);
    fixes.forEach(fix => {
      console.log(`   ✓ ${fix}`);
    });
    console.log('');
  });
};

// ==========================================
// 9. RUN ALL TESTS
// ==========================================

const runAllTests = async () => {
  console.log('========================================');
  console.log('🚀 STUDENT & TEACHER MODULES TEST SUITE');
  console.log('========================================\n');
  
  // 1. Check imports
  checkImports();
  
  // Wait a bit for async imports
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 2. Check Redux store
  await checkReduxStore();
  
  // 3. Test component rendering
  await testComponentRendering();
  
  // 4. Check routes
  await checkRoutes();
  
  // 5. Test Redux actions
  await testReduxActions();
  
  // 6. Generate mock data
  generateMockData();
  
  // 7. Test API endpoints (only if backend is expected to be running)
  console.log('\n📡 API Endpoint Test (requires backend):');
  console.log('   Skipping... Run manually if backend is available');
  // Uncomment to test: await testAPIEndpoints();
  
  // 8. Show common fixes
  showCommonFixes();
  
  console.log('\n========================================');
  console.log('✅ TEST SUITE COMPLETED');
  console.log('========================================\n');
  
  console.log('📋 Next Steps:');
  console.log('1. Fix any ❌ errors shown above');
  console.log('2. Start your backend server');
  console.log('3. Run: npm start');
  console.log('4. Navigate to /students and /teachers');
  console.log('5. Test all CRUD operations\n');
};

// Export for use in other files
export {
  checkImports,
  checkReduxStore,
  testComponentRendering,
  testAPIEndpoints,
  checkRoutes,
  generateMockData,
  testReduxActions,
  showCommonFixes,
  runAllTests
};

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests();
}

// For browser console testing
if (typeof window !== 'undefined') {
  window.testModules = {
    runAllTests,
    checkImports,
    checkReduxStore,
    generateMockData,
    testReduxActions
  };
  
  console.log('🧪 Test functions loaded!');
  console.log('Run: window.testModules.runAllTests()');
}
