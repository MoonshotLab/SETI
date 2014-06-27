var Q = require('q');
var utils = require('./utils');
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

  db.get(username, function(err, res){
    if(!res) chacheAndRespond(username);
    else deferred.resolve(res);
  });

  return deferred.promise;
};


exports.saveFollowers = saveFollowers;
exports.getFollowers = getFollowers;
