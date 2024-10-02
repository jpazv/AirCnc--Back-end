const Booking = require('../models/Booking');
const Property = require('../models/Property');
const sendEmail = require('../utils/email');

// @desc    Criar nova reserva
// @route   POST /api/bookings
// @access  Privado (somente usuários autenticados)
exports.createBooking = async (req, res) => {
  const { propertyId, startDate, endDate } = req.body;

  try {
    // Verificar se a propriedade existe
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Propriedade não encontrada' });
    }

    // Verificar se a propriedade já está reservada para as datas fornecidas
    const conflictingBooking = await Booking.findOne({
      property: propertyId,
      $or: [
        { startDate: { $lt: endDate, $gte: startDate } },
        { endDate: { $gt: startDate, $lte: endDate } },
      ],
    });

    if (conflictingBooking) {
      return res.status(400).json({ message: 'Propriedade já reservada para essas datas.' });
    }

    // Criar nova reserva
    const booking = await Booking.create({
      property: propertyId,
      user: req.user._id, // Usuário autenticado
      startDate,
      endDate,
    });

    // Enviar email de confirmação ao usuário
    await sendEmail({
      email: req.user.email, // Email do usuário autenticado
      subject: 'Confirmação de reserva',
      message: `Sua reserva para ${property.title} foi confirmada de ${startDate} a ${endDate}.`,
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar reserva' });
  }
};

// @desc    Listar todas as reservas de uma propriedade
// @route   GET /api/bookings/:propertyId
// @access  Público
exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ property: req.params.propertyId }).populate('user', 'name email');
    if (!bookings.length) {
      return res.status(404).json({ message: 'Nenhuma reserva encontrada para esta propriedade.' });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar reservas' });
  }
};

// @desc    Obter detalhes de uma reserva específica
// @route   GET /api/bookings/booking/:id
// @access  Privado (somente usuários autenticados)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('property user', 'title name email');
    if (!booking) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }
    res.status(200).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar reserva' });
  }
};

// @desc    Cancelar uma reserva
// @route   DELETE /api/bookings/:id
// @access  Privado (somente usuários autenticados)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }

    // Verifica se o usuário é o dono da reserva
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Acesso não autorizado.' });
    }

    await booking.remove();
    res.status(200).json({ message: 'Reserva cancelada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao cancelar a reserva' });
  }
};
