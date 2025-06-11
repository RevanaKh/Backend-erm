const db = require('../Config/db.js');

class Obat {
  static async getAllObat() {
    const [rows] = await db.query('SELECT * FROM dataobat');
    return rows;
  }
  static async createObat(obat) {
    const { nama_obat, jenis_obat, harga_jual, stok, kadaluarsa } = obat;
    const [result] = await db.query('INSERT INTO dataobat (nama_obat, jenis_obat, harga_jual, stok , kadaluarsa) VALUES (?, ?, ?, ?, ?)', [nama_obat, jenis_obat, harga_jual, stok, kadaluarsa]);
    return { id: result.insertId, ...obat };
  }
  static async updateObat(id, obat) {
    const { nama_obat, jenis_obat, harga_jual, stok } = obat;
    const [result] = await db.query('UPDATE dataobat SET nama_obat = ?, jenis_obat = ?, harga_jual = ?, stok = ? WHERE id = ?', [nama_obat, jenis_obat, harga_jual, stok, id]);
    return result.affectedRows > 0;
  }
  static async deleteObat(id) {
    const [result] = await db.query('DELETE FROM dataobat WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}
module.exports = Obat;
