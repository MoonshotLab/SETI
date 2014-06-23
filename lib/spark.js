var needle = require('needle');

exports.notify = function(opts){
  var url = [
    'https://api.spark.io/v1/devices',
    process.env.SPARK_CORE_ID,
    opts.eventType
  ].join('/');

  var opts = {
    access_token: process.env.SPARK_ACCESS_TOKEN,
    params: opts.userId
  };

  needle.post(url, opts, function(err, res, body){
    if(err) console.log(err);
    else
      console.log('succesfully notified spark \n', body);
  });
};
