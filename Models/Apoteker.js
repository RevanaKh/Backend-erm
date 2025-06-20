const db = require('../Config/db.js');

class Apoteker {
  static async CreateApoteker(apoteker) {
    const { user_id, nama, email, password } = apoteker;

    const [result] = await db.query(
      `INSERT INTO apoteker (user_id, nama, email, password)
     VALUES (?, ?, ?, ?)`,
      [user_id, nama, email, password]
    );

    return { id: result.insertId, ...apoteker };
  }

  static async getApoteker() {
    const [rows] = await db.query('SELECT users.* , data_user.* FROM users JOIN data_user ON users.id = data_user.user_id WHERE role = ?', ['apoteker']);
    return rows;
  }
  static async deleteApoteker(id) {
    const [result] = await db.query(`DELETE FROM users WHERE id = ? AND role = 'apoteker'`, [id]);
    return result;
  }
  static async updateApoteker(id, data) {
    const { nama, email, nik, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir } = data;

    const [result] = await db.query(
      `UPDATE users 
   SET 
     nama = ?, 
     email = ?, 
     nik = ?, 
     jenis_kelamin = ?, 
     alamat = ?, 
     tempat_lahir = ?, 
     tanggal_lahir = ?
   WHERE id = ? AND role = 'apoteker'`,
      [nama, email, nik, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, id]
    );

    return result;
  }
  static async updateDataApoteker(user_id, data) {
    const { status_pernikahan, golongan_darah, pekerjaan } = data;

    await db.query(
      `UPDATE data_user 
     SET status_pernikahan = ?, golongan_darah = ?, pekerjaan = ? 
     WHERE user_id = ?`,
      [status_pernikahan, golongan_darah, pekerjaan, user_id]
    );

    return { user_id, ...data };
  }
  static async getUserIdFromApotekerId(apotekerId) {
    const [rows] = await db.query(`SELECT user_id FROM apoteker WHERE user_id = ?`, [apotekerId]);
    return rows[0];
  }
  static async getPemeriksaanSelesai() {
    const [rows] = await db.query(
      `SELECT 
      pemeriksaan.*, 
      pendaftaran.*, 
      data_daftar.*, 
      dokter.nama AS nama_dokter,
      dataobat.nama_obat,
      dataobat.harga_jual
    FROM pemeriksaan
    JOIN pendaftaran ON pendaftaran.id = pemeriksaan.pendaftaran_id
    LEFT JOIN dokter ON pendaftaran.dokter_id = dokter.id
    LEFT JOIN dataobat ON pemeriksaan.id_obat = dataobat.id
    LEFT JOIN data_daftar ON pendaftaran.id = data_daftar.pendaftaran_id
    WHERE pemeriksaan.status_pemeriksaan = 'selesai'`
    );
    return rows;
  }
}
module.exports = Apoteker;
