var twit = require('twit');
var Q = require('q');
var utils = require('./utils');
var cache = require('./cache');


var twitter = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


// Recursively gets followers and determines if they're an
// "influencer" or not. This can run for a really long time
// and will require 100's of requests for users with a large
// number of followers.
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

          cache.saveInfluencers({
            username: username,
            influencers: influencers
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


var poll = function(){
  var iterations = 0;
  var users = process.env.TRACK_USERS.split(' ');

  var getIt = function(username){
    getInfluencers(username)
      .then(function(influencers){
        console.log('sucessfully fetched', influencers.length,
          'influencers for', username
        );
        console.log('sucessfully completed', iterations, 'iterations');

        iterations++;
        getIt(users[iterations%users.length]);
      })
      .fail(function(err){
        // If poll fails, attempt to restart after an hour
        console.log(err);
        setTimeout(poll, 1000*60*60);
      });
  };

  if(users[0]) getIt(users[0]);
};


exports.poll = poll;
