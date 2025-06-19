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
  static async updateDatadokter(user_id, data) {
    const { status_pernikahan, golongan_darah, pekerjaan } = data;

    await db.query(
      `UPDATE data_user 
     SET status_pernikahan = ?, golongan_darah = ?, pekerjaan = ? 
     WHERE user_id = ?`,
      [status_pernikahan, golongan_darah, pekerjaan, user_id]
    );

    return { user_id, ...data };
  }
  static async deleteDokter(id) {
    await db.query(`DELETE FROM users WHERE id = ?`, [id]);
    return true;
  }
  static async GetAllDokter() {
    try {
      const query = `SELECT 
  users.*, 
  dokter.*, 
  data_user.user_id , data_user.status_pernikahan , data_user.golongan_darah , data_user.pekerjaan
FROM dokter
JOIN users ON  dokter.user_id = users.id
JOIN data_user ON users.id = data_user.user_id;
`;
      const [rows] = await db.query(query);
      return rows;
    } catch (error) {
      console.error('❌ Gagal mengambil data dokter:', error.message);
      throw new Error('Gagal mengambil data dokter');
    }
  }
  static async checkUserid(id) {
    const [rows] = await db.query('SELECT * FROM dokter WHERE user_id = ?', [id]);
    return rows;
  }
  static async updateDokterPoli(id, dokter) {
    const { poli } = dokter;
    await db.query(`UPDATE  dokter SET  poli = ?  WHERE user_id = ?`, [poli, id]);
    return { id, ...dokter };
  }
}
module.exports = Dokter;
