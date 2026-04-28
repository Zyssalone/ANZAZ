require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',        require('./routes/auth'));
app.use('/api/species',     require('./routes/species'));
app.use('/api/sightings',   require('./routes/sightings'));
app.use('/api/challenges',  require('./routes/challenges'));
app.use('/api/badges',      require('./routes/badges'));
app.use('/api/leaderboard', require('./routes/leaderboard'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`ANZAZ API running on port ${PORT}`));
