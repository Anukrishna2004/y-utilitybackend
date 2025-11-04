require('dotenv').config();
const mongoose = require('mongoose');
const Player = require('./models/Player');
const Team = require('./models/Team');
const Tournament = require('./models/Tournament');
const Match = require('./models/Match');

const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/y-ultimate';

async function seed() {
  await mongoose.connect(mongoURI);
  console.log('Connected to', mongoURI);

  // clear
  await Promise.all([Player.deleteMany(), Team.deleteMany(), Tournament.deleteMany(), Match.deleteMany()]);

  // create players
  const players = await Player.insertMany([
    { name: 'Aisha', email: 'aisha@example.com', gender: 'female', approved: true },
    { name: 'Ravi', email: 'ravi@example.com', gender: 'male', approved: true },
    { name: 'Maya', email: 'maya@example.com', gender: 'female', approved: true },
    { name: 'Sam', email: 'sam@example.com', gender: 'male', approved: true },
  ]);

  // create teams
  const team1 = new Team({ name: 'Y-Ultimate Stars', players: [players[0]._id, players[1]._id] });
  const team2 = new Team({ name: 'Frisbee Flyers', players: [players[2]._id, players[3]._id] });
  await team1.save();
  await team2.save();

  // assign teams to players
  await Player.updateOne({ _id: players[0]._id }, { team: team1._id });
  await Player.updateOne({ _id: players[1]._id }, { team: team1._id });
  await Player.updateOne({ _id: players[2]._id }, { team: team2._id });
  await Player.updateOne({ _id: players[3]._id }, { team: team2._id });

  // tournament
  const tournament = new Tournament({ name: 'City Cup', teams: [team1._id, team2._id], startDate: new Date(), endDate: new Date(Date.now() + 1000 * 60 * 60 * 24) });
  await tournament.save();

  // matches
  const match = new Match({ tournament: tournament._id, teamA: team1._id, teamB: team2._id, date: new Date(), location: 'Main Field', scoreA: 7, scoreB: 9, spiritA: 8, spiritB: 9, status: 'finished' });
  await match.save();

  console.log('Seeding complete');
  mongoose.disconnect();
}

seed().catch((e) => { console.error(e); process.exit(1); });
