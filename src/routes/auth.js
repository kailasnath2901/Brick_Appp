const express = require('express');
const router = express.Router();
const authController = require('../controller/auth.controller');
const { authenticateToken } = require('../middleware/auth');
const { validateLogin, validateRegister, validateChangePassword } = require('../middleware/validation');

// Public routes (NO authentication required)
router.post('/login', validateLogin, authController.login);
router.post('/super-admin/login', validateLogin, authController.superAdminLogin);
router.post('/register', validateRegister, authController.register);
router.post('/verify-token', authController.verifyToken);

// ONLY routes below this line require authentication 
router.use(authenticateToken);

// Protected routes (require valid token)
router.get('/profile', authController.getProfile);
router.post('/change-password', validateChangePassword, authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;

