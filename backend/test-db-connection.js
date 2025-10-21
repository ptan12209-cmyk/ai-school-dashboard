/**
 * Test Database Connection
 * Chạy file này để kiểm tra kết nối database
 */

require('dotenv').config();
const { sequelize } = require('./config/database');

async function testConnection() {
  try {
    console.log('🔌 Đang kết nối đến database...');
    console.log(`   Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(`   Port: ${process.env.DB_PORT || 5432}`);
    console.log(`   Database: ${process.env.DB_NAME || 'school_dashboard'}`);
    console.log(`   User: ${process.env.DB_USER || 'postgres'}`);
    console.log('');

    await sequelize.authenticate();
    console.log('✅ Kết nối database thành công!');

    // Test sync models
    console.log('');
    console.log('🔄 Đang đồng bộ database models...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database models đã được đồng bộ!');

    console.log('');
    console.log('🎉 Mọi thứ hoạt động tốt! Bạn có thể chạy ứng dụng.');

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Lỗi kết nối database:');
    console.error('   Lỗi:', error.message);
    console.error('');
    console.error('💡 Kiểm tra lại:');
    console.error('   1. PostgreSQL đã được cài đặt và đang chạy?');
    console.error('   2. Database "school_dashboard" đã được tạo chưa?');
    console.error('   3. Thông tin trong file .env có chính xác?');
    console.error('   4. Username và password PostgreSQL có đúng?');
    console.error('');
    process.exit(1);
  }
}

testConnection();
