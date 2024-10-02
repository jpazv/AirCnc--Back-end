const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Carregar variáveis de ambiente
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(express.json()); // Permite JSON no body

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Usar as rotas
app.use('/api/users', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/edit', userRoutes);

// Inicializar servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
