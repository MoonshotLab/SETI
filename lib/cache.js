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
  var setName = username + '-influencer-ids';

  db.get(username, function(err, res){
    if(!res)
      db.set(setName, JSON.stringify(ids));
    else{
      var existingIds = JSON.parse(res);
      var uniqueIds = utils.uniquifyArray(ids.concat(existingIds));
      db.set(setName, JSON.stringify(uniqueIds));
    }
  });
};


var saveInfluencer = function(user){
  db.set(user.id, JSON.stringify(user));
};


var getInfluencers = function(username){
  var deferred = Q.defer();
  var setName = username + '-influencer-ids';

  db.get(setName, function(err, res){
    if(!res){
      twitter.getFollowers(username)
        .then(deferred.resolve)
        .fail(deferred.reject);
    } else {
      var influencerIds = JSON.parse(res);
      var influencers = [];

      influencerIds.forEach(function(id){
        getInfluencer(id).then(function(influencer){
          influencers.push(influencer);
          if(influencers.length == influencerIds.length){
            deferred.resolve(influencers);
          }
        });
      });
    }
  });

  return deferred.promise;
};


var getInfluencer = function(id){
  var deferred = Q.defer();

  db.get(id, function(err, res){
    if(res) deferred.resolve(JSON.parse(res));
    else deferred.resolve({});
  });

  return deferred.promise;
};


exports.saveInfluencer = saveInfluencer;
exports.getInfluencers = getInfluencers;
exports.appendInfluencerIdsToUser = appendInfluencerIdsToUser;
