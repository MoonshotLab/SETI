var express = require('express');
var ejs = require('ejs');
var spark = require('./lib/spark');
var cache = require('./lib/cache');
var twitter = require('./lib/twitter');
var findInfluencers = require('./lib/find-influencers');
var utils = require('./lib/utils');
var basicAuth = require('basic-auth');
var config = require('./config')();
var livereload = null;

var app = express();
var http = require('http').Server(app);
var routes = require('./lib/routes');
var io = require('socket.io')(http);

var auth = function(req, res, next){
  next();
};

if(config.MODE != 'production'){
  livereload = require('express-livereload');
  livereload(app, {watchDir : process.cwd() + '/public'});
} else{
  findInfluencers.poll();

  auth = function(req, res, next){
    function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.send(401);
    }

    var user = basicAuth(req);
    if (!user || !user.name || !user.pass)
      return unauthorized(res);

    if (user.name === 'admin' && user.pass === 'password')
      return next();
    else
      return unauthorized(res);
  };
}

var sparkclient = require('sparknode');
var core = new sparkclient.Core({
  accessToken : config.SPARK_ACCESS_TOKEN,
  id          : config.SPARK_CORE_ID
});

core.on('error', function(err){
  console.log(err);
});

core.on('button-press', function(e){
  console.log('detected button press', e.data);

  spark.notify({
    eventType: 'influencer',
    influencer: 'someone',
    client: 'someone'
  });

  io.emit('influencer', { target : { screen_name : e.data }, isTest : true });
});

app.use(express.static(__dirname + '/public'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');

app.get('/', auth, routes.home);
app.get('/:username', routes.getUser);
app.get('/:username/followers', routes.getFollowers);
app.get('/:username/influencers', routes.getInfluencers);
app.get('/:username/mentions', routes.getMentions);

http.listen(config.PORT || 3000);


var broadcastFollow = function(data){
  var eventType = 'follow';
  var follower = data.source;
  var followee = data.target;

  if(utils.userIsInfluencer(follower)){
    eventType = 'influencer';

    // only save in the cache if running in production mode
    if(config.MODE == 'production'){
      var abbreviated = utils.abbreviateUser(follower);
      cache.saveInfluencer(abbreviated);
      cache.appendInfluencerIdsToUser(followee.screen_name, [abbreviated]);
    }
  }

  spark.notify({
    eventType: eventType,
    influencer: follower.screen_name,
    client: followee.screen_name
  });

  console.log('*-* EVENT:', eventType, followee.screen_name);
  io.emit(eventType, data);
};


var broadcastMention = function(data){
  var mentioner = data.user;
  var eventType = 'mention';

  if(utils.userIsInfluencer(mentioner)){
    eventType = 'influencer-mention';

    spark.notify({
      eventType: eventType,
      influencer: mentioner,
      client: data.mentionee
    });

    console.log('*-* EVENT:', eventType, data.mentionee);
  }

  io.emit(eventType, data);
};


twitter.startStream();
var tweets = twitter.subscribe();
tweets.on('new-follower', broadcastFollow);
tweets.on('mention', broadcastMention);
