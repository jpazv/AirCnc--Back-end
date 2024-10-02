const express = require('express');
const {
  createBooking,
  getBookings,
  getBookingById,
  deleteBooking,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Rota para criar uma nova reserva
router.post('/', protect, createBooking);

// Rota para listar todas as reservas de uma propriedade
router.get('/:propertyId', getBookings);

// Rota para obter detalhes de uma reserva específica
router.get('/booking/:id', protect, getBookingById);

// Rota para cancelar uma reserva
router.delete('/:id', protect, deleteBooking);

module.exports = router;
