const express = require('express');
const router = express.Router();



router.get('/sites/sites', (req, res) => {
    res.render('sites/sites');
});

module.exports = router;