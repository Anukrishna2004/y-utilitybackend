const express = require('express');
const router = express.Router();
const Match = require('../models/Match');

// Get all matches
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().populate('teamA teamB tournament');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a match
router.post('/', async (req, res) => {
  const match = new Match({
    tournament: req.body.tournament,
    teamA: req.body.teamA,
    teamB: req.body.teamB,
    date: req.body.date,
    location: req.body.location,
  });

  try {
    const newMatch = await match.save();
    res.status(201).json(newMatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update scores / spirit / status
router.put('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (typeof req.body.scoreA !== 'undefined') match.scoreA = req.body.scoreA;
    if (typeof req.body.scoreB !== 'undefined') match.scoreB = req.body.scoreB;
    if (typeof req.body.spiritA !== 'undefined') match.spiritA = req.body.spiritA;
    if (typeof req.body.spiritB !== 'undefined') match.spiritB = req.body.spiritB;
    if (typeof req.body.status !== 'undefined') match.status = req.body.status;

    await match.save();
    res.json(match);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Leaderboard: simple aggregated spirit and wins
router.get('/leaderboard/:tournamentId', async (req, res) => {
  try {
    const tournamentId = req.params.tournamentId;
    const matches = await Match.find({ tournament: tournamentId, status: 'finished' }).populate('teamA teamB');

    const stats = {}; // teamId -> { wins, losses, pointsFor, pointsAgainst, spiritTotal }

    matches.forEach((m) => {
      const a = m.teamA._id.toString();
      const b = m.teamB._id.toString();

      if (!stats[a]) stats[a] = { team: m.teamA, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0, spiritTotal: 0 };
      if (!stats[b]) stats[b] = { team: m.teamB, wins: 0, losses: 0, pointsFor: 0, pointsAgainst: 0, spiritTotal: 0 };

      stats[a].pointsFor += m.scoreA;
      stats[a].pointsAgainst += m.scoreB;
      stats[a].spiritTotal += m.spiritA || 0;

      stats[b].pointsFor += m.scoreB;
      stats[b].pointsAgainst += m.scoreA;
      stats[b].spiritTotal += m.spiritB || 0;

      if (m.scoreA > m.scoreB) {
        stats[a].wins += 1;
        stats[b].losses += 1;
      } else if (m.scoreB > m.scoreA) {
        stats[b].wins += 1;
        stats[a].losses += 1;
      }
    });

    const leaderboard = Object.values(stats).map((s) => ({
      team: s.team,
      wins: s.wins,
      losses: s.losses,
      pointsFor: s.pointsFor,
      pointsAgainst: s.pointsAgainst,
      spiritTotal: s.spiritTotal,
    }));

    // Sort by wins desc, then spiritTotal desc
    leaderboard.sort((x, y) => {
      if (y.wins !== x.wins) return y.wins - x.wins;
      return y.spiritTotal - x.spiritTotal;
    });

    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
