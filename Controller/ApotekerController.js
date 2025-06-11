const User = require('../Models/Users.js');
const bcrypt = require('bcryptjs');
const Apoteker = require('../Models/Apoteker.js');
const dataObatModel = require('../Models/DataObat.js');

const ApotekerController = {
  CreateApoteker: async (req, res) => {
    try {
      const { nama, email, nik, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Pengguna sudah ada' });
      }
      const hashedPassword = await bcrypt.hash(process.env.PASSWORD_APOTEKER, 10);

      const newUser = await User.create({
        nama,
        nik,
        email,
        password: hashedPassword,
        jenis_kelamin,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        role: 'apoteker',
      });
      const result = await Apoteker.CreateApoteker({
        user_id: newUser.id,
        nama,
        email,
        password: hashedPassword,
      });
      res.status(201).json({
        message: 'Apoteker berhasil ditambahkan',
        data: result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  GetApoteker: async (req, res) => {
    try {
      const apoteker = await Apoteker.getApoteker();
      res.status(200).json(apoteker);
    } catch (error) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  DeleteApoteker: async (req, res) => {
    try {
      const id = req.params.id;
      const userData = await Apoteker.getUserIdFromApotekerId(id);
      if (!userData) {
        return res.status(404).json({ message: 'Apoteker tidak ditemukan' });
      }
      const result = await Apoteker.deleteApoteker(userData.user_id);

      res.status(200).json({ message: 'Apoteker berhasil dihapus', result });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  UpdateApoteker: async (req, res) => {
    try {
      const apotekerId = req.params.id;
      const userData = await Apoteker.getUserIdFromApotekerId(apotekerId);
      if (!userData) {
        return res.status(404).json({ message: 'Apoteker tidak ditemukan' });
      }
      console.log(`user id ${user_id}`);
      const { nama, email, nik, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir } = req.body;

      const result = await Apoteker.updateApoteker(user_id, {
        nama,
        email,
        nik,
        jenis_kelamin,
        alamat,
        tempat_lahir,
        tanggal_lahir,
      });

      res.status(200).json({
        message: 'Apoteker berhasil diperbarui',
        result,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  GetPemeriksaanSelesai: async (req, res) => {
    try {
      const hasil = await Apoteker.getPemeriksaanSelesai();
      res.status(200).json({
        message: 'Data pemeriksaan selesai berhasil diambil',
        data: hasil,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  createObat: async (req, res) => {
    try {
      const obat = req.body;
      const newObat = await dataObatModel.createObat(obat);
      res.status(201).json(newObat);
    } catch (err) {
      res.status(500).json({ err: 'Gagal menambahkan data obat', message: err.message });
    }
  },
};
module.exports = ApotekerController;
