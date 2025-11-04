const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  tournament: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
  },
  teamA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  teamB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  date: Date,
  location: String,
  scoreA: {
    type: Number,
    default: 0,
  },
  scoreB: {
    type: Number,
    default: 0,
  },
  spiritA: {
    type: Number,
    default: 0,
  },
  spiritB: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'finished'],
    default: 'scheduled',
  },
});

const Match = mongoose.model('Match', matchSchema);
module.exports = Match;
