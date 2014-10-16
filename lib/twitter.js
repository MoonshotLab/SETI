var twit = require('twit');
var Q = require('q');
var EE = require('events').EventEmitter;
var config = require('../config')();
var twitterEvents = new EE();


var twitter = new twit({
  consumer_key        : config.TWITTER_CONSUMER_KEY,
  consumer_secret     : config.TWITTER_CONSUMER_SECRET,
  access_token        : config.TWITTER_ACCESS_TOKEN,
  access_token_secret : config.TWITTER_ACCESS_TOKEN_SECRET
});


var startStream = function(){
  var usersToTrack = config.TRACK_USERS.split(',');
  var socialStream = twitter.stream('user', {
    track: usersToTrack
  });

  socialStream.on('connected', function(){
    console.log('twitter stream connected, waiting for events...');
    console.log('tracking users:', usersToTrack.join(', '));
  });

  socialStream.on('follow', function(data){
    twitterEvents.emit('new-follower', data);
  });

  socialStream.on('tweet', function(data){
    usersToTrack.forEach(function(username){
      var atted = '@' + username.toLowerCase();
      if(data.text.toLowerCase().indexOf(atted) != -1){
        data.mentionee = username;
        twitterEvents.emit('mention', data);
      }
    });
  });
};


var subscribe = function(){
  return twitterEvents;
};


var getRateLimitStatus = function(){
  var deferred = Q.defer();

  twitter.get(
    'application/rate_limit_status',
    {},
    function(err, data, res){
      deferred.resolve(data.resources.followers);
    }
  );

  return deferred.promise;
};


var getUser = function(username){
  var deferred = Q.defer();

  twitter.get(
    'users/show',
    { screen_name: username },
    function(err, data, res){
      if(err) deferred.reject(err);
      else deferred.resolve(data);
    }
  );

  return deferred.promise;
};


var getFollowers = function(username){
  var deferred = Q.defer();

  twitter.get(
    'followers/list',
    { screen_name: username, count: 200 },
    function(err, data, res){
      if(err) deferred.reject(err);
      else deferred.resolve(data.users);
    }
  );

  return deferred.promise;
};


var getMentions = function(username){
  var deferred = Q.defer();

  twitter.get(
    'search/tweets',
    { q : username, count : 100 },
    function(err, data, res){
      if(err) deferred.reject(err);
      else deferred.resolve(data.statuses);
    }
  );

  return deferred.promise;
};


exports.getUser = getUser;
exports.getFollowers = getFollowers;
exports.getRateLimitStatus = getRateLimitStatus;
exports.getMentions = getMentions;

exports.subscribe = subscribe;
exports.startStream = startStream;
