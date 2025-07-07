const express = require('express');
const router = express.Router();

const { register, login, logout, verify, profile } = require('../controllers/authController');
const { validateLogin, validateRegister, handleValidationErrors } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

router.post('/register', validateRegister, handleValidationErrors, register);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', logout);
router.get('/verify', verify);
router.get('/profile', authenticateToken, profile);

module.exports = router; 