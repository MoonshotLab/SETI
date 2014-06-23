var needle = require('needle');

exports.notify = function(opts){
  var url = [
    'https://api.spark.io/v1/devices',
    process.env.SPARK_CORE_ID,
    opts.eventType
  ].join('/');

  var params = {
    access_token: process.env.SPARK_ACCESS_TOKEN
  };

  needle.post(url, params, function(err, res, body){
    if(err) console.log(err);
    else
      console.log('succesfully notified spark \n', body);
  });
};
