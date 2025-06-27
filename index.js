/* 
file in JavaScript che: 
- crea e configura l’app Express
- imposta i middleware per leggere JSON e dati da form
- definisce una route GET di base
- importa e collega tutte le altre route definite in endopoints.js
- avvia il server sulla porta 3000 
*/

const express = require('express');
const cors = require('cors'); // COSA FA E A COSA SERVE?
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger_output.json');
const app = express();

app.use(cors()); // COSA FA E A COSA SERVE?
app.use(express.json()) // fa il parse di un json
app.use(express.urlendcoded({ extended: true })) // le cose codificate li trasforma lui, cosi che può vederli

const port = 3000 //COSA FA E A COSA SERVE?
app.listen(port, () => {
    console.log('project on port ${port}')
})

const swaggerFile = ('./swaggerFile.json')
app.use('/doc', swaggerUI.serve, swaggerUi.setup(swaggerFile)) // 


// DA QUI IN POI NON SO COSA SIANO E A COSA SERVONO 

// Importa le route
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

app.get("/", (req, res) => {
    res.status(200).send({ info: "Node + Express + PG API" })
})

require('./endopoints')(app) //endpoints


// molto probabilmente avrò bisogno di altro
// sicuramente di capire cosa sto facendo e se i dati delle porte ecc. sono giusti