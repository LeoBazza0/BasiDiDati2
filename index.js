/* 
file in JavaScript che: 
- crea e configura l’app Express
- imposta i middleware per leggere JSON e dati da form
- definisce una route GET di base
- importa e collega tutte le altre route definite in endopoints.js
- avvia il server sulla porta 3000 
*/

const express = require('express')
const app = express()
const swaggerUi = require('swagger-ui-express')

const port = 3000
app.use(express.json()) // fa il parse di un json
app.use(express.urlendcoded({ extended: true })) // le cose codificate li trasforma lui, cosi che può vederli

app.listen(port, () => {
    console.log('project on port ${port}') 
})

app.get("/", (req, res) => {
    res.status(200).send({ info: "Node + Express + PG API" })
})

const swaggerFile = ('./swaggerFile.json')
app.use('/doc', swaggerUI.serve, swaggerUi.setup(swaggerFile)) // 

require('./endopoints')(app) //endpoints


// molto probabilmente avrò bisogno di altro
// sicuramente di capire cosa sto facendo e se i dati delle porte ecc. sono giusti