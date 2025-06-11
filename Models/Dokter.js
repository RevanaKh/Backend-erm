const db = require('../Config/db.js');

class Dokter {
  static async CreateDokter(dokter) {
    const { user_id, nama, email, password, poli, role } = dokter;
    const query = `
        INSERT INTO dokter (user_id ,nama, email, password, poli, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
    const [result] = await db.query(query, [user_id, nama, email, password, poli, role]);
    return result;
  }
  static async updateDokter(id, dokter) {
    const { nama, email, poli, role } = dokter;
    await db.query(`UPDATE  dokter SET nama = ?, email = ?, poli = ? , role = ?  WHERE user_id = ?`, [nama, email, poli, role, id]);
    return { id, ...dokter };
  }
  static async deleteDokter(id) {
    await db.query(`DELETE FROM users WHERE id = ?`, [id]);
    return true;
  }
  static async GetAllDokter() {
    try {
      const query = `SELECT id, nama, email, poli, role, user_id FROM dokter`;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('❌ Gagal mengambil data dokter:', error.message);
      throw new Error('Gagal mengambil data dokter');
    }
  }
}
module.exports = Dokter;
