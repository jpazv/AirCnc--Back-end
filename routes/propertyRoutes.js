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

// Rota para listar todas as propriedades
router.route('/')
  .get(getProperties) // Listar todas as propriedades
  .post(protect, createProperty); // Criar nova propriedade (protegido)

// Rota para obter, atualizar e deletar uma propriedade por ID
router.route('/:id')
  .get(getProperty) // Obter propriedade por ID (público)
  .put(protect, updateProperty) // Atualizar propriedade (somente proprietário)
  .delete(protect, deleteProperty); // Deletar propriedade (somente proprietário)

module.exports = router;
