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
  static async createData(userData) {
    const { user_id, status_pernikahan, golongan_darah, pekerjaan } = userData;
    const [result] = await db.query('INSERT INTO data_user (user_id , status_pernikahan , golongan_darah , pekerjaan) VALUES (?,?,?,?)', [user_id, status_pernikahan, golongan_darah, pekerjaan]);
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
    const [rows] = await db.query('SELECT users.*, data_user.* FROM users JOIN data_user ON users.id = data_user.user_id');
    return rows;
  }
  static async getuserByid(id) {
    const [rows] = await db.query('SELECT users.* , data_user.* FROM users JOIN data_user ON users.id = data_user.user_id WHERE users.id = ?', [id]);
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
    const { nama, nik, email, role, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin } = userData;

    await db.query(
      `UPDATE users 
        SET nama = ?, nik = ?, email = ?, role = ?, alamat = ?, tempat_lahir = ?, tanggal_lahir = ?, jenis_kelamin = ? 
        WHERE id = ?`,
      [nama, nik, email, role, alamat, tempat_lahir, tanggal_lahir, jenis_kelamin, id]
    );

    return { id, ...userData };
  }
  static async Report(userReport) {
    const { user_id, masalah, pesan } = userReport;
    const [result] = await db.query(`INSERT INTO report (user_id , masalah , pesan) VALUES (?, ? ,? )`, [user_id, masalah, pesan]);
    return { id: result.insertId, ...userReport };
  }
  static async EditPwEmail(id, userData) {
    const { email, password } = userData;
    await db.query(
      `UPDATE users 
        SET email = ? , password = ? 
        WHERE id = ?`,
      [email, password, id]
    );
    return { id, ...userData };
  }
  static async DeleteReport(id) {
    await db.query('DELETE FROM report WHERE id = ?', [id]);
    return true;
  }
  static async LihatReport() {
    const [rows] = await db.query('SELECT users.password , users.email , report.* FROM report JOIN users ON report.user_id = users.id');
    return rows;
  }
  static async PesanAdmin(pesan) {
    const { id_report, balasan } = pesan;
    const [result] = await db.query(`INSERT INTO pesanadmin (id_report ,balasan) VALUES (?, ?)`, [id_report, balasan]);
    return { id: result.insertId, ...pesan };
  }
  static async LihatPesanAdmin(id) {
    const [rows] = await db.query(
      `
    SELECT report.*, pesanadmin.* 
    FROM pesanadmin 
    JOIN report ON pesanadmin.id_report = report.id 
    WHERE report.user_id = ?
  `,
      [id]
    );

    return rows;
  }
  static async getLaporanid(id) {
    const [rows] = await db.query('SELECT * FROM report WHERE user_id = ?', [id]);
    return rows;
  }
  static async updateDataUser(user_id, data) {
    const { status_pernikahan, golongan_darah, pekerjaan } = data;

    await db.query(
      `UPDATE data_user 
     SET status_pernikahan = ?, golongan_darah = ?, pekerjaan = ? 
     WHERE user_id = ?`,
      [status_pernikahan, golongan_darah, pekerjaan, user_id]
    );

    return { user_id, ...data };
  }

  static async delete(id) {
    await db.query('DELETE FROM users WHERE id = ?', [id]);
    return true;
  }
  static async resetpw(email, userPassword) {
  const { password } = userPassword;

  await db.query(
    `UPDATE users SET password = ? WHERE email = ?`,
    [password, email]
  );

  return { email, ...userPassword };
}

}
module.exports = Users;
