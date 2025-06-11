const express = require('express');
const router = express.Router();
const ApotekerController = require('../Controller/ApotekerController.js');
const { authMiddleware, adminMiddleware, ApotekerMiddleware } = require('../middleware/Authmiddleware.js');

router.post('/', authMiddleware, adminMiddleware, ApotekerController.CreateApoteker);
router.get('/getapoteker', authMiddleware, authMiddleware, ApotekerController.GetApoteker);
router.put('/:id', authMiddleware, adminMiddleware, ApotekerController.UpdateApoteker);
router.delete('/:id', authMiddleware, adminMiddleware, ApotekerController.DeleteApoteker);
router.get('/selesai', authMiddleware, ApotekerMiddleware, ApotekerController.GetPemeriksaanSelesai);
router.post('/createobat', authMiddleware, ApotekerMiddleware, ApotekerController.createObat);
module.exports = router;
