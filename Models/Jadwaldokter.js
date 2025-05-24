const db = require('../Config/db.js')

class Dokter {
    static async Createjadwal(jadwalDokter) {
    const { dokter, poli, hari, jam_mulai, jam_selesai, status } = jadwalDokter;

    const query = `
        INSERT INTO jadwaldokter 
        (dokter, poli, hari, jam_mulai, jam_selesai, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        const [result] = await db.query(query, [
            dokter,
            poli,
            hari,
            jam_mulai,
            jam_selesai,
            status || 'aktif' 
        ]);
        return result;
    } catch (err) {
        console.error('Error inserting jadwal dokter:', err);
        throw err;
    }
   
}
  static async getAllJadwal() {
    const [rows] = await db.query('SELECT * FROM jadwaldokter ORDER BY hari, jam_mulai');
    return rows;
  }
}
module.exports = Dokter