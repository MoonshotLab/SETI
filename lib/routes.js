var twitter = require('./twitter');
var cache = require('./cache');


exports.home = function(req, res){
  res.render('index.html');
};


exports.getUser = function(req, res){
  twitter.getUser(req.params.username)
    .then(function(user){
      res.send(user);
    });
};


exports.getFollowers = function(req, res){
  cache.getFollowers(req.params.username)
    .then(function(followers){
      res.send(followers);
    });
};
