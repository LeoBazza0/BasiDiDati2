const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

/*
POST /api/post
Dati richiesti:
 - testo: opzionale (se c'è è un post testuale)
 - immagine: opzionale (se c'è è un post immagine in base64)
Non possono esserci entrambi vuoti!
*/


router.post('/', authenticateToken, async (req, res) => {
    const { testo, immagine } = req.body;
    const utente = req.user.username;

    // Controllo numero di post moderati negli ultimi 30 giorni
    const moderatiCheck = await pool.query(
        `SELECT COUNT(*) FROM post 
   WHERE Utente = $1 AND Moderato = true 
     AND DataPubblicazione >= CURRENT_DATE - INTERVAL '30 days'`,
        [utente]
    );

    const numModerati = parseInt(moderatiCheck.rows[0].count);

    if (numModerati >= 3) {
        return res.status(403).json({
            message: 'Hai 3 o più post moderati negli ultimi 30 giorni. Non puoi pubblicare nuovi post.'
        });
    }


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

/*
BACHECA CON PAGINAZIONE
GET /api/post/bacheca?page=1&limit=10
Protezione: token JWT
Mostra post propri + seguiti ordinati per data
*/
router.get('/bacheca', authenticateToken, async (req, res) => {
    const utente = req.user.username;

    // Prendo page e limit dai parametri della query, con valori di default se non specificati
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        // Recupero i post propri e dei seguiti
        // tengo LIMIT e OFFSET per la paginazione (e l'ordinamento)
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
       ORDER BY p.DataPubblicazione DESC
       LIMIT $2 OFFSET $3`,
            [utente, limit, offset]
        );

        // risposta
        res.status(200).json({
            pagina: page,
            post_per_pagina: limit,
            post: result.rows
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel recuperare la bacheca' });
    }
});

module.exports = router;
