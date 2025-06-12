require('dotenv').config(); // pastikan kamu install dan pakai dotenv kalau pakai .env

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ERM',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: false,  
});

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Koneksi ke database berhasil!');
    connection.release();
  } catch (err) {
    console.error('❌ Gagal koneksi ke database:', err.message);
  }
}

testConnection();

module.exports = pool;
