const express = require('express');
const { register, login, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para registrar um novo usuário
router.post('/register', register);

// Rota para login de usuário
router.post('/login', login);

// Rota para atualizar os dados do usuário autenticado
router.put('/update', protect, updateUser);

// Rota para deletar a conta do usuário autenticado
router.delete('/delete', protect, deleteUser);

module.exports = router;
