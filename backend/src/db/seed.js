require('dotenv').config();
const pool = require('../config/db');

const SPECIES = [
  {
    common_name: 'Atlas Cedar', scientific_name: 'Cedrus atlantica',
    category: 'plant', conservation_status: 'endangered',
    description: 'The Atlas cedar is native to the Atlas Mountains of Morocco and Algeria. An evergreen conifer reaching 30–40 m, classified as endangered due to habitat loss and climate change.',
    habitat: 'Atlas Mountains, 1400–2200 m altitude',
    facts: [{ label: 'Kingdom', value: 'Plantae' }, { label: 'Family', value: 'Pinaceae' }, { label: 'Height', value: '30–40 m' }, { label: 'Lifespan', value: '800+ years' }],
    icon_color: '#2d8a4e',
  },
  {
    common_name: 'Barbary Macaque', scientific_name: 'Macaca sylvanus',
    category: 'animal', conservation_status: 'endangered',
    description: 'The only macaque outside Asia, endemic to Morocco and Algeria. Lives in cedar and oak forests in mixed-sex troops. Threatened by habitat loss and the illegal pet trade.',
    habitat: 'Cedar and oak forests, 1200–2000 m',
    facts: [{ label: 'Kingdom', value: 'Animalia' }, { label: 'Family', value: 'Cercopithecidae' }, { label: 'Weight', value: '10–15 kg' }, { label: 'Lifespan', value: '20–25 years' }],
    icon_color: '#a0522d',
  },
  {
    common_name: 'Wild Iris', scientific_name: 'Iris tingitana',
    category: 'plant', conservation_status: 'near-threatened',
    description: 'The Tangier iris is endemic to northwest Morocco. Its vivid violet-blue blooms appear in early spring. Populations are declining due to urbanisation and collection.',
    habitat: 'Coastal scrubland, rocky slopes below 500 m',
    facts: [{ label: 'Kingdom', value: 'Plantae' }, { label: 'Family', value: 'Iridaceae' }, { label: 'Height', value: '40–70 cm' }, { label: 'Bloom', value: 'Feb–Apr' }],
    icon_color: '#9b59b6',
  },
  {
    common_name: 'Striped Hawk-Moth', scientific_name: 'Hyles livornica',
    category: 'insect', conservation_status: 'least-concern',
    description: 'A powerful migratory hawk-moth across North Africa and southern Europe. Capable of hovering in front of flowers to feed on nectar.',
    habitat: 'Open scrubland, gardens, agricultural edges',
    facts: [{ label: 'Kingdom', value: 'Animalia' }, { label: 'Family', value: 'Sphingidae' }, { label: 'Wingspan', value: '60–80 mm' }, { label: 'Flight', value: 'Mar–Nov' }],
    icon_color: '#3498db',
  },
  {
    common_name: 'White Stork', scientific_name: 'Ciconia ciconia',
    category: 'bird', conservation_status: 'least-concern',
    description: 'Migrates through Morocco in enormous numbers. Pairs nest atop chimneys and monuments and are considered a symbol of good luck in Moroccan culture.',
    habitat: 'Wetlands, farmland, open plains',
    facts: [{ label: 'Kingdom', value: 'Animalia' }, { label: 'Family', value: 'Ciconiidae' }, { label: 'Wingspan', value: '155–215 cm' }, { label: 'Weight', value: '2.3–4.4 kg' }],
    icon_color: '#2c3e50',
  },
  {
    common_name: 'Argan Tree', scientific_name: 'Argania spinosa',
    category: 'plant', conservation_status: 'vulnerable',
    description: 'Iconic Moroccan endemic found in the Souss-Massa region. Forms a UNESCO-protected biosphere. Its fruit yields the prized argan oil.',
    habitat: 'Semi-arid plains and dry scrub, 0–1600 m',
    facts: [{ label: 'Kingdom', value: 'Plantae' }, { label: 'Family', value: 'Sapotaceae' }, { label: 'Height', value: '8–10 m' }, { label: 'Lifespan', value: '200+ years' }],
    icon_color: '#e67e22',
  },
  {
    common_name: 'Mouflon', scientific_name: 'Ovis musimon',
    category: 'animal', conservation_status: 'least-concern',
    description: 'Considered the ancestor of domestic sheep. Inhabits the rocky forested slopes of the Atlas and Rif mountains. Males carry distinctive curved horns.',
    habitat: 'Rocky mountain slopes, 800–2500 m',
    facts: [{ label: 'Kingdom', value: 'Animalia' }, { label: 'Family', value: 'Bovidae' }, { label: 'Weight', value: '25–55 kg' }, { label: 'Lifespan', value: '10–12 years' }],
    icon_color: '#795548',
  },
  {
    common_name: 'Swallowtail Butterfly', scientific_name: 'Papilio machaon',
    category: 'insect', conservation_status: 'least-concern',
    description: 'One of the most recognisable North African butterflies with vivid yellow wings marked with black, blue, and red. An important pollinator.',
    habitat: 'Meadows, hillsides, gardens, wasteland',
    facts: [{ label: 'Kingdom', value: 'Animalia' }, { label: 'Family', value: 'Papilionidae' }, { label: 'Wingspan', value: '65–86 mm' }, { label: 'Flight', value: 'Apr–Sep' }],
    icon_color: '#f39c12',
  },
  {
    common_name: 'Barbary Partridge', scientific_name: 'Alectoris barbara',
    category: 'bird', conservation_status: 'near-threatened',
    description: "North Africa's signature gamebird and the national bird of Gibraltar. Populations are declining due to hunting pressure and habitat degradation.",
    habitat: 'Rocky scrub, hillsides, agricultural edges',
    facts: [{ label: 'Kingdom', value: 'Animalia' }, { label: 'Family', value: 'Phasianidae' }, { label: 'Length', value: '32–35 cm' }, { label: 'Weight', value: '360–560 g' }],
    icon_color: '#8e44ad',
  },
  {
    common_name: 'Atlas Thyme', scientific_name: 'Thymus atlanticus',
    category: 'plant', conservation_status: 'least-concern',
    description: 'A compact aromatic shrub endemic to the Atlas Mountains. Its tiny pink flowers attract bees and butterflies. Widely used in traditional Moroccan medicine.',
    habitat: 'Limestone rocky outcrops, 1500–2800 m',
    facts: [{ label: 'Kingdom', value: 'Plantae' }, { label: 'Family', value: 'Lamiaceae' }, { label: 'Height', value: '10–30 cm' }, { label: 'Bloom', value: 'May–Jul' }],
    icon_color: '#27ae60',
  },
  {
    common_name: 'Common Kestrel', scientific_name: 'Falco tinnunculus',
    category: 'bird', conservation_status: 'least-concern',
    description: 'Famous for hovering motionless against the wind while scanning for prey. One of Morocco\'s most widespread raptors from sea level to high plateaus.',
    habitat: 'Open countryside, cliffs, urban areas',
    facts: [{ label: 'Kingdom', value: 'Animalia' }, { label: 'Family', value: 'Falconidae' }, { label: 'Wingspan', value: '65–82 cm' }, { label: 'Weight', value: '136–252 g' }],
    icon_color: '#16a085',
  },
  {
    common_name: 'Atlas Mushroom', scientific_name: 'Amanita caesarea',
    category: 'fungi', conservation_status: 'least-concern',
    description: "Known as the 'food of the gods' in antiquity. Grows in oak and cedar forests of northern Morocco. Its bright orange cap and yellow gills make it unmistakable.",
    habitat: 'Oak and cedar forest, 600–1800 m',
    facts: [{ label: 'Kingdom', value: 'Fungi' }, { label: 'Family', value: 'Amanitaceae' }, { label: 'Cap', value: '8–20 cm' }, { label: 'Season', value: 'Sep–Nov' }],
    icon_color: '#e74c3c',
  },
];

