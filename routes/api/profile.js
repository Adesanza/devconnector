const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('profile route'));



module.exports = router;