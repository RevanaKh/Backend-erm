const dataObatModel = require('../Models/DataObat.js');

const dataObatController = {
  getAllObat: async (req, res) => {
    try {
      const data = await dataObatModel.getAllObat();
      res.json(data);
    } catch (error) {
      console.error(err);

      res.status(500).json({ error: 'Gagal mengambil data obat' });
    }
  },

  createObat: async (req, res) => {
    try {
      const obat = req.body;
      console.log(obat);
      const newObat = await dataObatModel.createObat(obat);
      res.status(201).json(newObat);
    } catch (err) {
      console.error(err);

      res.status(500).json({ err: 'Gagal menambahkan data obat', message: err.message });
    }
  },

  updateObat: async (req, res) => {
    try {
      const id = req.params.id;
      const obat = req.body;
      const success = await dataObatModel.updateObat(id, obat);

      if (success) {
        res.json({ message: 'Data obat berhasil diperbarui' });
      } else {
        res.status(404).json({ error: 'Obat tidak ditemukan' });
      }
    } catch (error) {
      console.error(err);

      res.status(500).json({ error: 'Gagal memperbarui data obat' });
    }
  },

  deleteObat: async (req, res) => {
    try {
      const id = req.params.id;
      const success = await dataObatModel.deleteObat(id);

      if (success) {
        res.json({ message: 'Data obat berhasil dihapus' });
      } else {
        res.status(404).json({ error: 'Obat tidak ditemukan' });
      }
    } catch (error) {
      console.error(err);

      res.status(500).json({ error: 'Gagal menghapus data obat' });
    }
  },
};

module.exports = dataObatController;
