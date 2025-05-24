const User = require('../Models/Users.js');
const db = require('../Config/db.js')
const userController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
getuserbyid: async (req , res) => {
  try {
    const {id} =req.params
    const usersid = await User.getuserByid(id)
    res.json(usersid)
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
},
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.update(id, req.body);
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
    res.json(rows); // kembalikan array agar konsisten
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
      const { nama, nik , email,password,jenis_kelamin,alamat,tempat_lahir,tanggal_lahir,} = req.body;

      // Check if user exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Pengguna sudah ada' });
      }

  

      // Create user
      const user = await User.create({
        nama,
        nik,
        email,
        password: 'pasien123',
        jenis_kelamin,alamat,tempat_lahir,tanggal_lahir,
        role: 'pasien', 
      });

res.status(201).json({
  message: 'Pasien berhasil ditambahkan',
  user: {
    id: user.id,
    nama: user.nama,
    nik: user.nik,
    email: user.email,
    role: user.role
  }
});

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
}
};

module.exports = userController;