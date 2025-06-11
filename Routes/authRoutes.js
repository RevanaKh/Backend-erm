// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controller/AuthController.js');
const { authMiddleware } = require('../middleware/Authmiddleware.js');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authMiddleware, authController.getMe);
router.get('/user', authMiddleware, authController.getuserByid);
router.put('/:id', authMiddleware, authController.updateUserid);
router.post('/logout', authController.logout);
module.exports = router;
