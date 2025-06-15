const Pendaftaran = require('../Models/Pendaftaran');
const db = require('../Config/db.js');
const User = require('../Models/Users.js');

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const localizedFormat = require('dayjs/plugin/localizedFormat');

require('dayjs/locale/id');

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

dayjs.locale('id');

const hariKeIndex = {
  minggu: 0,
  senin: 1,
  selasa: 2,
  rabu: 3,
  kamis: 4,
  jumat: 5,
  sabtu: 6,
};
function getTanggalBerikutnya(hari) {
  const today = dayjs().tz('Asia/Jakarta');
  const targetDay = hariKeIndex[hari];
  const currentDay = today.day();
  const diff = (targetDay + 7 - currentDay) % 7 || 7;
  return today.add(diff, 'day').format('YYYY-MM-DD');
}

const PendaftaranController = {
  daftarPasien: async (req, res) => {
    try {
      const { nama_pasien, poli, keluhan, nik, tanggalLahir, jenisKelamin, alamat, metodePembayaran, status_pernikahan, golongan_darah, pekerjaan } = req.body;
      const emailuser = req.user.email;
      const userId = req.user.id;
      const daftarDokter = await Pendaftaran.getDokterByPoli(poli);
      if (daftarDokter.length === 0) {
        return res.status(404).json({ message: 'Tidak ada dokter tersedia untuk poli ini' });
      }

      const tanggalPemeriksaan = getTanggalBerikutnya(daftarDokter[0].hari);

      let dokterTerpilih = null;
      let antrianTerkecil = Infinity;

      for (const dokter of daftarDokter) {
        const jumlah = await Pendaftaran.getJumlahAntrian(tanggalPemeriksaan, dokter.id);
        if (jumlah < antrianTerkecil) {
          antrianTerkecil = jumlah;
          dokterTerpilih = dokter;
        }
      }

      if (!dokterTerpilih) {
        return res.status(500).json({ message: 'Gagal menentukan dokter dengan antrian terkecil' });
      }

      const jumlahAntrian = antrianTerkecil;
      const no_antrian = `Q-${jumlahAntrian + 1}JDK`;

      const [rows] = await db.query(`SELECT COUNT(*) AS count FROM pendaftaran WHERE email = ? AND DATE(waktu_daftar) = CURDATE()`, [emailuser]);

      if (rows[0].count >= 1) {
        return res.status(429).json({ message: 'Anda dalam antrian hari ini' });
      }

      const result = await Pendaftaran.simpanPendaftaran({
        dokter_id: dokterTerpilih.id_dokter,
        user_id: userId,
        nama_pasien,
        email: emailuser,
        poli,
        nik,
        tanggalLahir,
        jenisKelamin,
        keluhan,
        alamat,
        metodePembayaran,
      });
      // await User.createData({
      //   user_id: userId,
      //   status_pernikahan,
      //   golongan_darah,
      //   pekerjaan,
      // });
      const pendaftaran_id = result.insertId;

      await Pendaftaran.simpanAntrian({
        pendaftaran_id,
        tanggal_pemeriksaan: tanggalPemeriksaan,
        dokter_id: dokterTerpilih.id,
        nama_dokter: dokterTerpilih.nama,
        poli,
        no_antrian,
      });

      await Pendaftaran.SimpanPemeriksaan({
        pendaftaran_id,
        dokter_id: dokterTerpilih.id_dokter,
        status_pemeriksaan: 'menunggu',
      });
      await Pendaftaran.simpanStatusPembayaran({
        id_pendaftaran: pendaftaran_id,
        status_pembayaran: 'belum lunas',
      });
      return res.json({
        pendaftaran_id,
        poli,
        nama_dokter: dokterTerpilih.dokter,
        tanggal_pemeriksaan: tanggalPemeriksaan,
        no_antrian,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },
  DeletePendantaran: async (req, res) => {
    try {
      const { id } = req.params;
      await Pendaftaran.deletePendaftaran(id);
      res.json({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  DeleteAntrian: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Pendaftaran.deletePendaftaran(id);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Data antrian tidak ditemukan' });
      }

      return res.status(200).json({ message: 'Data antrian berhasil dihapus' });
    } catch (error) {
      console.error('Error saat menghapus antrian:', error);
      return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
  },
  getpendaftaran: async (req, res) => {
    try {
      const pendaftaran = await Pendaftaran.getpendaftaran();
      res.json(pendaftaran);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  getAntrianpasienbyid: async (req, res) => {
    try {
      const email = req.user.email;

      const getantrian = await Pendaftaran.findAntrianByPendaftaranEmail(email);

      if (!getantrian || getantrian.length === 0) {
        return res.status(404).json({ message: 'Antrian tidak ditemukan' });
      }

      res.json({ data: getantrian });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
  },
  getPasienByPoli: async (req, res) => {
    try {
      const poliDokter = req.user.poli;

      const pasien = await Pendaftaran.getpasienbypoli(poliDokter);

      res.json(pasien);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  PemeriksaanPasien: async (req, res) => {
    try {
      const { pendaftaran_id, diagnosa, tindakan, obat, status_pemeriksaan } = req.body;

      const checkPemeriksaan = await Pendaftaran.getpendaftaranId(pendaftaran_id);
      const checkPemabayaran = await Pendaftaran.checkPembayaran(pendaftaran_id);
      if (checkPemabayaran.length > 0) {
        const updatepembayaran = await Pendaftaran.updatepembayaran(pendaftaran_id, obat);
        res.status(200).json({
          message: 'update pembayaran berhasil',
          data: updatepembayaran,
        });
      } else {
        const pembayaran = await Pendaftaran.simpanStatusPembayaran({
          id_pendaftaran: pendaftaran_id,
          id_obat: obat,
          status_pembayaran: 'belum lunas',
        });
        res.status(200).json({ message: 'Pemeriksaan Berhasil Disimpan', data: pembayaran });
      }
      if (checkPemeriksaan.length > 0) {
        const pemeriksaan = await Pendaftaran.updatePemeriksaan(pendaftaran_id, diagnosa, tindakan, obat, status_pemeriksaan);
        res.status(200).json({
          message: 'Pemeriksaan Berhasil',
          data: pemeriksaan,
        });
      } else {
        const result = await Pendaftaran.SimpanPemeriksaan({
          pendaftaran_id,
          diagnosa,
          tindakan,
          obat,
          status_pemeriksaan,
        });
        res.status(200).json({ message: 'Pemeriksaan Berhasil Disimpan', data: result });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  },
  PemeriksaanByEmail: async (req, res) => {
    try {
      const email = req.user.email;
      const pemeriksaan = await Pendaftaran.getPemeriksaanByEmail(email);

      res.status(200).json({
        status: 'success',
        message: 'Data pemeriksaan berhasil diambil.',
        data: pemeriksaan,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: err.message });
    }
  },
  UpdateStatusPembayaran: async (req, res) => {
    try {
      const { pendaftaran_id, status_pembayaran } = req.body;
      const response = await Pendaftaran.UpdateStatusPembayaran(pendaftaran_id, status_pembayaran);
      res.status(200).json({
        message: 'update pembayaran berhasil',
        data: response,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: err.message });
    }
  },
  getPembayaran: async (req, res) => {
    try {
      const response = await Pendaftaran.getStatusPembayaran();
      res.status(200).json(response);
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: err.message });
    }
  },
  getStatusPembayaranPasien: async (req, res) => {
    try {
      const userId = req.user.id;
      const data = await Pendaftaran.getStatusPembayaranByUser(userId);

      res.status(200).json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Gagal mengambil data pembayaran pasien' });
    }
  },
};

module.exports = PendaftaranController;
