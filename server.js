const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const MONGO_URI = 'mongodb://localhost:27017/tagliatore';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(cors());

const dishRoutes = require('./routes/dishes');
app.use('/api/dishes', dishRoutes);

const clientRoutes = require('./routes/clients');
app.use('/api/clients', clientRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);


const waiterRoutes = require('./routes/waiters');
app.use('/api/waiters', waiterRoutes);


const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
