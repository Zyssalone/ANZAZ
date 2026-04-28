const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.id, b.name, b.description, b.icon_name,
              b.requirement_type, b.requirement_value,
              (ub.id IS NOT NULL) AS earned,
              ub.earned_at
       FROM badges b
       LEFT JOIN user_badges ub
         ON ub.badge_id = b.id AND ub.user_id = $1
       ORDER BY b.id`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
