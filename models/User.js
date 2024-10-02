const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Definição do schema do usuário
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, insira seu nome'],
    trim: true,
    minlength: [3, 'O nome deve ter no mínimo 3 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'Por favor, insira seu email'],
    unique: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Por favor, insira um email válido',
    ],
  },
  password: {
    type: String,
    required: [true, 'Por favor, insira sua senha'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres'],
    select: false, // O campo senha não será retornado nas consultas por padrão
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware para criptografar a senha antes de salvar
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar a senha na autenticação
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre('remove', async function (next) {
    // Deletar todas as reservas feitas pelo usuário
    await Booking.deleteMany({ user: this._id });
  
    // Deletar todas as avaliações feitas pelo usuário
    await Review.deleteMany({ user: this._id });
  
    next();
  });
  

// Verifica se o modelo já foi registrado antes de defini-lo novamente
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
