const db = require('../Config/db.js');

class PendaftaranModel {
  static async getJumlahAntrian(tanggal, dokter_id) {
    const [rows] = await db.query('SELECT COUNT(*) AS total FROM antrianpasien WHERE tanggal_pemeriksaan = ? AND dokter_id = ?', [tanggal, dokter_id]);
    return rows[0].total;
  }

  static async simpanPendaftaran(data) {
    const { dokter_id, user_id, nama_pasien, email, nik, poli, keluhan, tanggalLahir, alamat, jenisKelamin, metodePembayaran } = data;

    const [result] = await db.query(
      `INSERT INTO pendaftaran 
     (dokter_id, user_id, nama_pasien, email,nik, poli, keluhan, tanggalLahir, alamat, jenisKelamin, metodePembayaran)
     VALUES (?,?, ?,?, ?, ?, ?, ?, ?, ?, ?)`,
      [dokter_id, user_id, nama_pasien, email, nik, poli, keluhan, tanggalLahir, alamat, jenisKelamin, metodePembayaran]
    );

    return result;
  }
  static async dataDaftar(data) {
    const { user_id, pendaftaran_id, status_pernikahan, golongan_darah, pekerjaan } = data;
    const [result] = await db.query(`INSERT INTO data_daftar (user_id , pendaftaran_id ,status_pernikahan , golongan_darah ,pekerjaan) VALUES (?,?,?,?,?)`, [user_id, pendaftaran_id, status_pernikahan, golongan_darah, pekerjaan]);
    return result;
  }

  static async simpanAntrian(antrian) {
    const { pendaftaran_id, dokter_id, nama_dokter, poli, tanggal_pemeriksaan, no_antrian } = antrian;
    const [result] = await db.query('INSERT INTO antrianpasien (pendaftaran_id, dokter_id, nama_dokter, poli, tanggal_pemeriksaan, no_antrian) VALUES (?, ?, ?, ?, ?, ?)', [
      pendaftaran_id,
      dokter_id,
      nama_dokter,
      poli,
      tanggal_pemeriksaan,
      no_antrian,
    ]);
    return result.insertId;
  }
  static async findAntrianByPendaftaranEmail(email) {
    const [rows] = await db.query(
      `
    SELECT 
  p.id AS pendaftaran_id, 
  p.nama_pasien, 
  a.*
FROM pendaftaran p
JOIN antrianpasien a ON p.id = a.pendaftaran_id
WHERE p.email = ?

  `,
      [email]
    );
    return rows;
  }
  static async getpasienbypoli(poli) {
    const [rows] = await db.query(
      `
    SELECT pendaftaran.*, antrianpasien.no_antrian, pemeriksaan.status_pemeriksaan , pemeriksaan.pendaftaran_id , data_daftar.*
    FROM pendaftaran
    JOIN antrianpasien ON pendaftaran.id = antrianpasien.pendaftaran_id
    LEFT JOIN pemeriksaan ON pendaftaran.id = pemeriksaan.pendaftaran_id
    LEFT JOIN data_daftar ON pendaftaran.id = data_daftar.pendaftaran_id
    WHERE pendaftaran.poli = ?
    `,
      [poli]
    );
    return rows;
  }

