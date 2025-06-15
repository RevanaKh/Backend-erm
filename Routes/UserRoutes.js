// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController.js');
const { authMiddleware, adminMiddleware } = require('../middleware/Authmiddleware.js');

router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.get('/laporan', authMiddleware, adminMiddleware, userController.getReport);
router.post('/createpasien', authMiddleware, adminMiddleware, userController.createpasien);
router.post('/createuser', authMiddleware, adminMiddleware, userController.createUsers);
router.get('/search', authMiddleware, adminMiddleware, userController.searchByNIK);
router.get('/:id', authMiddleware, adminMiddleware, userController.getuserbyid);
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser);
router.put('/editreport/:id', authMiddleware, adminMiddleware, userController.updatePwEmail);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);
router.delete('/deletereport/:id', authMiddleware, adminMiddleware, userController.deleteReport);
router.post('/report', authMiddleware, userController.ReportFromUser);
router.post('/pesan', authMiddleware, adminMiddleware, userController.kirimPesanAdmin);

module.exports = router;
