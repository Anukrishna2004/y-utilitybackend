require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/y-ultimate';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));
// API Routes
const playersRouter = require('./routes/players');
const teamsRouter = require('./routes/teams');
const tournamentsRouter = require('./routes/tournaments');
const matchesRouter = require('./routes/matches');

app.use('/api/players', playersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/tournaments', tournamentsRouter);
app.use('/api/matches', matchesRouter);
app.get('/', (req, res) => {
  res.send('Y-Ultimate API is running');
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
