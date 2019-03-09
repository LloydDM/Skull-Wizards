const express = require('express');
const db = require('../db');

const router = express.Router();


// GET Room player view
router.get('/:roomCode/players', (req, res, next) => {
  res.render('players', {room: req.params.roomCode});
});

// GET Room player view
router.get('/:roomCode/player/:playerID', (req, res, next) => {
  res.render('character', {room: req.params.roomCode});
});

// GET Room skull lord view
router.get('/:roomCode/skull-lord', (req, res, next) => {
  res.render('skull-lord', {room: req.params.roomCode});
});

module.exports = router;
