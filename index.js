var express = require('express');
var ejs = require('ejs');
var spark = require('./lib/spark');
var cache = require('./lib/cache');
var twitter = require('./lib/twitter');
var findInfluencers = require('./lib/find-influencers');
var utils = require('./lib/utils');
var env = process.env.MODE;
var livereload = null;

var app = express();
var http = require('http').Server(app);
var routes = require('./lib/routes');
var io = require('socket.io')(http);
var minFollowerAlertCount = process.env.MIN_FOLLOWERS || 0;

if(env != 'production'){
  livereload = require('express-livereload');
  livereload(app, {watchDir : process.cwd() + '/public'});
}

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
  var eventType = 'follow';
  var follower = data.source;
  var followee = data.target;

  if(utils.userIsInfluencer(follower)){
    eventType = 'influencer-alert';
    var abbreviated = utils.abbreviateUser(follower);
    cache.saveInfluencer(abbreviated);
    cache.appendInfluencerIdsToUser(followee.screen_name, abbreviated);
  }

  spark.notify({
    eventType: eventType,
    influencer: followee.screen_name,
    client: folowee.screen_name
  });

  console.log('*-* EVENT:', eventType, followee.screen_name);
  io.emit(eventType, data);
};


var broadcastMention = function(data){
  var mentioner = data.user;
  var eventType = 'mention';

  spark.notify({
    eventType: eventType,
    influencer: data.mentioner.screen_name,
    client: data.mentionee.screen_name
  });

  console.log('*-* EVENT:', eventType, data.mentionee);
  io.emit(eventType, data);
};


twitter.startStream();
var tweets = twitter.subscribe();
tweets.on('new-follower', broadcastFollow);
tweets.on('mention', broadcastMention);

if(env == 'production')
  findInfluencers.poll();