const CHALLENGES = [
  { title: 'Find 5 plant species this week', target: 5, category_filter: 'plant', points_reward: 200 },
  { title: 'Explore 3 new locations', target: 3, category_filter: null, points_reward: 150 },
  { title: 'Spot 2 endangered species', target: 2, category_filter: null, points_reward: 300 },
];

const BADGES = [
  { name: 'First Catch', description: 'Record your very first sighting', icon_name: 'Sprout', requirement_type: 'sighting_count', requirement_value: 1 },
  { name: 'Plant Pro', description: 'Record 10 plant sightings', icon_name: 'Leaf', requirement_type: 'plant_count', requirement_value: 10 },
  { name: 'Animal Spotter', description: 'Record 10 animal sightings', icon_name: 'PawPrint', requirement_type: 'animal_count', requirement_value: 10 },
  { name: 'Explorer', description: 'Visit 5 different locations', icon_name: 'Compass', requirement_type: 'location_count', requirement_value: 5 },
  { name: 'Scientist', description: 'Record 50 total sightings', icon_name: 'Microscope', requirement_type: 'sighting_count', requirement_value: 50 },
  { name: 'Legend', description: 'Reach 5000 points', icon_name: 'Crown', requirement_type: 'points', requirement_value: 5000 },
];

// Sample sightings near Ifrane for a demo user
const DEMO_SIGHTINGS = [
  { species_idx: 0, lat: 33.5228, lng: -5.1106, location: 'Ifrane National Park' },
  { species_idx: 1, lat: 33.5310, lng: -5.1020, location: 'Ifrane Forest' },
  { species_idx: 2, lat: 33.5180, lng: -5.1200, location: 'Ifrane Meadows' },
  { species_idx: 3, lat: 33.5400, lng: -5.0900, location: 'Cedar Forest Trail' },
  { species_idx: 4, lat: 33.5150, lng: -5.1300, location: 'Ifrane Lake' },
  { species_idx: 9, lat: 33.5260, lng: -5.1050, location: 'Atlas Highlands' },
  { species_idx: 10, lat: 33.5350, lng: -5.1180, location: 'Ifrane Cliffs' },
  { species_idx: 6, lat: 33.5290, lng: -5.0980, location: 'Mountain Pass' },
];

