const Review = require('../models/Review');

// Criar um novo comentário e avaliação
exports.createReview = async (req, res) => {
  const { propertyId, rating, comment } = req.body;

  try {
    // Verifica se o usuário já fez uma avaliação para essa propriedade
    const existingReview = await Review.findOne({ property: propertyId, user: req.user._id });

    if (existingReview) {
      return res.status(400).json({ message: 'Você já fez uma avaliação para esta propriedade' });
    }

    // Criar um novo comentário e avaliação
    const review = await Review.create({
      property: propertyId,
      user: req.user._id, // Usuário autenticado
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar avaliação' });
  }
};

// Listar avaliações de uma propriedade
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId }).populate('user', 'name email');
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar avaliações' });
  }
};
