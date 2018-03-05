var express = require('express');
var repo = require('../models/links');
var moment = require('moment');
var router = express.Router();


/* Einloggen: POST /login */
router.post('/', function(req, res, next) {
    var user = req.body.user;
    console.log(user);
    if (user !== "") {
        req.session.user = user;
    }
    res.send({ message: "Login successful" });
});

/* Ausloggen: DELETE /login */
router.delete('/', function(req, res, next) {
    delete req.session['user'];
    res.send({ message: "Logout successful" });
});

/* eingeloggter User zurückgeben: GET /login */
router.get('/', function(req, res, next) {
    if (req.session.user) {
        res.send({ user: req.session.user });
    } else {
        res.send({ user: null });
    }
});

module.exports = router;
