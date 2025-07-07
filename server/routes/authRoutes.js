const express = require('express');
const router = express.Router();

const { register, login, logout, verify, profile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { loginSchema, registerSchema, validateRequest } = require('../schemas/authSchemas');

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.post('/logout', logout);
router.get('/verify', verify);
router.get('/profile', authenticateToken, profile);

module.exports = router; 