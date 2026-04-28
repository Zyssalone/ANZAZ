const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/challenges  — active challenges with user's progress (protected)
router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.title, c.description, c.target, c.category_filter,
              c.points_reward,
              COALESCE(uc.progress, 0) AS progress,
              COALESCE(uc.completed, false) AS completed,
              uc.completed_at
       FROM challenges c
       LEFT JOIN user_challenges uc
         ON uc.challenge_id = c.id AND uc.user_id = $1
       WHERE c.active = true
       ORDER BY c.id`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
