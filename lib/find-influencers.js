var twit = require('twit');
var Q = require('q');
var utils = require('./utils');
var cache = require('./cache');
var config = require('../config')();

var twitter = new twit({
  consumer_key        : config.ALT_TWITTER_CONSUMER_KEY,
  consumer_secret     : config.ALT_TWITTER_CONSUMER_SECRET,
  access_token        : config.ALT_TWITTER_ACCESS_TOKEN,
  access_token_secret : config.ALT_TWITTER_ACCESS_TOKEN_SECRET
});


// Recursively gets followers and determines if they're an
// "influencer" or not. This can run for a really long time
// and will require 100's of requests for users with a large
// number of followers.
var getInfluencers = function(username){
  var deferred = Q.defer();
  var influencerCount = 0;
  var times = 1;

  console.log('---> finding influencers for', username);

  var fetch = function(cursor){
    twitter.get(
      'followers/list',
      { screen_name: username,  cursor: cursor, count: 200 },
      function(err, data, res){
        var influencerIds = [];

        if(err) deferred.reject(err);
        if(data && data.users){
          data.users.forEach(function(user){
            if(utils.userIsInfluencer(user)){
              var abbreviated = utils.abbreviateUser(user);
              cache.saveInfluencer(abbreviated);
              influencerIds.push(abbreviated.id);
            }
          });

          if(influencerIds.length){
            cache.appendInfluencerIdsToUser(
              username,
              influencerIds
            );

            influencerCount += influencerIds.length;
          }
        }

        console.log('--->', influencerIds.length, 'influencers found for', username);
        console.log('---> fetched', times, 'times for', username);

        if(data && data.next_cursor){
          setTimeout(function(){
            fetch(data.next_cursor);
          }, 60000);

          times++;
        } else
          deferred.resolve(influencerCount);
      }
    );
  };

  fetch();
  return deferred.promise;
};


var poll = function(){
  var iterations = 0;
  var users = config.TRACK_USERS.split(',');

  var getEm = function(username){
    getInfluencers(username)
      .then(function(influencerCount){
        console.log('---> finished fetching influencers for', username + '. Found',
          influencerCount, 'total influencers'
        );

        iterations++;
        setTimeout(function(){
          getEm(users[iterations%users.length]);
        }, 60000);
      })
      .fail(function(err){
        // If poll fails, attempt to restart in 15 minutes (the rate limit time frame)
        console.log(err);
        setTimeout(poll, 1000*60*15);
      });
  };

  if(users[0]) getEm(users[0]);
};


exports.poll = poll;
