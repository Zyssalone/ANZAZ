const router = require('express').Router();
const pool = require('../config/db');

// GET /api/species  — optional ?category=plant&status=endangered
router.get('/', async (req, res) => {
  const { category, status } = req.query;
  try {
    const conditions = [];
    const values = [];
    if (category) { conditions.push(`category = $${values.length + 1}`); values.push(category); }
    if (status)   { conditions.push(`conservation_status = $${values.length + 1}`); values.push(status); }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query(
      `SELECT id, common_name, scientific_name, category, conservation_status,
              description, habitat, facts, icon_color,
              (SELECT COUNT(*) FROM sightings WHERE species_id = species.id) AS sightings
       FROM species ${where}
       ORDER BY common_name`,
      values,
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/species/:id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT s.*,
              (SELECT COUNT(*) FROM sightings WHERE species_id = s.id) AS sightings
       FROM species s WHERE s.id = $1`,
      [req.params.id],
    );
    if (!result.rows.length) return res.status(404).json({ message: 'Species not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
