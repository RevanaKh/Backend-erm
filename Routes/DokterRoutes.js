const express = require('express');
const router = express.Router();
const DokterController = require('../Controller/DokterController.js');
const { authMiddleware, adminMiddleware } = require('../middleware/Authmiddleware.js');

// api dokter
router.post('/createdokter', authMiddleware, adminMiddleware, DokterController.createDokter);
router.get('/getdokter', authMiddleware, adminMiddleware, DokterController.getSemuaDokter);
router.put('/:id', authMiddleware, adminMiddleware, DokterController.UpdateDokter);
router.delete('/:id', authMiddleware, adminMiddleware, DokterController.DeleteDokter);

// api pasien

module.exports = router;
