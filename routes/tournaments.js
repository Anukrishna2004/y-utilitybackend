const express = require('express');
const router = express.Router();
const Tournament = require('../models/Tournament');
const Team = require('../models/Team');

// Get all tournaments
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new tournament
router.post('/', async (req, res) => {
  const tournament = new Tournament({
    name: req.body.name,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  });

  try {
    const newTournament = await tournament.save();
    res.status(201).json(newTournament);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add a team to a tournament
router.post('/:id/add-team', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
    const team = await Team.findById(req.body.teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });

    if (!tournament.teams.map(String).includes(team._id.toString())) {
      tournament.teams.push(team._id);
      await tournament.save();
    }

    res.json(tournament);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
