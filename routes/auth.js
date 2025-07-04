const express = require('express');
const bcrypt = require('bcryptjs'); // per hashare le password
const jwt = require('jsonwebtoken'); // per generare token JWT
const pool = require('../db'); // connessione al database
const router = express.Router();

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

// Chiave segreta per JWT
const JWT_SECRET = '1234fotogram';

//REGISTER
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Controllo se username o email già esistono nel database
    const userCheck = await pool.query(
      'SELECT * FROM utente WHERE Username = $1 OR Email = $2',
      [username, email]
    );

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'Username o email già utilizzati' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO utente (Username, Email, Password) VALUES ($1, $2, $3)',
      [username, email, hashedPassword]
    );

    res.status(201).json({ message: 'Registrazione completata' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore del server durante la registrazione' });
  }
});

//LOGIN
router.post('/login', async (req, res) => {

  // Destrutturo i dati ricevuti
  const { username, password } = req.body;

  try {
    const userCheck = await pool.query(
      'SELECT * FROM utente WHERE Username = $1',
      [username]
    );

    if (userCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Username o password errati' });
    }

    const user = userCheck.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Username o password errati' });
    }

    // Creo il token JWT con payload: username e ruolo base 
    const token = jwt.sign(
      { username: user.username },
      JWT_SECRET,
      { expiresIn: '3h' } // durata di validità del token
    );

    // Invio il token al client
    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore del server durante il login' });
  }
});

//LOGOUT 
// Questa route è solo "simbolica", giusto per confermare il logout, Il logout lato API si gestisce lato client cancellando il token salvato

router.post('/logout', (req, res) => {
  // Non serve fare niente lato server, basta che il client elimini il token salvato
  res.json({ message: 'Logout effettuato (cancella il token lato client)' });
});

module.exports = router;
