const express = require('express');
const router = express.Router();

router.get('/', (_, res) => { res.redirect('/register') })

router.get('/register', (req, res) => {
    res.render('register')
});

router.get('/dashboard', (req, res) => {
    res.send("dashboard")
})

router.get('/phone', (req, res) => {
    res.send("Please open this website on your phone's browser.");
})

module.exports = router