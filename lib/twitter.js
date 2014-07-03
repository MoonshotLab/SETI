var twit = require('twit');
var Q = require('q');
var utils = require('./utils');
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


var getInfluencers = function(username){
  var deferred = Q.defer();
  var influencers = [];
  var times = 1;

  console.log('Finding influencers for', username);

  var fetch = function(cursor){
    twitter.get(
      'followers/list',
      { screen_name: username,  cursor: cursor, count: 200 },
      function(err, data, res){
        if(err) deferred.reject(err);
        if(data && data.users){
          data.users.forEach(function(user){
            if(utils.userIsInfluencer(user)){
              var abbreviated = utils.abbreviateUser(user);
              influencers.push(abbreviated);
            }
          });
        }

        if(data && data.next_cursor){
          console.log(influencers.length, 'found...');
          console.log('fetched', times, 'times');

          setTimeout(function(){
            fetch(data.next_cursor);
          }, 60000);

          times++;
        } else
          deferred.resolve(influencers);
      }
    );
  };

  fetch();
  return deferred.promise;
};


exports.getUser = getUser;
exports.getFollowers = getFollowers;
exports.getInfluencers = getInfluencers;
exports.getRateLimitStatus = getRateLimitStatus;

exports.subscribe = subscribe;
exports.startStream = startStream;
