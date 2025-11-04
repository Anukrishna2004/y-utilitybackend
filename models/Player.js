const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  },
  approved: {
    type: Boolean,
    default: false,
  },
  attendance: [
    {
      date: Date,
      present: Boolean,
      note: String,
    },
  ],
  homeVisits: [
    {
      date: Date,
      visitor: String,
      notes: String,
    },
  ],
  lsas: [
    {
      date: Date,
      score: Number,
      notes: String,
    },
  ],
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