  static async SimpanPemeriksaan(periksa) {
    const { pendaftaran_id, dokter_id, diagnosa, tindakan, id_obat, status_pemeriksaan } = periksa;
    const [result] = await db.query('INSERT INTO pemeriksaan ( pendaftaran_id , dokter_id,diagnosa, tindakan, id_obat, status_pemeriksaan) VALUES ( ?,?, ?,?, ?, ?)', [
      pendaftaran_id,
      dokter_id,
      diagnosa,
      tindakan,
      id_obat,
      status_pemeriksaan,
    ]);
    return result.insertId;
  }
  static async updatePemeriksaan(pendaftaran_id, diagnosa, tindakan, id_obat, status_pemeriksaan) {
    await db.query('UPDATE pemeriksaan SET diagnosa = ? , tindakan = ? , id_obat = ? , status_pemeriksaan = ? WHERE pendaftaran_id = ?', [diagnosa, tindakan, id_obat, status_pemeriksaan, pendaftaran_id]);
    return { pendaftaran_id, diagnosa, tindakan, id_obat, status_pemeriksaan };
  }
  static async UpdateStatusPembayaran(id_pendaftaran, status_pembayaran) {
    await db.query('UPDATE statuspembayaran SET status_pembayaran = ? WHERE id_pendaftaran = ?', [status_pembayaran, id_pendaftaran]);
  }
  static async getpendaftaran() {
    const [rows] = await db.query(
      'SELECT  pemeriksaan.*, pendaftaran.nama_pasien, pendaftaran.poli , dokter.nama FROM pemeriksaan JOIN pendaftaran ON pemeriksaan.pendaftaran_id = pendaftaran.id LEFT JOIN dokter ON pemeriksaan.dokter_id = dokter.id'
    );
    return rows;
  }
  static async getDokterByPoli(poli) {
    const [rows] = await db.query('SELECT jadwaldokter.*, dokter.poli, dokter.nama FROM jadwaldokter JOIN dokter ON jadwaldokter.id_dokter = dokter.id WHERE dokter.poli = ?', [poli]);
    return rows;
  }
  static async deletePendaftaran(id) {
    const [result] = await db.query('DELETE FROM pendaftaran WHERE id = ?', [id]);
    return result;
  }
  static async getpendaftaranId(pendaftaran_id) {
    const [rows] = await db.query(`SELECT * FROM pemeriksaan WHERE pendaftaran_id = ?`, [pendaftaran_id]);
    return rows;
  }
  static async deleteAntrian(id) {
    const [result] = await db.query('DELETE FROM antrianpasien WHERE pendaftaran_id = ?', [id]);
    return result;
  }

  static async checkPembayaran(id_pendaftaran) {
    const [rows] = await db.query(`SELECT * FROM statuspembayaran WHERE id_pendaftaran = ?`, [id_pendaftaran]);
    return rows;
  }
  static async updatepembayaran(id_pendaftaran, id_obat) {
    await db.query('UPDATE statuspembayaran SET id_obat = ? WHERE id_pendaftaran', [id_obat, id_pendaftaran]);
    return { id_pendaftaran, id_obat };
  }
  static async getPemeriksaanByEmail(email) {
    const [rows] = await db.query(
      `SELECT 
      pemeriksaan.*, 
      pendaftaran.id, 
      antrianpasien.tanggal_pemeriksaan, 
      antrianpasien.nama_dokter ,
      dataobat.nama_obat
    FROM pendaftaran 
    JOIN pemeriksaan ON pendaftaran.id = pemeriksaan.pendaftaran_id 
    LEFT JOIN antrianpasien ON pendaftaran.id = antrianpasien.pendaftaran_id 
    LEFT JOIN dataobat ON pemeriksaan.id_obat = dataobat.id
    WHERE pendaftaran.email = ?`,
      [email]
    );
    return rows;
  }
  static async getStatusPembayaran() {
    const [rows] = await db.query(`
    SELECT 
      statuspembayaran.*, 
      pendaftaran.waktu_daftar, 
      pendaftaran.nama_pasien, 
      pendaftaran.metodePembayaran, 
      dataobat.nama_obat,
      dataobat.harga_jual
    FROM statuspembayaran
    JOIN pendaftaran ON statuspembayaran.id_pendaftaran = pendaftaran.id
    LEFT JOIN dataobat ON statuspembayaran.id_obat = dataobat.id
  `);

    return rows;
  }
  static async getStatusPembayaranByUser(userId) {
    const [rows] = await db.query(
      `
    SELECT 
      statuspembayaran.*, 
      pendaftaran.waktu_daftar, 
      pendaftaran.nama_pasien, 
      pendaftaran.metodePembayaran, 
      pendaftaran.user_id,
      dataobat.nama_obat,
      dataobat.harga_jual
    FROM statuspembayaran
    JOIN pendaftaran ON statuspembayaran.id_pendaftaran = pendaftaran.id
    LEFT JOIN dataobat ON statuspembayaran.id_obat = dataobat.id
    WHERE pendaftaran.user_id = ?
  `,
      [userId]
    );

    return rows;
  }

  static async simpanStatusPembayaran(pembayaran) {
    const { id_pendaftaran, id_obat, status_pembayaran } = pembayaran;

    const [result] = await db.query(
      `INSERT INTO statuspembayaran (id_pendaftaran, id_obat, status_pembayaran) 
       VALUES (?, ?, ?)`,
      [id_pendaftaran, id_obat, status_pembayaran]
    );
    return result.insertId;
  }
}

module.exports = PendaftaranModel;
