const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// Get all players
router.get('/', async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single player
router.get('/:id', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team');
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new player
router.post('/', async (req, res) => {
  const player = new Player({
    name: req.body.name,
    email: req.body.email,
  });

  try {
    const newPlayer = await player.save();
    res.status(201).json(newPlayer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Approve a player (admin action)
router.put('/:id/approve', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    player.approved = true;
    await player.save();
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add attendance record
router.post('/:id/attendance', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    player.attendance.push({ date: req.body.date || new Date(), present: req.body.present, note: req.body.note });
    await player.save();
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add home visit record
router.post('/:id/homevisit', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    player.homeVisits.push({ date: req.body.date || new Date(), visitor: req.body.visitor, notes: req.body.notes });
    await player.save();
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add LSAS assessment
router.post('/:id/lsas', async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    player.lsas.push({ date: req.body.date || new Date(), score: req.body.score, notes: req.body.notes });
    await player.save();
    res.json(player);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
