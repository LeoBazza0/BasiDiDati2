const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * Endpoint per pubblicare un post
 * POST /api/post
 * Dati richiesti:
 *  - testo: opzionale (se c'è è un post testuale)
 *  - immagine: opzionale (se c'è è un post immagine in base64)
 * Non possono esserci entrambi vuoti!
 */


router.post('/', authenticateToken, async (req, res) => {
    const { testo, immagine } = req.body;
    const utente = req.user.username;

    if (!testo && !immagine) {
        return res.status(400).json({ message: 'Devi fornire un testo o un\'immagine' });
    }

    try {
        // Genero un id univoco per il post (stringa P+timestamp)
        const idPost = 'P' + Date.now();

        await pool.query(
            'INSERT INTO post (IdPost, Utente, DataPubblicazione, Moderato) VALUES ($1, $2, CURRENT_DATE, $3)',
            [idPost, utente, false]
        );

        if (immagine) {
            // Controllo dimensione: il base64 dev’essere max 100kb (137KB in base64, perché è più pesante)
            const imageSize = Buffer.byteLength(immagine, 'base64');
            if (imageSize > 137000) {
                return res.status(400).json({ message: 'Immagine troppo grande (max 100kb)' });
            }

            await pool.query(
                'INSERT INTO immagine (IdPost, Pic) VALUES ($1, $2)',
                [idPost, Buffer.from(immagine, 'base64')]
            );
        }

        if (testo) {
            if (testo.length > 280) {
                return res.status(400).json({ message: 'Testo troppo lungo (max 280 caratteri)' });
            }

            await pool.query(
                'INSERT INTO testo (IdPost, Txt) VALUES ($1, $2)',
                [idPost, testo]
            );
        }

        res.status(201).json({ message: 'Post pubblicato con successo', idPost });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore del server durante la pubblicazione del post' });
    }
});

/**
 * BACHECA DELL'UTENTE
 * GET /api/post/bacheca
 * Mostra i post:
 * - creati dall'utente autenticato
 * - creati dagli utenti che segue
 * Ordinati per data di pubblicazione (dal più recente)
 * Necessita token JWT
 */
router.get('/bacheca', authenticateToken, async (req, res) => {
    const utente = req.user.username;

    try {
        // 1. Recupero i post propri e dei seguiti
        const result = await pool.query(
            `SELECT p.IdPost, p.Utente, p.DataPubblicazione, p.Moderato,
              i.Pic, t.Txt,
              (SELECT COUNT(*) FROM "like" WHERE Post = p.IdPost) AS NumLike
       FROM post p
       LEFT JOIN immagine i ON p.IdPost = i.IdPost
       LEFT JOIN testo t ON p.IdPost = t.IdPost
       WHERE p.Utente = $1
          OR p.Utente IN (
               SELECT Utente2 FROM follow WHERE Utente1 = $1
             )
       ORDER BY p.DataPubblicazione DESC`,
            [utente]
        );

        // 2. Invio i dati al client
        res.status(200).json({ bacheca: result.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel recuperare la bacheca' });
    }
});

// Esporto il router - - - - - - - - - - - - - - - - - - perché? a cosa mia serve questo?
module.exports = router;
