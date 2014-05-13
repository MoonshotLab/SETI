var needle = require('needle');
var path = require('path');

exports.notify = function(opts){
  var url = path.join(
    'https://api.spark.io/v1/devices/',
    process.env.SPARK_CORE_ID,
    opts.eventType
  );

  var params = {
    access_token: process.env.SPARK_CORE_ACCESS_TOKEN,
    message: opts.message
  };

  needle.post(url, params, function(err, res, body){
    console.log('succesfully notified spark');
  });
};
