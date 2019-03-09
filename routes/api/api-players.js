const express = require('express');
const db = require('../../db');

const router = express.Router();

// GET All players
router.get('/', (req, res, next) => {
  db.players.find({},
  (err, players) => {
    if (err) return next(err);
    res.send(players);
  });
});

// POST Create a player
router.post('/', (req, res, next) => {
  db.players.insert({
    mundane_name: req.body.mundane_name,
    hero_name: req.body.hero_name,
    level: 1,
    gold: 0,
    xp: 0,
    weapon: null,
    skill_1: {desc: null, mod: null, damaged: false},
    skill_2: {desc: null, mod: null, damaged: false},
    skill_3: {desc: null, mod: null, damaged: false},
    race: null,
    job: null,
    class: null,
    inventory: [],
    special_title: null
  },
  (err, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// DELETE All players
router.delete('/', (req, res, next) => {
  db.players.remove({},
  {
    multi: true
  },
  (err, numRemoved) => {
    if (err) return next(err);
    res.send('All players deleted');
  });
});

// GET One player
router.get('/:playerId', (req, res, next) => {
  db.players.findOne({
    _id: req.params.playerId
  },
  {},
  (err, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// // PUT Update one player
// router.put('/:playerId', (req, res, next) => {
//   console.log('req.body.playerData: ', req.body.playerData);
//   db.players.update({
//     _id: req.params.playerId
//   },
//   req.body.playerData,
//   (err, player) => {
//     if (err) return next(err);
//     res.send('Player ID ' + req.params.playerId + ' updated');
//   });
// });

// DELETE One Player
router.delete('/:playerId', (req, res, next) => {
  db.players.remove({
    _id: req.params.playerId
  },
  {
    multi: false
  },
  (err, numRemoved) => {
    if (err) return next(err);
    res.send('Player ID ' + req.params.playerId + ' deleted')
  });
});

// PUT Add one gold
router.put('/:playerId/add-gold', (req, res, next) => {
  db.players.update({
    _id: req.params.playerId
  },
  {
    $inc: {
      gold: 1
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player)
  });
});

// PUT Take one gold
router.put('/:playerId/take-gold', (req, res, next) => {
  db.players.update({
    _id: req.params.playerId
  },
  {
    $inc: {
      gold: -1
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player)
  });
});

// PUT Reset gold
router.put('/:playerId/reset-gold', (req, res, next) => {
  db.players.update({
    _id: req.params.playerId
  },
  {
    $set: {
      gold: 0
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player)
  });
});

// PUT Add one XP
router.put('/:playerId/add-xp', (req, res, next) => {
  db.players.update({
    _id: req.params.playerId
  },
  {
    $inc: {
      xp: 1
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player)
  });
});

// PUT Take one XP
router.put('/:playerId/take-xp', (req, res, next) => {
  db.players.update({
    _id: req.params.playerId
  },
  {
    $inc: {
      xp: -1
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player)
  });
});

// PUT Reset xp
router.put('/:playerId/reset-xp', (req, res, next) => {
  db.players.update({
    _id: req.params.playerId
  },
  {
    $set: {
      xp: 0
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player)
  });
});

// PUT Level up
router.put('/:playerId/level-up', (req, res, next) => {
  db.players.update({
    _id: req.params.playerId
  },
  {
    $inc: {
      level: 1,
      xp: -5
    }
  },
  {
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player)
  });
});

// PUT Update a player's skill 1
router.put('/:playerId/skill-1', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $set: {
      skill_1: {
        desc: req.body.skill_1.desc,
        mod: req.body.skill_1.mod,
        damaged: req.body.skill_1.damaged
      }
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// DELETE A player's skill_1
router.delete('/:playerId/skill-1', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $set: {
      skill_1: {
        desc: null,
        mod: null
      }
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// PUT Update a player's skill 2
router.put('/:playerId/skill-2', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $set: {
      skill_2: {
        desc: req.body.skill_2.desc,
        mod: req.body.skill_2.mod,
        damaged: req.body.skill_2.damaged
      }
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// DELETE A player's skill_2
router.delete('/:playerId/skill-2', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $set: {
      skill_2: {
        desc: null,
        mod: null
      }
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// PUT Update a player's skill 3
router.put('/:playerId/skill-3', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $set: {
      skill_3: {
        desc: req.body.skill_3.desc,
        mod: req.body.skill_3.mod,
        damaged: req.body.skill_3.damaged
      }
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// DELETE A player's skill_3
router.delete('/:playerId/skill-3', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $set: {
      skill_3: {
        desc: null,
        mod: null
      }
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// PUT Update a player's weapon
router.put('/:playerId/weapon', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $set: {
      weapon: req.body.weapon
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// DELETE A player's weapon
router.delete('/:playerId/weapon', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $set: {
      weapon: null
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// PUT Add to a player's inventory
router.put('/:playerId/inventory-add', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $push: {
      inventory: req.body.inventory_add
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

// PUT Remove from a player's inventory
router.put('/:playerId/inventory-take', (req, res, next) => {
  db.players.update({
    // Query
    _id: req.params.playerId
  },
  {
    // Update Data
    $pull: {
      inventory: req.body.inventory_take
    }
  },
  {
    // Options
    multi: false,
    upsert: false,
    returnUpdatedDocs: true
  },
  (err, numUpdated, player) => {
    if (err) return next(err);
    res.send(player);
  });
});

module.exports = router;
