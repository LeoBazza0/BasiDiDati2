const jwt = require('jsonwebtoken');
const JWT_SECRET = '1234fotogram';

/**
 * Middleware di autenticazione:
 * - controlla che nella richiesta ci sia il token JWT
 * - verifica che sia valido
 * - se sì, aggiunge il payload del token a req.user e prosegue
 * - se no, restituisce errore di accesso negato
 */
function authenticateToken(req, res, next) {
  // Leggo l'header Authorization (tipo 'Bearer <token>')
  const authHeader = req.headers['authorization'];

  // Estraggo il token dalla stringa 'Bearer <token>'
  const token = authHeader && authHeader.split(' ')[1];

  // Se non c'è il token, nego l'accesso
  if (token == null) {
    return res.status(401).json({ message: 'Token mancante. Effettua il login.' });
  }

  // Verifico che il token sia valido
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      // Se il token è scaduto o non valido
      return res.status(403).json({ message: 'Token non valido o scaduto' });
    }

    // Se tutto ok, salvo i dati del token nel request (disponibile per le route successive)
    req.user = user;

    // Passo al prossimo middleware o alla route
    next();
  });
}

// Esporto il middleware per usarlo nelle route
module.exports = authenticateToken;
