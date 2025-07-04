const express = require('express');
const router = express.Router();
const PendaftaranController = require('../Controller/PendaftaranController.js');
const { authMiddleware, adminMiddleware, dokterMiddleware } = require('../middleware/Authmiddleware.js');
const userController = require('../Controller/UserController.js');

router.post('/daftar', authMiddleware, PendaftaranController.daftarPasien);
router.get('/antrian', authMiddleware, PendaftaranController.getAntrianpasienbyid);
router.get('/getpasien', authMiddleware, dokterMiddleware, PendaftaranController.getPasienByPoli);
router.post('/pemeriksaan', authMiddleware, dokterMiddleware, PendaftaranController.PemeriksaanPasien);
router.get('/getdaftar', authMiddleware, adminMiddleware, PendaftaranController.getpendaftaran);
router.get('/getpemeriksaan', authMiddleware, PendaftaranController.PemeriksaanByEmail);
router.get('/pembayaranpasien', authMiddleware, PendaftaranController.getStatusPembayaranPasien);
router.get('/getpembayaran', authMiddleware, adminMiddleware, PendaftaranController.getPembayaran);
router.put('/:id', authMiddleware, adminMiddleware, PendaftaranController.UpdateStatusPembayaran);
router.delete('/:id', authMiddleware, adminMiddleware, PendaftaranController.DeletePendantaran);
router.delete('/antrian/:id', authMiddleware, PendaftaranController.DeleteAntrian);
router.get('/pesan', authMiddleware, userController.getPesanFromAdmin);
router.get('/laporansaya', authMiddleware, userController.getLaporanid);

module.exports = router;
