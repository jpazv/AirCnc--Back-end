const express = require('express');
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Rota para listar todas as propriedades ou criar uma nova propriedade (rota protegida)
router.route('/')
  .get(getProperties) // Listar todas as propriedades (acesso público)
  .post(protect, createProperty); // Criar nova propriedade (somente usuários autenticados)

// Rota para obter, atualizar e deletar uma propriedade específica por ID
router.route('/:id')
  .get(getProperty) // Obter uma propriedade específica pelo ID (acesso público)
  .put(protect, updateProperty) // Atualizar propriedade (somente o proprietário pode)
  .delete(protect, deleteProperty); // Deletar propriedade (somente o proprietário pode)

module.exports = router;
