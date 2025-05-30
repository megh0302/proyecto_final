const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const reportRoutes = require('./routes/reportRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/reservations', require('./routes/reservationRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/admin', reportRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));