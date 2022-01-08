const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const User = require('../models/User');

router.get('/', (req, res) => {
    res.send('hello world')
})

router.get('/crashes', (req, res) => {
    Report.find({}, (err, reports) => {
        if (err) {
            console.log(err)
        } else {
            res.json(reports)
        }
    })
})

router.get('/user', (req, res) => {
    User.findById(req.query.token).then(user => {
        res.json(user);
    })
})

router.get('/user/resonance', (req, res) => {
    try {
        User.findById(req.query.token).then(user => {
            user.resonance_id = req.query.resonance_id;
            user.save();
            res.json({ success: true })
        })
    } catch (err) {
        console.log(err)
    }
})

router.get('/user/socket', (req, res) => {
    try {
        User.findById(req.query.token).then(user => {
            user.socket_id = req.query.socket_id;
            user.save();
            res.json({ success: true })
        })
    } catch (err) {
        console.log(err);
    }

})

module.exports = router