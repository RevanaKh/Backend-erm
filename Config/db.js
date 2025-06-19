require('dotenv').config();

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : null,
});
// const pool = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '',
//   database: 'erm',
//   port: 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   ssl: false,
// });
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