const DEMO_USERS = [
  { name: 'Sarah Kabbaj', email: 'sarah@anzaz.app', level: 9, xp: 1250, points: 2450 },
  { name: 'Omar Mansouri', email: 'omar@anzaz.app', level: 8, xp: 980, points: 1890 },
  { name: 'Aya Lahbabi', email: 'aya@anzaz.app', level: 8, xp: 910, points: 1670 },
  { name: 'Fatima Bennani', email: 'fatima@anzaz.app', level: 6, xp: 640, points: 1100 },
  { name: 'Youssef Rami', email: 'youssef@anzaz.app', level: 5, xp: 520, points: 980 },
];

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Species
    const speciesIds = [];
    for (const sp of SPECIES) {
      const r = await client.query(
        `INSERT INTO species (common_name, scientific_name, category, conservation_status, description, habitat, facts, icon_color)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (scientific_name) DO UPDATE SET
           common_name = EXCLUDED.common_name,
           category = EXCLUDED.category,
           conservation_status = EXCLUDED.conservation_status,
           description = EXCLUDED.description,
           habitat = EXCLUDED.habitat,
           facts = EXCLUDED.facts,
           icon_color = EXCLUDED.icon_color
         RETURNING id`,
        [sp.common_name, sp.scientific_name, sp.category, sp.conservation_status, sp.description, sp.habitat, JSON.stringify(sp.facts), sp.icon_color],
      );
      speciesIds.push(r.rows[0].id);
    }

    // Challenges
    for (const ch of CHALLENGES) {
      await client.query(
        `INSERT INTO challenges (title, target, category_filter, points_reward)
         VALUES ($1,$2,$3,$4)
         ON CONFLICT (title) DO UPDATE SET
           target = EXCLUDED.target,
           category_filter = EXCLUDED.category_filter,
           points_reward = EXCLUDED.points_reward,
           active = true`,
        [ch.title, ch.target, ch.category_filter, ch.points_reward],
      );
    }

    // Badges
    for (const b of BADGES) {
      await client.query(
        `INSERT INTO badges (name, description, icon_name, requirement_type, requirement_value)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (name) DO UPDATE SET
           description = EXCLUDED.description,
           icon_name = EXCLUDED.icon_name,
           requirement_type = EXCLUDED.requirement_type,
           requirement_value = EXCLUDED.requirement_value`,
        [b.name, b.description, b.icon_name, b.requirement_type, b.requirement_value],
      );
    }

    // Demo user
    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash('demo1234', 12);
    const userRes = await client.query(
      `INSERT INTO users (name, email, password_hash, level, xp, points)
       VALUES ('Zyad Serghini', 'zyad@anzaz.app', $1, 7, 750, 1250)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [hash],
    );
    const userId = userRes.rows[0].id;

    for (const user of DEMO_USERS) {
      const demoHash = await bcrypt.hash('demo1234', 12);
      await client.query(
        `INSERT INTO users (name, email, password_hash, level, xp, points)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO UPDATE SET
           name = EXCLUDED.name,
           level = EXCLUDED.level,
           xp = EXCLUDED.xp,
           points = EXCLUDED.points`,
        [user.name, user.email, demoHash, user.level, user.xp, user.points],
      );
    }

    // Demo sightings
    for (const s of DEMO_SIGHTINGS) {
      const sid = speciesIds[s.species_idx];
      if (!sid) continue;
      await client.query(
        `INSERT INTO sightings (user_id, species_id, latitude, longitude, location_name)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (user_id, species_id, latitude, longitude, location_name) DO NOTHING`,
        [userId, sid, s.lat, s.lng, s.location],
      );
    }

    await client.query(
      `INSERT INTO user_challenges (user_id, challenge_id, progress, completed, completed_at)
       SELECT $1,
              c.id,
              LEAST(COUNT(si.id)::int, c.target),
              COUNT(si.id)::int >= c.target,
              CASE WHEN COUNT(si.id)::int >= c.target THEN NOW() ELSE NULL END
       FROM challenges c
       LEFT JOIN sightings si ON si.user_id = $1
       LEFT JOIN species sp ON sp.id = si.species_id
       WHERE c.active = true
         AND (c.category_filter IS NULL OR c.category_filter = sp.category)
       GROUP BY c.id
       ON CONFLICT (user_id, challenge_id)
       DO UPDATE SET
         progress = EXCLUDED.progress,
         completed = EXCLUDED.completed,
         completed_at = EXCLUDED.completed_at`,
      [userId],
    );

    await client.query(
      `INSERT INTO user_badges (user_id, badge_id)
       SELECT $1, id
       FROM badges
       WHERE name IN ('First Catch', 'Plant Pro', 'Animal Spotter', 'Explorer')
       ON CONFLICT (user_id, badge_id) DO NOTHING`,
      [userId],
    );

    await client.query('COMMIT');
    console.log('Seed complete.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
