var _ = require('underscore');
var Q = require('q');
var twitter = require('./twitter');
var utils = require('./utils');
var redis = require('redis');
var config = require('../config')();
var db = redis.createClient(9622, 'ray.redistogo.com');

db.auth(config.REDIS_PASS);

db.on('error', function(err){
  console.log(err);
});


var appendInfluencerIdsToUser = function(username, ids){
  var setName = username.toLowerCase() + '-influencer-ids';

  db.get(setName, function(err, res){
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
  db.get(user.id, function(err, res){
    if(res){
      var fetchedUser = JSON.parse(res);
      if(fetchedUser.followed_date)
        user.followed_date = fetchedUser.followed_date;
    }

    if(!user.followed_date)
      user.followed_date = new Date().getTime();

    db.set(user.id, JSON.stringify(user));
  });
};


var getInfluencers = function(username){
  var deferred = Q.defer();
  var setName = username.toLowerCase() + '-influencer-ids';

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
            var sorted = _.sortBy(influencers, function(item){
              return -1*item.followed_date;
            });

            deferred.resolve(sorted);
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
