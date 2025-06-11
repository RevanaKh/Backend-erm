const User = require('../Models/Users.js');
const Dokter = require('../Models/Dokter.js');
const bcrypt = require('bcryptjs');

const DokterController = {
  createDokter: async (req, res) => {
    try {
      const { nama, email, poli, nik, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir } = req.body;
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Pengguna sudah ada' });
      }
      const hashedPassword = await bcrypt.hash(process.env.PASSWORD_DOKTER, 10);

      const newUser = await User.create({
        nama,
        nik,
        email,
        password: hashedPassword,
        jenis_kelamin,
        alamat,
        tempat_lahir,
        tanggal_lahir,
        role: 'dokter',
      });
      const newDokter = await Dokter.CreateDokter({ user_id: newUser.id, nama, email, poli, password: hashedPassword, role: 'dokter' });
      res.status(201).json({
        message: 'dokter berhasil ditambahkan',
        data: {
          id: newDokter.id,
          nama: newDokter.nama,
          email: newDokter.email,
          role: newDokter.role,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  getSemuaDokter: async (req, res) => {
    try {
      const data = await Dokter.GetAllDokter();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  UpdateDokter: async (req, res) => {
    try {
      const { id } = req.params;
      const update = await Dokter.updateDokter(id, req.body);

      if (update.affectedRows === 0) {
        return res.status(404).json({ message: 'Dokter tidak ditemukan' });
      }

      res.json(update);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  DeleteDokter: async (req, res) => {
    try {
      const { id } = req.params;
      await Dokter.deleteDokter(id);
      res.json({ message: 'delete berhasil' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
};
module.exports = DokterController;
