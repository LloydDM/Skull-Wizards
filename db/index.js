const Datastore = require('nedb');
const path = require('path')

var db = {};

db.players = new Datastore({
  filename: path.join(__dirname, "/players.db"),
  autoload: true
});

db.rooms = new Datastore({
  filename: path.join(__dirname, "/rooms.db"),
  autoload: true
});

module.exports = db;