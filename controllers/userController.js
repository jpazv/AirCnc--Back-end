const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Função auxiliar para gerar tokens JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Registrar novo usuário
// @route   POST /api/users/register
// @access  Público
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar se o usuário já existe
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'Usuário já existe' });
    }

    // Criptografar a senha antes de salvar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Criar novo usuário
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Retornar o token JWT e os dados do usuário
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro no servidor' });
  }
};

// @desc    Autenticar usuário e logar
// @route   POST /api/users/login
// @access  Público
exports.login = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email }).select('+password');
  
      if (user && (await user.matchPassword(password))) {
        res.json({
          message: 'Login realizado com sucesso!',
          _id: user._id,
          name: user.name,
          email: user.email,
          token: generateToken(user._id),
        });
      } else {
        res.status(400).json({ message: 'Credenciais inválidas' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Erro ao realizar o login' });
    }
  };
  

// @desc    Atualizar dados do usuário
// @route   PUT /api/users/update
// @access  Privado (somente o usuário autenticado pode atualizar seus dados)
exports.updateUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Encontrar o usuário autenticado
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizar os campos se foram fornecidos no body
    if (name) user.name = name;
    if (email) user.email = email;

    // Atualizar senha se fornecida
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    // Salvar as alterações
    const updatedUser = await user.save();

    // Retornar os dados atualizados e, opcionalmente, um novo token JWT
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar o usuário' });
  }
};

// @desc    Deletar usuário
// @route   DELETE /api/users/delete
// @access  Privado (somente o usuário autenticado pode deletar sua conta)
exports.deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
  
      // Deletar todas as reservas feitas pelo usuário
      await Booking.deleteMany({ user: req.user._id });
  
      // Deletar todas as avaliações feitas pelo usuário
      await Review.deleteMany({ user: req.user._id });
  
      // Deletar o próprio usuário
      await user.remove();
  
      res.status(200).json({ message: 'Conta de usuário e dependências deletadas com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro ao deletar a conta do usuário' });
    }
  };
