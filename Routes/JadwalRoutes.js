const express = require('express');
const router = express.Router();
const JadwalController = require('../Controller/JadwalController.js');
const { authMiddleware, adminMiddleware, dokterMiddleware } = require('../middleware/Authmiddleware.js');
// api jadwal
router.post('/create', authMiddleware, adminMiddleware, JadwalController.createJadwal);
router.get('/getjadwal', authMiddleware, JadwalController.getAllJadwal);
router.get('/getjadwalid', authMiddleware, dokterMiddleware, JadwalController.getjadwaldokterbyid);
router.put('/:id', authMiddleware, adminMiddleware, JadwalController.updatejadwal);
router.delete('/:id', authMiddleware, adminMiddleware, JadwalController.deleteJadwal);

module.exports = router;
