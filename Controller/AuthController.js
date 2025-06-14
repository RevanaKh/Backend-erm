const jwt = require('jsonwebtoken');
const User = require('../Models/Users.js');
const bcrypt = require('bcryptjs');

const authController = {
  register: async (req, res) => {
    try {
      const { nama, nik, email, password, jenis_kelamin, alamat, tempat_lahir, tanggal_lahir, status_pernikahan, golongan_darah, pekerjaan } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Pengguna sudah ada' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

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
      const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
      console.error('Gagal Registrasi:', err);

      res.status(500).json({ message: err.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'email atau password salah' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'email atau password salah' });
      }
      const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      if (user.role === 'dokter') {
        payload.poli = user.poli;
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '1h',
      });
      res.json({
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          ...(user.role === 'dokter' && { poli: user.poli }),
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
      console.error({ message: err.message });
    }
  },

  getMe: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      const user = await User.findByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const responseUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      if (user.role === 'dokter') {
        responseUser.poli = user.poli;
      }

      res.json(responseUser);
    } catch (err) {
      console.error('❌ Error getMe:', err.message);
      res.status(500).json({ message: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      console.log('🔓 Logout request diterima');
      res.status(200).json({ message: 'Logout success' });
    } catch (err) {
      console.error('❌ Logout error:', err.message);
      res.status(500).json({ message: 'Logout failed' });
    }
  },
  getuserByid: async (req, res) => {
    try {
      const user = await User.getuserByid(req.user.id);
      res.json(user);
    } catch (err) {
      console.error({ message: err.message });
      res.status(500).json({ message: err.message });
    }
  },
  updateUserid: async (req, res) => {
    try {
      const id = req.user.id;

      if (!id) {
        return res.status(401).json({ message: 'missing id' });
      }

      const user = await User.updateUserid(id, req.body);
      await User.updateDataUser(id, req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = authController;
