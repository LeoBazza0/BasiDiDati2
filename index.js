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

/*
1. fai il server su pgadmin (create -> database)
2. tasto destro sul server -> query tool
3. inserisci il file SQL createtable.sql -> F5
4. stessa cosa con insert.sql -> F5
5. in db.js modifica i dati per far si che matchino con quelli della macchina su cui lavori
6. (facoltativo) nel terminale del codice -> npm install (legge package.js e scarica le node_modules/ ) 
7. (facoltativo) nel terminale del codice -> node swagger.js (crea/aggiorna swagger_output.json)
8. nel terminale del codice -> node index.js 
9. vai su http://localhost:3000/api-docs 
10. dopo che si fa login, viene dato un JWT token, TIENILO e mettilo nell'header quando lo chiede con la parola "Bearer" davanti
*/
