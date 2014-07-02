var Q = require('q');
var twitter = require('./twitter');
var utils = require('./utils');
var redis = require('redis');
var db = redis.createClient(9622, 'ray.redistogo.com');

db.auth(process.env.REDIS_PASS);

db.on('error', function(err){
  console.log(err);
});


var saveInfluencers = function(params){
  var abbreviatedUsers = [];

  params.followers.forEach(function(user){
    abbreviatedUsers.push(
      utils.abbreviateUser(user)
    );
  });

  db.set(params.username, JSON.stringify(abbreviatedUsers));

  return abbreviatedUsers;
};


var getInfluencers = function(username){
  var deferred = Q.defer();

  db.get(username, function(err, res){
    if(!res){
      twitter.getFollowers(username)
        .then(function(res){
          deferred.resolve(res);
        });
    }
    else deferred.resolve(JSON.parse(res));
  });

  return deferred.promise;
};


exports.saveInfluencers = saveInfluencers;
exports.getInfluencers = getInfluencers;
