const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem.js');

router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find();
    res.json({ success: true, data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
