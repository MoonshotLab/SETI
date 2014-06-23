var express = require('express');
var ejs = require('ejs');
var spark = require('./lib/spark');
var twitter = require('./lib/twitter').subscribe();

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

http.listen(process.env.PORT || 3000);


var broadcastFollow = function(data){
  var sparkEventType = 'follow';
  if(data.source.followers_count > minFollowerAlertCount){
    sparkEventType = 'influencer-alert';
  }

  spark.notify({
    eventType: sparkEventType,
    userId: data.target.screen_name
  });

  io.emit('new-follower', data);
};

twitter.on('new-follower', broadcastFollow);
