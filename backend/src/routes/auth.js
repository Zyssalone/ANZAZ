const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
}

function validationMessage(errors) {
  return errors.array().map((error) => error.msg).join(', ');
}

// POST /api/auth/register
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: validationMessage(errors),
        errors: errors.array(),
      });
    }

    const { name, email, password } = req.body;
    try {
      const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
      if (exists.rows.length) return res.status(409).json({ message: 'Email already registered' });

      const passwordHash = await bcrypt.hash(password, 12);
      const result = await pool.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, level, xp, points`,
        [name, email, passwordHash],
      );

      const user = result.rows[0];
      res.status(201).json({ token: signToken(user.id), user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: validationMessage(errors),
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      const result = await pool.query(
        'SELECT id, name, email, password_hash, level, xp, points FROM users WHERE email = $1',
        [email],
      );
      const user = result.rows[0];
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) return res.status(401).json({ message: 'Invalid credentials' });

      delete user.password_hash;
      res.json({ token: signToken(user.id), user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

// GET /api/auth/me
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM (
         SELECT u.id, u.name, u.email, u.level, u.xp, u.points,
                COUNT(DISTINCT s.species_id) AS species_count,
                RANK() OVER (ORDER BY u.points DESC) AS rank
         FROM users u
         LEFT JOIN sightings s ON s.user_id = u.id
         GROUP BY u.id
       ) ranked_users
       WHERE id = $1`,
      [req.user.id],
    );
    if (!result.rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
