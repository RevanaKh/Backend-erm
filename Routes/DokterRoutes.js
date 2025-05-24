// authRoutes.js
const express = require('express');
const router = express.Router();
const DokterController = require('../Controller/DokterController.js')
const { authMiddleware, adminMiddleware } = require('../middleware/Authmiddleware.js');

router.post('/create', authMiddleware,DokterController.createJadwal);
router.get('/getjadwal',  authMiddleware, DokterController.getAllJadwal);
module.exports = router;