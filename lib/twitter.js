var twit = require('twit');
var Q = require('q');
var minFollowers = process.env.MIN_FOLLOWERS || 0;
var EE = require('events').EventEmitter;
var twitterEvents = new EE();


var twitter = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


var startStream = function(){
  var usersToTrack = process.env.TRACK_USERS.split(' ');
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
  )

  return deferred.promise;
};


var getUser = function(username){
  var deferred = Q.defer();

  twitter.get(
    'users/show',
    { screen_name: username },
    function(err, data, res){
      deferred.resolve(data);
    }
  );

  return deferred.promise;
};


var getFollowers = function(username){
  var deferred = Q.defer();

  twitter.get(
    'followers/list',
    { screen_name: username },
    function(err, data, res){
      if(err) deferred.reject(err);
      else deferred.resolve(data.users);
    }
  );

  return deferred.promise;
};


var getAllFollowers = function(username){
  var deferred = Q.defer();
  var followers = [];

  var fetch = function(cursor){
    twitter.get(
      'followers/list',
      { screen_name: username,  cursor: cursor},
      function(err, data, res){
        if(err) deferred.reject(err);
        if(data.users)
          followers.push.apply(followers, data.users)

        if(data && data.next_cursor){
          console.log(
            'getting more followers for', username,
            ', currently at', followers.length
          );
          setTimeout(function(){
            fetch(data.next_cursor);
          }, 61000);
        }
        else
          deferred.resolve(followers);
      }
    );
  };

  fetch();
  return deferred.promise;
};


exports.getUser = getUser;
exports.getFollowers = getFollowers;
exports.getAllFollowers = getAllFollowers;
exports.getRateLimitStatus = getRateLimitStatus;

exports.subscribe = subscribe;
exports.startStream = startStream;
