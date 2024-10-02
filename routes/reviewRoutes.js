const express = require('express');
const { createReview, getReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Criar uma nova avaliação
router.post('/', protect, createReview);

// Listar avaliações de uma propriedade
router.get('/:propertyId', getReviews);

module.exports = router;
