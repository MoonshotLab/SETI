var express = require('express');
var ejs = require('ejs');
var spark = require('./lib/spark');
var twitter = require('./lib/twitter').subscribe();

var app = express();
var http = require('http').Server(app);
var routes = require('./lib/routes');
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');

app.get('/', routes.home);
app.get('/:twitterId', routes.show);

http.listen(process.env.PORT || 3000);


var broadcastFollow = function(data){
  var sparkEventType = 'follow';
  if(data.followers_count > minFollowers){
    sparkEventType = 'big-follow';
  }

  spark.notify({ eventType: sparkEventType });
  io.emit('new-follower', data);
};

twitter.on('new-follower', broadcastFollow);
