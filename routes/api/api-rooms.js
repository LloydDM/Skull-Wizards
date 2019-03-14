const express = require('express');
const db = require('../../db');

const router = express.Router();


// GET All rooms
router.get('/', (req, res, next) => {
  db.rooms.find({}, (err, rooms) => {
    if (err) return next(err);
    res.send(rooms);
  });
});

router.get('/welcomeList', (req, res, next) => {
  let allRooms = [];
  db.rooms.find({}, (err, rooms) => {
    if (err) return next(err);
    allRooms = rooms;
    let promises = rooms.map(room => {
      return new Promise((resolve, reject) => {
        db.players.find({
          // Query
          _id: {$in: room.players}
        },
        {
          // Projections
          mundane_name: 1,
          hero_name: 1
        },
        (err, response) => {
          if (err) reject(err);
          resolve(response);
        });
      })
    });

    Promise.all(promises)
    .then(response => {
      allRooms.forEach((allRoom, idx) => {
        allRoom.nice_players = response[idx];
      });
      res.send(allRooms)
    })
    .catch(err => next(err))
  });
});

// POST New room
router.post('/', (req, res, next) => {
  function findOrCreateRoom() {
    let roomCode = ''
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    while (roomCode.length < 3) {
      roomCode += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    db.rooms.find({
      _id: roomCode
    }, (err, rooms) => {
      if (err) return next(err);
      if (rooms.length > 0) {
        findOrCreateRoom();
      } else {
        db.rooms.insert({
          _id: roomCode,
          created: new Date(),
          last_played: new Date(),
          mad_libs: [],
          players: [],
          main_monsters: [],
          supplemental_nouns: [],
          supplemental_adjs: [],
          supplemental_ings: [],
          supplemental_advs: [],
          PIN: req.body.pin
        }, (err, newRoom) => {
          if (err) return next(err);
          res.send(newRoom);
        });
      }
    });
  }
  
  findOrCreateRoom();
});

// DELETE all rooms
router.delete('/', (req, res, next) => {
  db.rooms.remove({}, {multi: true}, (err, numDeleted) => {
    if (err) return next(err);
    res.send(numDeleted + ' rooms deleted');
  });
});

// GET Room details
router.get('/:roomCode', (req, res, next) => {
  db.rooms.findOne({
    _id: req.params.roomCode
  }, (err, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Update room
router.put('/:roomCode', (req, res, next) => {
  // use req.params.roomCode and req.body

  res.send(200);
});

// DELETE room
router.delete('/:roomCode', (req, res, next) => {
  db.rooms.remove({
    _id: req.params.roomCode
  }, (err, numDeleted) => {
    if (err) return next(error);
    res.send("Room '" + req.params.roomCode + "' deleted");
  });
});

// PUT Check Skull PIN
router.get('/:roomCode/checkPIN', (req, res, next) => {
  db.rooms.findOne({
    // Query
    _id: req.params.roomCode
  },
  {
    // Projections
    _id: 0,
    PIN: 1
  },
  (err, response) => {
    if (err) return next(err);
    if (req.query.pin === response.PIN) {
      res.send({pin_match: true});
    } else {
      res.send({pin_match: false});
    }
  });
});

// GET All room mad-libs
router.get('/:roomCode/mad-libs', (req, res, next) => {
  db.rooms.findOne({
    _id: req.params.roomCode
  },
  {
    mad_libs: 1,
    _id: 0
  },
  (err, madlibs) => {
    if (err) return next(err);
    res.send(madlibs);
  });
});

// POST Add mad lib to room
router.post('/:roomCode/mad-libs', (req, res, next) => {
  db.rooms.update({
    _id: req.params.roomCode
  },
  {
    $push: {
      mad_libs: {
        created_by: req.body.created_by,
        class_noun: req.body.class_noun,
        class_roll: req.body.class_roll,
        race: req.body.race,
        weapon: req.body.weapon,
        weapon_mod: req.body.weapon_mod,
        background_trait: req.body.background_trait,
        background_job: req.body.background_job,
        skill_1: req.body.skill_1,
        skill_2: req.body.skill_2,
        skill_3: req.body.skill_3
      },
      main_monsters: req.body.main_monster,
      supplemental_nouns: {
        $each: req.body.supplemental_nouns
      },
      supplemental_adjs: {
        $each: req.body.supplemental_adjs
      },
      supplemental_ings: {
        $each:req.body.supplemental_ings
      },
      supplemental_advs: {
        $each: req.body.supplemental_advs
      }
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numMadlibs, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// DELETE All mad libs in a room
router.delete('/:roomCode/mad-libs', (req, res, next) => {
  db.rooms.update({
    _id: req.params.roomCode
  },
  {
    $set: {
      mad_libs: []
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Assign mad-libs to players
router.put('/:roomCode/mad-libs/assign', (req, res, next) => {
  db.rooms.findOne({
    _id: req.params.roomCode
  },
  {
    mad_libs: 1,
    players: 1,
    _id: 0
  },
  (err, room) => {
    if (err) return next(err);
    if (room.players.length !== room.mad_libs.length) {
      res.send({
        status: 'error',
        message: 'Mismatch between number of players and number of mad-libs.'
      });
    } else {
      let promises = [];
      room.players.forEach((player, index) => {
        promises.push(
          db.players.update({
            // Query
            _id: player
          },
          {
            // Update Data
            $set: {
              race: room.mad_libs[index].race,
              weapon: room.mad_libs[index].weapon,
              weapon_mod: room.mad_libs[index].weapon_mod
            }
          })
        );
      });

      Promise.all(promises).then(response => res.sendStatus(200)).catch(err => next(err));
      // switch (req.body.shift) {
      //   case 'self':
      //     break;
      //   case 'left':
      //     break;
      //   case 'right':
      //     break;
      //   case 'random':
      //     break;
      //   default:
      //     break;
      // }
      // res.send(room);
    }
  });
});

// PUT Add a noun
router.put('/:roomCode/add-noun', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $push: {
      supplemental_nouns: req.body.noun
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Remove a noun
router.put('/:roomCode/take-noun', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $pull: {
      supplemental_nouns: req.body.noun
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Clear nouns
router.put('/:roomCode/reset-nouns', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $set: {
      supplemental_nouns: []
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, response) => {
    if (err) return next(err);
    res.send(response);
  });
});

// PUT Add an adj
router.put('/:roomCode/add-adj', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $push: {
      supplemental_adjs: req.body.adj
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Remove an adj
router.put('/:roomCode/take-adj', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $pull: {
      supplemental_adjs: req.body.adj
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Clear adjs
router.put('/:roomCode/reset-adjs', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $set: {
      supplemental_adjs: []
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, response) => {
    if (err) return next(err);
    res.send(response);
  });
});

// PUT Add an ing
router.put('/:roomCode/add-ing', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $push: {
      supplemental_ings: req.body.ing
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Remove an ing
router.put('/:roomCode/take-ing', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $pull: {
      supplemental_ings: req.body.ing
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Clear ings
router.put('/:roomCode/reset-ings', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $set: {
      supplemental_ings: []
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, response) => {
    if (err) return next(err);
    res.send(response);
  });
});

// PUT Add an adv
router.put('/:roomCode/add-adv', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $push: {
      supplemental_advs: req.body.adv
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Remove an adv
router.put('/:roomCode/take-adv', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $pull: {
      supplemental_advs: req.body.adv
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// PUT Clear advs
router.put('/:roomCode/reset-advs', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $set: {
      supplemental_advs: []
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, response) => {
    if (err) return next(err);
    res.send(response);
  });
});

// POST Generate a monster
router.post('/:roomCode/gen-monster', (req, res, next) => {
  db.rooms.findOne({
    // Query
    _id: req.params.roomCode
  },
  {
    //Projections
    _id: 0,
    supplemental_nouns: 1,
    supplemental_adjs: 1,
    supplemental_ings: 1
  },
  (err, supplementals) => {
    if (err) return next(err);
    if (
      supplementals.supplemental_nouns.length === 0 ||
      supplementals.supplemental_ings.length === 0 ||
      supplementals.supplemental_adjs.length === 0
    ) {
      res.send("Not enough words!")
    } else {
      const newMonsterAdj = supplementals.supplemental_adjs.splice(Math.floor(Math.random() * supplementals.supplemental_adjs.length), 1)[0];
      const newMonsterNoun = supplementals.supplemental_nouns.splice(Math.floor(Math.random() * supplementals.supplemental_nouns.length), 1)[0];
      const newMonsterIng = supplementals.supplemental_ings.splice(Math.floor(Math.random() * supplementals.supplemental_ings.length), 1)[0];

      db.rooms.update({
        // Query
        _id: req.params.roomCode
      },
      {
        // Update Data
        $push: {
          monsters: `${newMonsterAdj} ${newMonsterNoun} with the power of ${newMonsterIng}`
        },
        $set: {
          supplemental_nouns: supplementals.supplemental_nouns,
          supplemental_ings: supplementals.supplemental_ings,
          supplemental_adjs: supplementals.supplemental_adjs
        }
      },
      {
        // Options
        multi: false,
        upsert: false,
        returnUpdatedDocs: true
      },
      (err, numUpdated, room) => {
        if (err) return next(err);
        res.send(room);
      });
    }
  });
});

// PUT Delete a monster
router.put('/:roomCode/take-monster', (req, res, next) => {
  db.rooms.update({
    // Query
    _id: req.params.roomCode
  },
  {
    // Update Data
    $pull: {
      monsters: req.body.monster
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// GET All room players
router.get('/:roomCode/players', (req, res, next) => {
  db.rooms.findOne({
    _id: req.params.roomCode
  },
  {
    _id: 0,
    players: 1
  },
  (err, players) => {
    if (err) return next(err);
    res.send(players);
  });
});

// POST Add player to room
router.post('/:roomCode/players', (req, res, next) => {
  db.rooms.update({
    _id: req.params.roomCode
  },
  {
    $push: {
      players: req.body.playerId
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  });
});

// DELETE All players in a room
router.delete('/:roomCode/players', (req, res, next) => {
  db.rooms.update({
    _id: req.params.roomCode
  },
  {
    $set: {
      players: []
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numDeleted, room) => {
    if (err) return next(err);
    res.send(room)
  });
});

// DELETE A player from a room
router.delete('/:roomCode/players/:playerId', (req, res, next) => {
  db.rooms.update({
    _id: req.params.roomCode
  },
  {
    $pull: {
      players: req.params.playerId
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, room) => {
    if (err) return next(err);
    res.send(room);
  })
});

module.exports = router;
