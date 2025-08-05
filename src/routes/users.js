const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, adminAndAbove, superAdminOnly } = require('../middleware/auth');
const { validateRegister, validateUpdateUser } = require('../middleware/validation');

// All user routes require authentication
router.use(authenticateToken);

// Routes accessible by admins and above
router.get('/', adminAndAbove, userController.getAllUsers);
router.get('/stats', adminAndAbove, userController.getUserStats);
router.get('/role/:role', adminAndAbove, userController.getUsersByRole);
router.get('/:id', adminAndAbove, userController.getUserById);
router.put('/:id', adminAndAbove, validateUpdateUser, userController.updateUser);
router.put('/:id/activate', adminAndAbove, userController.activateUser);

// Routes accessible only by super admin
router.post('/', superAdminOnly, validateRegister, userController.createUser);
router.delete('/:id', superAdminOnly, userController.deleteUser);



module.exports = router;