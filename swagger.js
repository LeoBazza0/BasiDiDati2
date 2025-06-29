const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Fotogram API',
        description: 'API REST per il progetto Fotogram',
    },
    host: 'localhost:3000',
    schemes: ['http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);

// Cancella node_modules - Cancella package-lock.json - Esegui: npm install - Verrà rigenerato perfettamente aggiornato
