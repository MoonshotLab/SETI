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
    });
};


exports.getFollowers = function(req, res){
  cache.getFollowers(req.params.username)
    .then(function(followers){
      res.send(followers);
    });
};


exports.getInfluencers = function(req, res){
  var findInfluencers = function(followers){
    var deferred = Q.defer();
    var influencers = [];

    followers.forEach(function(follower){
      if(utils.userIsInfluencer(follower))
        influencers.push(follower);
    });

    deferred.resolve(influencers);

    return deferred.promise;
  };

  cache.getFollowers(req.params.username)
    .then(findInfluencers)
    .then(function(influencers){
      res.send(influencers);
    });
}
