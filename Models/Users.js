const db = require('../Config/db.js');

class Users {
  static async create(userData) {
    const { nama, nik, email, password, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, role } = userData;

    const [result] = await db.query(
      `INSERT INTO users 
        (nama, nik, email, password, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama, nik, email, password, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, role]
    );

    return { id: result.insertId, ...userData };
  }
  static async createPasien(pasien) {
    const { nama, nik, email, password, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, role } = pasien;

    const [result] = await db.query(
      `INSERT INTO users 
        (nama, nik, email, password, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, role) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama, nik, email, password, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, role]
    );

    return { id: result.insertId, ...pasien };
  }
  static async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT u.*, d.poli
     FROM users u
     LEFT JOIN dokter d ON u.id = d.user_id
     WHERE u.email = ?`,
      [email]
    );
    return rows[0];
  }

  static async findBynik(nik) {
    const [rows] = await db.query('SELECT * FROM users WHERE nik = ?', [nik]);
    return rows[0];
  }
  static async getAll() {
    const [rows] = await db.query('SELECT * FROM users');
    return rows;
  }
  static async getuserByid(id) {
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  }
  static async updateUserid(id, Userdata) {
    const { nama, nik, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin } = Userdata;
    await db.query(
      `UPDATE users 
        SET nama = ?, nik = ?, alamat = ?, tempat_lahir = ?, tanggal_lahir = ?, jenis_kelamin = ? 
        WHERE id = ?`,
      [nama, nik, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, id]
    );
    return { id, ...Userdata };
  }
  static async update(id, userData) {
    const { nama, nik, email, role, password, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin } = userData;

    await db.query(
      `UPDATE users 
        SET nama = ?, nik = ?, email = ?, role = ?, password = ?, alamat = ?, tempat_lahir = ?, tanggal_lahir = ?, jenis_kelamin = ? 
        WHERE id = ?`,
      [nama, nik, email, role, password, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, id]
    );

    return { id, ...userData };
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
}
module.exports = Users;
