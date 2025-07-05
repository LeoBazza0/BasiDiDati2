const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

/*
OTTIENI IL PROFILO DI UN UTENTE
GET /api/profilo/:username
Protezione: token JWT
Ritorna: username, email, immagine profilo, quanti segue, quanti lo seguono, suoi post
*/
router.get('/:username', authenticateToken, async (req, res) => {
    const usernameProfilo = req.params.username;

    try {
        const userCheck = await pool.query(
            'SELECT Username, Email, FotoProfilo FROM utente WHERE Username = $1',
            [usernameProfilo]
        );
        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        const utente = userCheck.rows[0];

        const seguiti = await pool.query(
            'SELECT COUNT(*) FROM follow WHERE Utente1 = $1',
            [usernameProfilo]
        );

        const seguaci = await pool.query(
            'SELECT COUNT(*) FROM follow WHERE Utente2 = $1',
            [usernameProfilo]
        );

        // Recupera i post dell'utente
        const post = await pool.query(
            `SELECT p.IdPost, p.DataPubblicazione, p.Moderato, 
              i.Pic, t.Txt,
              (SELECT COUNT(*) FROM "like" WHERE Post = p.IdPost) AS NumLike
       FROM post p
       LEFT JOIN immagine i ON p.IdPost = i.IdPost
       LEFT JOIN testo t ON p.IdPost = t.IdPost
       WHERE p.Utente = $1
       ORDER BY p.DataPubblicazione DESC`,
            [usernameProfilo]
        );

        // Rispondo con tutti i dati dell'utente selezionato
        res.status(200).json({
            profilo: {
                username: utente.username,
                email: utente.email,
                fotoProfilo: utente.fotoprofilo,
                seguiti: parseInt(seguiti.rows[0].count),
                seguaci: parseInt(seguaci.rows[0].count),
                post: post.rows
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel recuperare il profilo utente' });
    }
});

/*
MODIFICA IMMAGINE PROFILO
PATCH /api/profilo/immagine
Protezione: token JWT
Dati richiesti: immagine base64 (max 100kb)
 */


router.patch('/immagine', authenticateToken, async (req, res) => {
    const utente = req.user.username;
    const { immagine } = req.body;

    // Se manca l'immagine nel body
    if (!immagine) {
        return res.status(400).json({ message: 'Devi fornire un\'immagine in base64' });
    }

    // Controllo dimensione: base64 di 100kb ≈ 137000 byte
    const imageSize = Buffer.byteLength(immagine, 'base64');
    if (imageSize > 137000) {
        return res.status(400).json({ message: 'Immagine troppo grande (max 100kb)' });
    }

    try {
        // Aggiorno la foto profilo nel database
        await pool.query(
            'UPDATE utente SET FotoProfilo = $1 WHERE Username = $2',
            [Buffer.from(immagine, 'base64'), utente]
        );

        res.status(200).json({ message: 'Immagine profilo aggiornata con successo' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel modificare l\'immagine profilo' });
    }
});

/*
RICERCA UTENTI PER NOME
GET /api/profilo/cerca?query=xxx
Protezione: token JWT
Restituisce username, email, immagine profilo
*/
router.get('/cerca', authenticateToken, async (req, res) => {
    const query = req.query.query;
    const utente = req.user.username;

    if (!query) {
        return res.status(400).json({ message: 'Devi specificare un termine di ricerca' });
    }

    try {
        // Cerco gli utenti che contengono la query nel nome, escludendo sé stessi
        const result = await pool.query(
            `SELECT Username, Email, FotoProfilo
       FROM utente
       WHERE Username ILIKE $1 AND Username <> $2`, // ILIKE per ricerca case-insensitive
            [`%${query}%`, utente]
        );

        res.status(200).json({ risultati: result.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nella ricerca utenti' });
    }
});

module.exports = router;
