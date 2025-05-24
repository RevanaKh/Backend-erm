const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/authRoutes.js')
const userRoutes = require('./Routes/UserRoutes.js')
const dokterRoutes = require('./Routes/DokterRoutes.js')
const app = express();
const corsOptions = {
  origin: ['http://192.168.100.230:3000', 'http://localhost:3000',],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
};
app.use(express.json());
app.use(cors(corsOptions));
app.use('/api/users', userRoutes);
app.use('/api/auth' , authRoutes)
app.use('/api/dokter' , dokterRoutes)
module.exports = app;