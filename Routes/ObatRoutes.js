const express = require('express');
const router = express.Router();
const dataObatController = require('../Controller/ObatController.js');
const { authMiddleware, adminMiddleware, AdminOrApotekerDokterMiddleware } = require('../middleware/Authmiddleware.js');

router.get('/dataobat', authMiddleware, AdminOrApotekerDokterMiddleware, dataObatController.getAllObat);
router.post('/createobat', authMiddleware, AdminOrApotekerDokterMiddleware, dataObatController.createObat);
router.put('/:id', authMiddleware, AdminOrApotekerDokterMiddleware, dataObatController.updateObat);
router.delete('/:id', authMiddleware, AdminOrApotekerDokterMiddleware, dataObatController.deleteObat);

module.exports = router;
