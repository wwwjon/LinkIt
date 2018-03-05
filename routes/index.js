var express = require('express');
var repo = require('../models/links');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    res.format({
        'text/html': function(){
            res.render("index", {links: repo.getAllLinks(), user: req.session.user});
        }
    });
});


module.exports = router;
