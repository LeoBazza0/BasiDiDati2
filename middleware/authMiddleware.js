const jwt = require('jsonwebtoken');
const JWT_SECRET = '1234fotogram';

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * Middleware di autenticazione:
 * - controlla che nella richiesta ci sia il token JWT
 * - verifica che sia valido
 * - se sì, aggiunge il payload del token a req.user e prosegue
 * - se no, restituisce errore di accesso negato
 */

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Estraggo il token dalla stringa 'Bearer <token>'
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Token mancante. Effettua il login.' });
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
