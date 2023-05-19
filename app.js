const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

const productsRoutes = require('./routes/products');

// connect to mongoDB
mongoose.connect(`mongodb+srv://maximegodfroy:jWAKTOKVsBamO9G8@cluster0.fgpeope.mongodb.net/?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// CORS configuration
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/products', productsRoutes);

module.exports = app;
