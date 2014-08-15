var clients = process.env.TRACK_USERS.split(',');
var needle = require('needle');

exports.notify = function(opts){
  var url = [
    'https://api.spark.io/v1/devices',
    process.env.SPARK_CORE_ID,
    opts.eventType
  ].join('/');

  // This client id acts as the pin id to notify the spark
  var clientId = clients.indexOf(opts.client.toLowerCase());
  var postOpts = {
    access_token: process.env.SPARK_ACCESS_TOKEN,
    params: clientId + ',' + opts.influencer
  };

  needle.post(url, postOpts, function(err, res, body){
    if(err) console.log(err);
    else
      console.log('succesfully notified spark');
  });
};
