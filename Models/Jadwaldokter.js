const db = require('../Config/db.js');

class JadwalDokter {
  static async Createjadwal(jadwalDokter) {
    const { id_dokter, hari, jam_mulai, jam_selesai, status } = jadwalDokter;

    const query = `
        INSERT INTO jadwaldokter 
        (id_dokter, hari, jam_mulai, jam_selesai, status)
        VALUES ( ?, ?, ?, ?, ?)
    `;

    try {
      const [result] = await db.query(query, [id_dokter, hari, jam_mulai, jam_selesai, status || 'aktif']);
      return result;
    } catch (err) {
      console.error('Error inserting jadwal dokter:', err);
      throw err;
    }
  }
  static async getAllJadwal() {
    const [rows] = await db.query(`
    SELECT dokter.*, jadwaldokter.*
    FROM dokter
    JOIN jadwaldokter ON dokter.id = jadwaldokter.id_dokter
    ORDER BY jadwaldokter.hari, jadwaldokter.jam_mulai
  `);
    return rows;
  }
  static async getJadwalbyid(id) {
    const [rows] = await db.query(`SELECT * FROM jadwaldokter WHERE id_dokter = ?`, [id]);
    return rows;
  }
  static async update(id, dokterData) {
    const { hari, jam_mulai, jam_selesai, status } = dokterData;

    await db.query(
      `UPDATE jadwaldokter
     SET  hari = ?, jam_mulai = ?, jam_selesai = ?, status = ?
     WHERE id = ?`,
      [hari, jam_mulai, jam_selesai, status, id]
    );
  }
  static async delete(id) {
    await db.query('DELETE FROM jadwaldokter WHERE id = ?', [id]);
    return true;
  }
}
module.exports = JadwalDokter;
