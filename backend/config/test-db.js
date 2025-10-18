/**
 * Test Database Connection
 * =========================
 * Simple script to verify PostgreSQL connection
 * 
 * Usage: node test-db.js
 */

const { sequelize } = require('./config/database');

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...\n');
    
    // Test authentication
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    
    // Get database info
    const dbName = sequelize.config.database;
    const dbHost = sequelize.config.host;
    const dbPort = sequelize.config.port;
    console.log(`📊 Database: ${dbName}`);
    console.log(`🖥️  Host: ${dbHost}:${dbPort}`);
    
    // Test query - count users
    const [results] = await sequelize.query('SELECT COUNT(*) as count FROM users');
    const userCount = results[0].count;
    console.log(`👥 Users in database: ${userCount}`);
    
    // Test query - count students
    const [studentResults] = await sequelize.query('SELECT COUNT(*) as count FROM students');
    const studentCount = studentResults[0].count;
    console.log(`🎓 Students in database: ${studentCount}`);
    
    // Test query - count teachers
    const [teacherResults] = await sequelize.query('SELECT COUNT(*) as count FROM teachers');
    const teacherCount = teacherResults[0].count;
    console.log(`👨‍🏫 Teachers in database: ${teacherCount}`);
    
    console.log('\n🎉 All tests passed! Database is ready.');
    
  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('1. Check if PostgreSQL is running');
    console.error('2. Verify .env file has correct credentials');
    console.error('3. Ensure database "school_dashboard" exists');
    console.error('4. Check if firewall is blocking port 5432');
    process.exit(1);
  } finally {
    // Close connection
    await sequelize.close();
    console.log('\n🔌 Connection closed.');
  }
}

// Run test
testConnection();






