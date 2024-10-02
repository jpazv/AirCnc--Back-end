const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const userRoutes = require('./routes/userRoutes'); // Rotas de usuários
const propertyRoutes = require('./routes/propertyRoutes'); // Rotas de propriedades
const bookingRoutes = require('./routes/bookingRoutes'); // Rotas de reservas (bookings)
const reviewRoutes = require('./routes/reviewRoutes'); // Rotas de avaliações (reviews)

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Conectar ao MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conectado ao MongoDB'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Middleware para parsing de JSON
app.use(express.json());

// Segurança: Helmet para proteger os headers HTTP
app.use(helmet());

// CORS: Permitir acesso à API de domínios específicos
app.use(cors({
  origin: ['http://localhost:3000', 'https://meu-frontend.com'], // Ajuste o domínio conforme necessário
}));

// Rate Limiting: Limitar número de requisições por IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limitar a 100 requisições por 15 minutos
});
app.use(limiter);

// Rotas de Usuários
app.use('/api/users', userRoutes);

// Rotas de Propriedades
app.use('/api/properties', propertyRoutes);

// Rotas de Reservas (Bookings)
app.use('/api/bookings', bookingRoutes);

// Rotas de Avaliações (Reviews)
app.use('/api/reviews', reviewRoutes);

// Inicializar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
