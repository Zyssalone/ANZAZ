const router = require('express').Router();
const pool = require('../config/db');

// GET /api/leaderboard  — top 20 users by points
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.points, u.level,
              COUNT(DISTINCT s.species_id) AS species_count,
              RANK() OVER (ORDER BY u.points DESC) AS rank
       FROM users u
       LEFT JOIN sightings s ON s.user_id = u.id
       GROUP BY u.id
       ORDER BY u.points DESC
       LIMIT 20`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
