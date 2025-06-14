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
      const user = await User.update(id, req.body);
      await User.updateDataUser(id, req.body);
      res.json(user);
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
};

module.exports = userController;
