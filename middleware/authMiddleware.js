const jwt = require('jsonwebtoken');
const JWT_SECRET = '1234fotogram';


// Middleware di autenticazione:

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Estraggo il token dalla stringa 'Bearer <token>'
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Token mancante. Effettua il login e prendi il token.' });
    }

    // Verifico che il token sia valido
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token non valido o scaduto' });
        }

        //tutto ok -> salvo i dati del token nel request
        req.user = user;

        next();
    });
}

// Esporto il middleware per usarlo nelle route
module.exports = authenticateToken;
