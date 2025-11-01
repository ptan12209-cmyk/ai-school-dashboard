/**
 * Reset Database Script
 * ======================
 * Drops all tables and recreates fresh schema
 * USE WITH CAUTION: This will delete all data!
 */

require('dotenv').config();
const { sequelize } = require('./config/database');

async function resetDatabase() {
  try {
    console.log('⚠️  WARNING: This will DROP ALL TABLES and DELETE ALL DATA!');
    console.log('🔄 Starting database reset...\n');

    // Drop all tables
    console.log('🗑️  Dropping all tables...');
    await sequelize.drop({ cascade: true });
    console.log('✅ All tables dropped\n');

    // Recreate tables with fresh schema
    console.log('🔨 Creating fresh database schema...');
    await sequelize.sync({ force: true });
    console.log('✅ Database schema created successfully\n');

    console.log('╔════════════════════════════════════════╗');
    console.log('║   ✅ DATABASE RESET COMPLETED!         ║');
    console.log('╚════════════════════════════════════════╝\n');
    console.log('Next steps:');
    console.log('1. Run: node seeders/seed.js (to populate data)');
    console.log('2. Run: npm run dev (to start server)\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error resetting database:', error);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run reset
resetDatabase();
