var Q = require('q');
var utils = require('./utils');
var twitter = require('./twitter');
var redis = require('redis');
var db = redis.createClient();


db.on('error', function(err){
  console.log('could not connect to redis :(');
});


var saveFollowers = function(params){
  var abbreviatedUsers = [];

  params.followers.forEach(function(user){
    abbreviatedUsers.push(
      utils.abbreviateUser(user)
    );
  });

  db.set(params.username, JSON.stringify(abbreviatedUsers));

  return abbreviatedUsers;
};


var getFollowers = function(username){
  var deferred = Q.defer();

  var cacheAndRespond = function(){
    twitter.getFollowers(username)
      .then(function(followers){
        var followers = saveFollowers({
          username: username,
          followers: followers.users
        });

        deferred.resolve(followers);
      })
      .fail(function(e){
        console.log(e);
      });
  };

  db.get(username, function(err, res){
    if(!res) chacheAndRespond(username);
    else deferred.resolve(res);
  });


  return deferred.promise;
};


exports.saveFollowers = saveFollowers;
exports.getFollowers = getFollowers;
