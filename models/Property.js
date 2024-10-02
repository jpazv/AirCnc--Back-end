const mongoose = require('mongoose');

const PropertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor, insira o título da propriedade'],
  },
  description: {
    type: String,
    required: [true, 'Por favor, insira a descrição da propriedade'],
  },
  location: {
    type: String,
    required: [true, 'Por favor, insira a localização'],
  },
  price: {
    type: Number,
    required: [true, 'Por favor, insira o preço da propriedade'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Property', PropertySchema);
