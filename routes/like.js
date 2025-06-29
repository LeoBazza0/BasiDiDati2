const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * METTI UN LIKE A UN POST
 * POST /api/like/:idPost
 * Protezione: token JWT
 */
router.post('/:idPost', authenticateToken, async (req, res) => {
  const utente = req.user.username;
  const idPost = req.params.idPost;

  try {
    const postCheck = await pool.query(
      'SELECT * FROM post WHERE IdPost = $1',
      [idPost]
    );

    if (postCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Post non trovato' });
    }

    // Inserisco like solo se non esiste già
    await pool.query(
      'INSERT INTO "like" (Utente, Post) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [utente, idPost]
    );

    res.status(200).json({ message: 'Like aggiunto con successo' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel mettere like' });
  }
});

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * TOGLI UN LIKE DA UN POST
 * DELETE /api/like/:idPost
 * Protezione: token JWT
 */
router.delete('/:idPost', authenticateToken, async (req, res) => {
  const utente = req.user.username;
  const idPost = req.params.idPost;

  try {
    // Elimino like se esiste
    const result = await pool.query(
      'DELETE FROM "like" WHERE Utente = $1 AND Post = $2',
      [utente, idPost]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Like non trovato' });
    }

    res.status(200).json({ message: 'Like rimosso con successo' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Errore nel togliere like' });
  }
});

module.exports = router;
