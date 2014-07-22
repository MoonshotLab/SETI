var Q = require('q');
var twitter = require('./twitter');
var utils = require('./utils');
var redis = require('redis');
var db = redis.createClient(9622, 'ray.redistogo.com');

db.auth(process.env.REDIS_PASS);

db.on('error', function(err){
  console.log(err);
});


var appendInfluencerIdsToUser = function(username, ids){
  var rowName = username + '-influencers';

  db.get(username, function(err, res){
    if(!res)
      db.set(username, JSON.stringify(ids));
    else{
      var existingIds = JSON.parse(res);
      var uniqueIds = utils.uniquifyArray(ids.concat(existingIds));
      db.set(username, uniqueIds);
    }
  });
};


var saveInfluencer = function(user){
  db.set(id, JSON.stringify(user));
};


var getInfluencers = function(username){
  var deferred = Q.defer();

  db.get(username, function(err, res){
    if(!res){
      twitter.getFollowers(username)
        .then(function(res){
          deferred.resolve(res);
        })
        .fail(function(err){
          deferred.reject(err);
        });
    }
    else deferred.resolve(JSON.parse(res));
  });

  return deferred.promise;
};


exports.saveInfluencer = saveInfluencer;
exports.getInfluencers = getInfluencers;
