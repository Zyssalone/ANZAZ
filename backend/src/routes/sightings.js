const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const pool = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/sightings  — all sightings with coords (for map)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT si.id, si.latitude, si.longitude, si.location_name, si.created_at,
              sp.id AS species_id, sp.common_name, sp.scientific_name,
              sp.category, sp.conservation_status, sp.icon_color,
              u.name AS captured_by
       FROM sightings si
       JOIN species sp ON sp.id = si.species_id
       JOIN users u ON u.id = si.user_id
       WHERE si.latitude IS NOT NULL AND si.longitude IS NOT NULL
       ORDER BY si.created_at DESC
       LIMIT 200`,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/sightings/my  — current user's journal (protected)
router.get('/my', auth, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT si.id, si.latitude, si.longitude, si.location_name, si.notes, si.created_at,
              sp.id AS species_id, sp.common_name, sp.scientific_name,
              sp.category, sp.conservation_status, sp.icon_color, sp.facts
       FROM sightings si
       JOIN species sp ON sp.id = si.species_id
       WHERE si.user_id = $1
       ORDER BY si.created_at DESC`,
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/sightings  — create sighting (protected)
router.post(
  '/',
  auth,
  [
    body('species_id').isInt().withMessage('species_id must be an integer'),
    body('latitude').isFloat({ min: -90, max: 90 }),
    body('longitude').isFloat({ min: -180, max: 180 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { species_id, latitude, longitude, location_name, notes } = req.body;
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const sighting = await client.query(
        `INSERT INTO sightings (user_id, species_id, latitude, longitude, location_name, notes)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (user_id, species_id, latitude, longitude, location_name)
         DO UPDATE SET notes = COALESCE(EXCLUDED.notes, sightings.notes)
         RETURNING *, (xmax = 0) AS inserted`,
        [req.user.id, species_id, latitude, longitude, location_name || null, notes || null],
      );

      if (sighting.rows[0].inserted) {
        // Award 50 XP and 50 points for each new sighting
        await client.query(
          `UPDATE users SET xp = xp + 50, points = points + 50,
            level = GREATEST(level, FLOOR((xp + 50) / 500)::int + 1)
           WHERE id = $1`,
          [req.user.id],
        );

        // Update challenge progress for species captures
        await client.query(
          `INSERT INTO user_challenges (user_id, challenge_id, progress)
           SELECT $1, c.id, 1
           FROM challenges c
           WHERE c.active = true
             AND (c.category_filter IS NULL OR c.category_filter = (
               SELECT category FROM species WHERE id = $2
             ))
           ON CONFLICT (user_id, challenge_id)
           DO UPDATE SET
             progress = LEAST(user_challenges.progress + 1, challenges.target),
             completed = (user_challenges.progress + 1 >= challenges.target),
             completed_at = CASE
               WHEN user_challenges.progress + 1 >= challenges.target
                 AND NOT user_challenges.completed
               THEN NOW() ELSE user_challenges.completed_at END
           FROM challenges WHERE challenges.id = user_challenges.challenge_id`,
          [req.user.id, species_id],
        );
      }

      await client.query('COMMIT');
      res.status(201).json(sighting.rows[0]);
    } catch (err) {
      await client.query('ROLLBACK');
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } finally {
      client.release();
    }
  },
);

// DELETE /api/sightings/:id  (protected, own sighting only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM sightings WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id],
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Sighting not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
