const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const Player = require('../models/Player');

// Get all teams
router.get('/', async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new team
router.post('/', async (req, res) => {
  const team = new Team({
    name: req.body.name,
  });

  try {
    const newTeam = await team.save();
    res.status(201).json(newTeam);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Add player to team roster
router.post('/:id/add-player', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    const player = await Player.findById(req.body.playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    // add to team.players if not present
    if (!team.players.map(String).includes(player._id.toString())) {
      team.players.push(player._id);
      await team.save();
    }

    // set player's team
    player.team = team._id;
    await player.save();

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Remove player from team
router.post('/:id/remove-player', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    const player = await Player.findById(req.body.playerId);
    if (!player) return res.status(404).json({ message: 'Player not found' });

    team.players = team.players.filter((p) => p.toString() !== player._id.toString());
    await team.save();

    if (player.team && player.team.toString() === team._id.toString()) {
      player.team = null;
      await player.save();
    }

    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add attendance record for a team session (records on team level)
router.post('/:id/attendance', async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('players');
    if (!team) return res.status(404).json({ message: 'Team not found' });

    const { date = new Date(), attendance = [] } = req.body; // attendance: [{playerId, present, note}]

    // apply attendance entries to players
    for (const a of attendance) {
      const player = await Player.findById(a.playerId);
      if (!player) continue;
      player.attendance.push({ date, present: !!a.present, note: a.note || '' });
      await player.save();
    }

    res.json({ message: 'Attendance recorded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

