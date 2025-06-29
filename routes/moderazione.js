// file con sia i flag che la moderazione

const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router(); ù

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * FLAGGA UN POST
 * POST /api/moderazione/flag/:idPost
 * Protezione: token JWT
 */
router.post('/flag/:idPost', authenticateToken, async (req, res) => {
    const utente = req.user.username;
    const idPost = req.params.idPost;

    try {
        const postCheck = await pool.query('SELECT * FROM post WHERE IdPost = $1', [idPost]);
        if (postCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Post non trovato' });
        }

        // Inserisco flag solo se non già presente
        await pool.query(
            'INSERT INTO flaggare (Utente, Post) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [utente, idPost]
        );

        res.status(200).json({ message: 'Post flaggato con successo' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel flaggare il post' });
    }
});

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * TOGLI FLAG DA UN POST
 * DELETE /api/moderazione/flag/:idPost
 * Protezione: token JWT
 */
router.delete('/flag/:idPost', authenticateToken, async (req, res) => {
    const utente = req.user.username;
    const idPost = req.params.idPost;

    try {
        const result = await pool.query(
            'DELETE FROM flaggare WHERE Utente = $1 AND Post = $2',
            [utente, idPost]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Flag non trovato' });
        }

        res.status(200).json({ message: 'Flag rimosso' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel rimuovere il flag' });
    }
});

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * LISTA POST FLAGGATI (solo per moderatori)
 * GET /api/moderazione/flagged
 * Protezione: token JWT + verifica moderatore
 */
router.get('/flagged', authenticateToken, async (req, res) => {
    const utente = req.user.username;

    try {
        // Verifica se è moderatore
        const modCheck = await pool.query(
            'SELECT * FROM moderatore WHERE Username = $1',
            [utente]
        );

        if (modCheck.rows.length === 0) {
            return res.status(403).json({ message: 'Solo i moderatori possono vedere i post flaggati' });
        }

        // Recupero i post flaggati ordinati per numero di flag
        const result = await pool.query(
            `SELECT p.IdPost, p.Utente, COUNT(f.Utente) AS NumFlag
       FROM post p
       JOIN flaggare f ON p.IdPost = f.Post
       GROUP BY p.IdPost, p.Utente
       ORDER BY NumFlag DESC`
        );

        res.status(200).json({ post_flaggati: result.rows });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel recuperare i post flaggati' });
    }
});

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * MODERA UN POST (solo moderatori)
 * POST /api/moderazione/modera/:idPost
 * Protezione: token JWT + verifica moderatore
 */
router.post('/modera/:idPost', authenticateToken, async (req, res) => {
    const moderatore = req.user.username;
    const idPost = req.params.idPost;

    try {
        const modCheck = await pool.query(
            'SELECT * FROM moderatore WHERE Username = $1',
            [moderatore]
        );

        if (modCheck.rows.length === 0) {
            return res.status(403).json({ message: 'Solo i moderatori possono moderare i post' });
        }

        const postCheck = await pool.query('SELECT * FROM post WHERE IdPost = $1', [idPost]);
        if (postCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Post non trovato' });
        }

        // Modero post impostando Moderato = true
        await pool.query(
            'UPDATE post SET Moderato = true WHERE IdPost = $1',
            [idPost]
        );

        // Salvo moderatore che ha moderato quel post
        await pool.query(
            'INSERT INTO moderare (Utente, Post) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [moderatore, idPost]
        );

        res.status(200).json({ message: 'Post moderato con successo' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nella moderazione del post' });
    }
});

module.exports = router;
