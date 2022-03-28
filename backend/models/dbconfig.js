const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DATABASE,
    { useNewUrlParser: true,
      useUnifiedTopology: true })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((err) => console.log('Connexion à MongoDB échouée ! = ', err));