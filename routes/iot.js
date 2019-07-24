'use strict';

let express = require('express');
let router = express.Router();

// ROUTES //

router.get('/airspeed', (req, res) => {
  res.json({
    value: random(0, 200)
  });
});

router.get('/flood', (req, res) => {
  res.json({
    value: random(0, 60)
  });
});

router.get('/water_quality', (req, res) => {
  res.json({
    value: random(0, 100)
  });
});

router.get('/solids', (req, res) => {
  res.json({
    value: random(0, 100)
  });
});

router.get('/conductivity', (req, res) => {
  res.json({
    value: random(0, 1000)
  });
});

router.get('/ph', (req, res) => {
  res.json({
    value: random(1, 14)
  });
});

router.get('/fecal_coliforms', (req, res) => {
  res.json({
    value: random(0, 20000)
  });
});

router.get('/glowth_level', (req, res) => {
  res.json({
    value: random(0, 6)
  });
});

module.exports = router;

function random(low, high) {
  return Math.random() * (high - low) + low;
}
