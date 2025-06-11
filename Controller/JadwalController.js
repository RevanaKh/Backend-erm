const JadwalDokter = require('../Models/Jadwaldokter.js');
const Pendaftaran = require('../Models/Pendaftaran.js');
const db = require('../Config/db.js');

const JadwalController = {
  getjadwaldokterbyid: async (req, res) => {
    try {
      const userId = req.user.id;

      const [dokterRows] = await db.query('SELECT id FROM dokter WHERE user_id = ?', [userId]);

      if (dokterRows.length === 0) {
        return res.status(404).json({ message: 'JadwalDokter tidak ditemukan untuk user ini' });
      }

      const dokterId = dokterRows[0].id;

      const data = await JadwalDokter.getJadwalbyid(dokterId);

      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  createJadwal: async (req, res) => {
    try {
      const { id_dokter, hari, jam_mulai, jam_selesai, status } = req.body;

      if (!hari || !jam_mulai || !jam_selesai) {
        return res.status(400).json({ message: 'Semua field wajib diisi.' });
      }

      const result = await JadwalDokter.Createjadwal({
        id_dokter,
        hari,
        jam_mulai,
        jam_selesai,
        status,
      });

      res.status(201).json({ message: 'Jadwal berhasil ditambahkan', data: result });
    } catch (error) {
      console.error('Error saat membuat jadwal:', error);
      res.status(500).json({ message: 'Terjadi kesalahan saat membuat jadwal' });
    }
  },
  getAllJadwal: async (req, res) => {
    try {
      const data = await JadwalDokter.getAllJadwal();
      res.status(200).json(data);
    } catch (error) {
      console.error('Error mengambil semua jadwal:', error);
      res.status(500).json({ message: 'Gagal mengambil data jadwal' });
    }
  },
  updatejadwal: async (req, res) => {
    try {
      const { id } = req.params;
      const jadwal = await JadwalDokter.update(id, req.body);
      res.json(jadwal);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  deleteJadwal: async (req, res) => {
    try {
      const { id } = req.params;
      await JadwalDokter.delete(id);
      res.json({ message: 'Jadwal deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = JadwalController;
