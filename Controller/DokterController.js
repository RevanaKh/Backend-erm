const Dokter = require('../Models/Jadwaldokter.js');

const DokterController = {
  createJadwal: async (req, res) => {
    try {
      const { dokter, poli, hari, jam_mulai, jam_selesai, status } = req.body;

      if (!dokter || !poli || !hari || !jam_mulai || !jam_selesai) {
        return res.status(400).json({ message: "Semua field wajib diisi." });
      }

      const result = await Dokter.Createjadwal({
        dokter,
        poli,
        hari,
        jam_mulai,
        jam_selesai,
        status
      });

      res.status(201).json({ message: "Jadwal berhasil ditambahkan", data: result });
    } catch (error) {
      console.error("Error saat membuat jadwal:", error);
      res.status(500).json({ message: "Terjadi kesalahan saat membuat jadwal" });
    }
  },
    getAllJadwal: async (req, res) => {
    try {
      const data = await Dokter.getAllJadwal();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error mengambil semua jadwal:", error);
      res.status(500).json({ message: "Gagal mengambil data jadwal" });
    }
  },
};

module.exports = DokterController;
