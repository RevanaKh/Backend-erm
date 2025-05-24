// userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../Controller/UserController.js');
const { authMiddleware, adminMiddleware } = require('../middleware/Authmiddleware.js');

router.get('/', authMiddleware, adminMiddleware, userController.getAllUsers);
router.post('/createpasien', authMiddleware, adminMiddleware, userController.createpasien);
router.get('/search', authMiddleware, adminMiddleware, userController.searchByNIK);
router.get('/:id', authMiddleware, adminMiddleware, userController.getuserbyid);
router.put('/:id', authMiddleware, adminMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, adminMiddleware, userController.deleteUser);

module.exports = router;