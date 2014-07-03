var Q = require('q');
var twitter = require('./twitter');
var utils = require('./utils');
var cache = require('./cache');


exports.home = function(req, res){
  res.render('index.html');
};


exports.getUser = function(req, res){
  twitter.getUser(req.params.username)
    .then(function(user){
      res.send(user);
    }).fail(function(err){
      res.send(err);
    });
};


exports.getFollowers = function(req, res){
  twitter.getFollowers(req.params.username)
    .then(function(followers){
      res.send(followers);
    })
    .fail(function(err){
      res.send(err);
    });
};


exports.getInfluencers = function(req, res){
  cache.getInfluencers(req.params.username)
    .then(function(influencers){
      res.send(influencers);
    })
    .fail(function(err){
      res.send(err);
    });
};


exports.getMentions = function(req, res){
  twitter.getMentions(req.params.username)
    .then(function(mentions){
      res.send(mentions);
    })
    .fail(function(err){
      res.send(err);
    });
};
