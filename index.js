var express = require('express');
var ejs = require('ejs');
var spark = require('./lib/spark');
var twitter = require('./lib/twitter');
var utils = require('./lib/utils');

var app = express();
var http = require('http').Server(app);
var routes = require('./lib/routes');
var io = require('socket.io')(http);
var minFollowerAlertCount = process.env.MIN_FOLLOWERS || 0;

app.use(express.static(__dirname + '/public'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');

app.get('/', routes.home);
app.get('/:username', routes.getUser);
app.get('/:username/followers', routes.getFollowers);
app.get('/:username/influencers', routes.getInfluencers);
app.get('/:username/mentions', routes.getMentions);

http.listen(process.env.PORT || 3000);


var broadcastFollow = function(data){
  var sparkEventType = 'follow';
  var user = data.source;

  if(utils.userIsInfluencer(user)){
    sparkEventType = 'influencer-alert';
  }

  spark.notify({
    eventType: sparkEventType,
    userId: data.target.screen_name
  });

  io.emit('new-follower', data);
};


var broadcastMention = function(data){
  spark.notify({
    eventType: 'mention',
    username: data.mentionee
  });

  io.emit('mention', data);
};


twitter.startStream();
var tweets = twitter.subscribe();
tweets.on('new-follower', broadcastFollow);
tweets.on('mention', broadcastMention);
