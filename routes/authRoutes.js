const express = require('express');
const { register, login, updateUser, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para registrar novo usuário
router.post('/register', register);

// Rota para login de usuário
router.post('/login', login);

// Rota para atualizar dados do usuário
// Requer autenticação

module.exports = router;
