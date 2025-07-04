/* 
file in JavaScript che: 
- crea e configura l’app Express
- imposta i middleware per leggere JSON e dati da form
- definisce una route GET di base
- importa e collega tutte le altre route definite in endopoints.js
- avvia il server sulla porta 3000 
*/

const express = require('express');
const cors = require('cors'); // permette al frontend di comunicare con le tue API
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware per leggere body JSON nelle richieste
app.use(express.urlencoded({ extended: true })); // Se volessi leggere dati da form HTML tradizionali (x-www-form-urlencoded)

const port = 3000;
app.listen(port, () => {
    console.log(`Server attivo sulla porta ${port}`);
});

// Configuro Swagger su /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Definisco una route di base di test
app.get("/", (req, res) => {
    res.status(200).send({ info: "Node + Express + PostgreSQL API fotogram | go to http://localhost:3000/api-docs" });
});

// Importo e collego tutte le route
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const followRoutes = require('./routes/follow');
app.use('/api/follow', followRoutes);

const likeRoutes = require('./routes/like');
app.use('/api/like', likeRoutes);

const moderazioneRoutes = require('./routes/moderazione');
app.use('/api/moderazione', moderazioneRoutes);

const postRoutes = require('./routes/post');
app.use('/api/post', postRoutes);

const profiloRoutes = require('./routes/profilo');
app.use('/api/profilo', profiloRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
