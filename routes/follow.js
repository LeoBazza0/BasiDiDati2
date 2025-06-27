const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * SEGUI UN UTENTE
 * POST /api/follow/:username
 * Richiede il token per autenticarsi
 * Parametro :username → l'utente da seguire
 */

//FOLLOW
router.post('/:username', authenticateToken, async (req, res) => {
    const utenteSeguito = req.params.username;
    const utenteSeguace = req.user.username;

    if (utenteSeguito === utenteSeguace) {
        return res.status(400).json({ message: 'Non puoi seguire te stesso' });
    }

    try {
        // Controllo se esiste l'utente da seguire
        const checkUser = await pool.query(
            'SELECT * FROM utente WHERE Username = $1',
            [utenteSeguito]
        );

        if (checkUser.rows.length === 0) {
            return res.status(404).json({ message: 'Utente da seguire non trovato' });
        }

        await pool.query(
            'INSERT INTO follow (Utente1, Utente2) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [utenteSeguace, utenteSeguito]
        );

        res.status(200).json({ message: `Ora segui ${utenteSeguito}` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel seguire l\'utente' });
    }
});

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * SMETTI DI SEGUIRE UN UTENTE
 * DELETE /api/follow/:username
 */

//STOP FOLLOW
router.delete('/:username', authenticateToken, async (req, res) => {
    const utenteSeguito = req.params.username;
    const utenteSeguace = req.user.username;

    try {
        // Elimino dalla tabella follow se esiste
        const result = await pool.query(
            'DELETE FROM follow WHERE Utente1 = $1 AND Utente2 = $2',
            [utenteSeguace, utenteSeguito]
        );

        // result.rowCount → quante righe eliminate - - - - - - - - - - - - - - - - perché fa cosi?
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Non seguivi questo utente' });
        }

        res.status(200).json({ message: `Hai smesso di seguire ${utenteSeguito}` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel togliere il follow' });
    }
});

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * VEDI CHI SEGUI
 * GET /api/follow/seguiti
 */

// VEDI FOLLOWINGS
router.get('/seguiti', authenticateToken, async (req, res) => {
    const utente = req.user.username;

    try {
        const result = await pool.query(
            'SELECT Utente2 AS seguito FROM follow WHERE Utente1 = $1',
            [utente]
        );

        res.status(200).json({ seguiti: result.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel recuperare gli utenti seguiti' });
    }
});

/**
 * VEDI CHI TI SEGUE
 * GET /api/follow/seguaci
 */

// VEDI FOLLOWERS
router.get('/seguaci', authenticateToken, async (req, res) => {
    const utente = req.user.username;

    try {
        const result = await pool.query(
            'SELECT Utente1 AS seguace FROM follow WHERE Utente2 = $1',
            [utente]
        );

        res.status(200).json({ seguaci: result.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel recuperare i follower' });
    }
});

// Esporto il router
module.exports = router;



// IN TUTTO QUESTO DA DOVE PRENDE I NOMI UTENTE1 E UTENTE2 ???