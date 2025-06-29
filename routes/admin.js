const express = require('express');
const pool = require('../db');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

/** - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - vedo se togliere questa spiegazione o meno
 * PROMUOVI UN UTENTE A MODERATORE
 * POST /api/admin/promuovi/:username
 * Protezione: token JWT + verifica amministratore
 */
router.post('/promuovi/:username', authenticateToken, async (req, res) => {
    const admin = req.user.username;
    const userToPromote = req.params.username;

    try {
        const adminCheck = await pool.query(
            'SELECT * FROM amministratore WHERE Username = $1',
            [admin]
        );

        if (adminCheck.rows.length === 0) {
            return res.status(403).json({ message: 'Solo un amministratore può promuovere moderatori' });
        }

        const userCheck = await pool.query(
            'SELECT * FROM utente WHERE Username = $1',
            [userToPromote]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({ message: 'Utente da promuovere non trovato' });
        }

        // Verifica che non sia già moderatore
        const modCheck = await pool.query(
            'SELECT * FROM moderatore WHERE Username = $1',
            [userToPromote]
        );

        if (modCheck.rows.length > 0) {
            return res.status(400).json({ message: 'Questo utente è già moderatore' });
        }

        // Promuovi: inserisci nella tabella moderatore con data odierna
        await pool.query(
            'INSERT INTO moderatore (Username, DataNomina) VALUES ($1, CURRENT_DATE)',
            [userToPromote]
        );

        res.status(200).json({ message: `${userToPromote} è stato promosso a moderatore` });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Errore nel promuovere a moderatore' });
    }
});

module.exports = router;
