var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/mintone');

router.get('/news', function(req, res) {
    var collection = db.get('news');
    collection.find({}, function(err, news){
        if (err) throw err;
      	res.json(news);
    });
});

router.get('/talents', function(req, res) {
    var collection = db.get('talents');
    collection.find({}, function(err, talents){
        if (err) throw err;
      	res.json(talents);
    });
});

router.get('/releases', function(req, res) {
    var collection = db.get('releases');
    collection.find({}, function(err, releases){
        if (err) throw err;
      	res.json(releases);
    });
});

router.get('/events', function(req, res) {
    var collection = db.get('events');
    collection.find({}, function(err, events){
        if (err) throw err;
      	res.json(events);
    });
});

module.exports = router;