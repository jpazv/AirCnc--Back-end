const Property = require('../models/Property');

// @desc    Criar uma nova propriedade
// @route   POST /api/properties
// @access  Privado (necessita autenticação)
exports.createProperty = async (req, res) => {
  const { title, description, location, price } = req.body;

  try {
    // Criar a propriedade associada ao proprietário (usuário autenticado)
    const property = await Property.create({
      title,
      description,
      location,
      price,
      owner: req.user._id, // req.user vem do middleware de autenticação
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Listar todas as propriedades
// @route   GET /api/properties
// @access  Público
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'name email');
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Obter uma propriedade específica
// @route   GET /api/properties/:id
// @access  Público
exports.getProperty = async (req, res) => {
    try {
      // Busca a propriedade pelo ID
      const property = await Property.findById(req.params.id).populate('owner', 'name email');
  
      if (!property) {
        return res.status(404).json({ message: 'Propriedade não encontrada' });
      }
  
      // Retorna a propriedade encontrada
      res.status(200).json(property);
    } catch (error) {
      console.error(error);
      // Retorna erro 500 se o ID for inválido ou outro erro ocorrer
      res.status(500).json({ message: 'Erro ao buscar a propriedade' });
    }
  };
  // @desc    Listar propriedades com paginação
// @route   GET /api/properties
// @access  Público
exports.getProperties = async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
  
    try {
      const count = await Property.countDocuments({});
      const properties = await Property.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1));
  
      res.status(200).json({
        properties,
        page,
        pages: Math.ceil(count / pageSize),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao buscar propriedades' });
    }
  };
// @desc    Relatório: Propriedades mais reservadas
// @route   GET /api/properties/top-reserved
// @access  Admin
exports.getTopReservedProperties = async (req, res) => {
    try {
      const topProperties = await Booking.aggregate([
        { $group: { _id: "$property", totalReservations: { $sum: 1 } } },
        { $sort: { totalReservations: -1 } },
        { $limit: 10 },
        { $lookup: { from: 'properties', localField: '_id', foreignField: '_id', as: 'propertyDetails' } }
      ]);
  
      res.status(200).json(topProperties);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao gerar o relatório' });
    }
  };
    
// @desc    Atualizar uma propriedade
// @route   PUT /api/properties/:id
// @access  Privado (somente o proprietário pode atualizar)
exports.updateProperty = async (req, res) => {
    try {
      // Buscar a propriedade pelo ID
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ message: 'Propriedade não encontrada' });
      }
  
      // Verificar se o usuário autenticado é o proprietário
      if (property.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Você não tem permissão para atualizar esta propriedade' });
      }
  
      // Atualizar a propriedade com os novos dados
      const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Retorna o documento atualizado
        runValidators: true, // Roda as validações do schema no Mongoose
      });
  
      res.status(200).json(updatedProperty);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  };

// @desc    Deletar uma propriedade
// @route   DELETE /api/properties/:id
// @access  Privado (somente o proprietário pode deletar)
//
exports.deleteProperty = async (req, res) => {
    try {
      // Buscar a propriedade pelo ID
      const property = await Property.findById(req.params.id);
  
      if (!property) {
        return res.status(404).json({ message: 'Propriedade não encontrada' });
      }
  
      // Verificar se o usuário autenticado é o proprietário
      if (property.owner.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Você não tem permissão para deletar esta propriedade' });
      }
  
      // Deletar a propriedade
      await property.deleteOne();
  
      res.status(200).json({ message: 'Propriedade removida com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro no servidor' });
    }
  };
