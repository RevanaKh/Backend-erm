const User = require('../Models/Users.js');
const db = require('../Config/db.js');
const bcrypt = require('bcryptjs');
const Dokter = require('../Models/Dokter.js');
const Apoteker = require('../Models/Apoteker.js');
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  getuserbyid: async (req, res) => {
    try {
      const { id } = req.params;
      const usersid = await User.getuserByid(id);
      res.json(usersid);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const { nama, nik, email, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, status_pernikahan, golongan_darah, pekerjaan, role } = req.body;
      const updatedUser = await User.update(id, {
        nama,
        nik,
        email,
        jenis_kelamin,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        status_pernikahan,
        golongan_darah,
        pekerjaan,
        role,
      });
      res.json(updatedUser);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  searchByNIK: async (req, res) => {
    const { nik } = req.query;
    try {
      const [rows] = await db.query('SELECT * FROM users WHERE nik = ?', [nik]);
      if (rows.length === 0) {
        return res.status(404).json({ message: 'Pasien tidak ditemukan' });
      }
      res.json(rows);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      await User.delete(id);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  createpasien: async (req, res) => {
    try {
      const { nama, nik, email, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, status_pernikahan, golongan_darah, pekerjaan } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Pengguna sudah ada' });
      }

      const hashedPassword = await bcrypt.hash(process.env.PASSWORD_PASIEN, 10);

      const user = await User.create({
        nama,
        nik,
        email,
        password: hashedPassword,
        jenis_kelamin,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        role: 'pasien',
      });
      await User.createData({
        user_id: user.id,
        status_pernikahan,
        golongan_darah,
        pekerjaan,
      });
      res.status(201).json({
        message: 'Pasien berhasil ditambahkan',
        user: {
          id: user.id,
          nama: user.nama,
          nik: user.nik,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: err.message });
    }
  },
  createUsers: async (req, res) => {
    try {
      const { nama, nik, email, password, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, role, poli, status_pernikahan, golongan_darah, pekerjaan } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Pengguna sudah ada' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        nama,
        nik,
        email,
        password: hashedPassword,
        jenis_kelamin,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        role,
      });
      await User.createData({
        user_id: user.id,
        status_pernikahan,
        golongan_darah,
        pekerjaan,
      });
      if (role === 'apoteker') {
        const CreatedApoteker = await Apoteker.CreateApoteker({
          user_id: user.id,
          nama,
          email,
          password,
        });
      }
      if (role === 'dokter') {
        const checkDokter = await Dokter.checkUserid(user.id);

        if (checkDokter.length > 0) {
          const updated = await Dokter.updateDokterPoli(user.id, { poli });
          return res.status(200).json({
            message: 'Update dokter berhasil',
            status: true,
            data: updated,
          });
        } else {
          const created = await Dokter.CreateDokter({
            user_id: user.id,
            nama,
            email,
            password: hashedPassword,
            poli,
            role,
          });
          return res.status(200).json({
            message: 'Tambah dokter berhasil',
            status: true,
            data: created,
          });
        }
      }
      res.status(201).json({
        message: 'User berhasil ditambahkan',
        status: true,
        user: {
          id: user.id,
          nama: user.nama,
          nik: user.nik,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  ReportFromUser: async (req, res) => {
    try {
      const { masalah, pesan } = req.body;
      const userId = req.user.id;
      if (!masalah || !pesan) {
        return res.status(400).json({ message: 'Masalah dan pesan harus diisi.' });
      }

      const report = await User.Report({
        user_id: userId,
        masalah,
        pesan,
      });
      console.log(report);
      await User.PesanAdmin({
        id_report: report.id,
        balasan: 'Terima kasih, laporan Anda berhasil dikirim dan akan segera ditinjau oleh admin.',
      });
      res.status(200).json({ status: true, data: report });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },

  getReport: async (req, res) => {
    try {
      const report = await User.LihatReport();
      res.json({ status: true, data: report });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  getPesanFromAdmin: async (req, res) => {
    try {
      const id = req.user.id;

      const pesan = await User.LihatPesanAdmin(id);

      res.status(200).json({
        status: true,
        message: 'admin mengirim pesan',
        data: pesan,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan saat mengambil pesan dari admin.',
      });
    }
  },
  kirimPesanAdmin: async (req, res) => {
    try {
      const { id_report, balasan } = req.body;

      if (!id_report || !balasan) {
        return res.status(400).json({
          status: false,
          message: 'ID laporan dan balasan tidak boleh kosong.',
        });
      }

      const pesan = await User.PesanAdmin({ id_report, balasan });

      res.status(201).json({
        status: true,
        message: 'Pesan berhasil dikirim ke pengguna.',
        data: pesan,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        message: 'Terjadi kesalahan saat mengirim pesan ke pengguna.',
      });
    }
  },
  updatePwEmail: async (req, res) => {
    try {
      const { id } = req.params;
      const { email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);

      const updated = await User.EditPwEmail(id, {
        email,
        password: hashedPassword,
      });

      res.status(200).json({
        status: true,
        message: 'Email dan password berhasil diperbarui',
        data: updated,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: err.message });
    }
  },
  getLaporanid: async (req, res) => {
    try {
      const id = req.user.id;
      const laporan = await User.getLaporanid(id);
      res.json(laporan);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: err.message });
    }
  },
  deleteReport: async (req, res) => {
    try {
      const { id } = req.params;
      await User.DeleteReport(id);
      res.status(200).json({
        status: true,
        message: 'Report berhasil dihapus',
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: false, message: err.message });
    }
  },
};

module.exports = userController;
