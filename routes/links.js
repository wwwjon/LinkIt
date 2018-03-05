var express = require('express');
var repo = require('../models/links');
var moment = require('moment');
var router = express.Router();

function requireLogin(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.send({ message: 'not authorized' });
    }
}

function isMyLink(req, res, next) {
    var link = repo.getLink(Number(req.params.id));
    if (req.session.user === link.sender) {
        next();
    } else {
        res.send({ message: 'not authorized (not your link)' });
    }
}


function createLink(req, res, next) {
    var url = req.body.url;
    var rx = /^(?:f|ht)tps?\:\/\//;
    if (rx.test(encodeURI(url))) {
        repo.createNewLink(req.body.title, url, req.session.user, moment().toDate());
        res.send({message: 'Link added'});
    } else {
        res.send({message: 'no valid link'});
    }
}

function deleteLink(req, res, next) {
    repo.deleteLink(Number(req.params.id));
    res.send({ message: 'Link deleted' });
}

function rankingUp(req, res, next) {
    var link = repo.getLink(Number(req.params.id));
    if (link === null) {
        res.send({ message: 'Link ID not found' });
    } else {
        link.ranking = Number(link.ranking) + 1;
        res.send({ message: 'Link rating increased' });
    }
}
function rankingDown(req, res, next) {
    var link = repo.getLink(Number(req.params.id));
    if (link === null) {
        res.send({ message: 'Link ID not found' });
    } else {
        link.ranking = Number(link.ranking) - 1;
        res.send({message: 'Link rating decreased'});
    }
}

/* Erstellen eines Links: POST /links */
router.post('/', requireLogin, createLink);
/* Löschen eines Links: DELETE /links/:id */
router.delete('/:id', requireLogin, isMyLink, deleteLink);
/* Up/Down Voting */
router.put('/:id/up',requireLogin, rankingUp);
router.put('/:id/down',requireLogin, rankingDown);

/* Abfragen aller Links: GET /links */
router.get('/', function(req, res, next) {
    res.format({
        'text/plain': function(){
            res.send(JSON.stringify(repo.getAllLinks()));
        },
        'text/html': function(){
            res.render("index", {links: repo.getAllLinks(), user: req.session.user});
        },
        'application/json': function(){
            res.json(repo.getAllLinks());
        },
        'default': function() {
            res.render("index", {links: repo.getAllLinks(), user: req.session.user});
        }
    });
});

module.exports = router;
