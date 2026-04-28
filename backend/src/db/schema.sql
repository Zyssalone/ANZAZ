-- Run once: createdb anzaz
-- Then: psql -d anzaz -f src/db/schema.sql

-- ─── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  UNIQUE NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  level         INTEGER       NOT NULL DEFAULT 1,
  xp            INTEGER       NOT NULL DEFAULT 0,
  points        INTEGER       NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── Species ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS species (
  id                   SERIAL PRIMARY KEY,
  common_name          VARCHAR(150) NOT NULL,
  scientific_name      VARCHAR(200) NOT NULL,
  category             VARCHAR(50)  NOT NULL CHECK (category IN ('plant','animal','insect','bird','fungi')),
  conservation_status  VARCHAR(50)  NOT NULL CHECK (conservation_status IN ('endangered','vulnerable','near-threatened','least-concern')),
  description          TEXT,
  habitat              TEXT,
  facts                JSONB        NOT NULL DEFAULT '[]',
  icon_color           VARCHAR(20)  NOT NULL DEFAULT '#2d8a4e',
  created_at           TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (scientific_name)
);

-- ─── Sightings ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS sightings (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  species_id    INTEGER      NOT NULL REFERENCES species(id),
  latitude      DECIMAL(10,8),
  longitude     DECIMAL(11,8),
  location_name VARCHAR(200),
  notes         TEXT,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, species_id, latitude, longitude, location_name)
);

CREATE INDEX IF NOT EXISTS idx_sightings_user     ON sightings(user_id);
CREATE INDEX IF NOT EXISTS idx_sightings_species  ON sightings(species_id);
CREATE INDEX IF NOT EXISTS idx_sightings_location ON sightings(latitude, longitude);

-- ─── Challenges ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS challenges (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  target           INTEGER      NOT NULL,
  category_filter  VARCHAR(50),   -- NULL = any category
  points_reward    INTEGER      NOT NULL DEFAULT 100,
  active           BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (title)
);

CREATE TABLE IF NOT EXISTS user_challenges (
  id            SERIAL PRIMARY KEY,
  user_id       INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  challenge_id  INTEGER     NOT NULL REFERENCES challenges(id),
  progress      INTEGER     NOT NULL DEFAULT 0,
  completed     BOOLEAN     NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, challenge_id)
);

-- ─── Badges ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id                  SERIAL PRIMARY KEY,
  name                VARCHAR(100) NOT NULL,
  description         TEXT,
  icon_name           VARCHAR(50),
  requirement_type    VARCHAR(50),   -- e.g. 'sighting_count', 'species_count'
  requirement_value   INTEGER,
  created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS user_badges (
  id         SERIAL PRIMARY KEY,
  user_id    INTEGER     NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id   INTEGER     NOT NULL REFERENCES badges(id),
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
