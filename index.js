var app = require('express')();
var spark = require('./lib/spark');
var twitter = require('./lib/twitter');
var http = require('http').Server(app);
var routes = require('./lib/routes');
var io = require('socket.io')(http);
var PORT = process.env.PORT || 3000;

app.get('/', routes.home);
app.get('/:client', routes.showClient);



var broadcastFollow = function(data){
  var sparkEventType = 'follow';
  if(data.followers_count > minFollowers){
    sparkEventType = 'big-follow';
  }

  spark.notify({ eventType: sparkEventType });
  io.emit('new-follower', data);
};


http.listen(PORT, function(){
  console.log('server running on port', PORT);
});


twitter.on('new-follower', broadcastFollow);
