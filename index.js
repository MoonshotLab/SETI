var twit = require('twit');
var spark = require('./spark');
var minFollowers = process.env.MIN_FOLLOWERS || 0;

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
    var source = data.source;
    if(source.followers_count > minFollowers){
      console.log('new follower!');
      console.log(data);

      spark.notify({
        eventType: 'follow',
        message: data.source
      });
    }
  }
});

socialStream.on('connected', function(){
  console.log('twitter stream connected, waiting for events...');
  console.log('tracking users:', usersToTrack.join(', '));
});


// Just creating a useless web server so heroku doesn't complain
// about the port not being bound
var port = process.env.PORT || 3000;
require('http').createServer(function(req, res){
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end("hello there...", 'utf-8');
}).listen(port);
