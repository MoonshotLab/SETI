var twit = require('twit');
var minFollowers = process.env.MIN_FOLLOWERS || 0;
var EE = require('events').EventEmitter;
var twitterEvents = new EE();

var twittter = new twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var usersToTrack = process.env.TRACK_USERS.split(' ');
var socialStream = twittter.stream('user', {
  track: usersToTrack
});


socialStream.on('follow', function(data){
  if(data.source){
    ee.emit('new-follower', data.source);
  }
});


socialStream.on('connected', function(){
  console.log('twitter stream connected, waiting for events...');
  console.log('tracking users:', usersToTrack.join(', '));
});


exports.subscribe = function(){
  return twitterEvents;
};
