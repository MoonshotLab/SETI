var twitter = require('../lib/twitter');

twitter.getRateLimitStatus()
  .then(function(res){
    for(var key in res){
      console.log(key, res[key]);
      console.log('next available query ready at', new Date(res[key].reset * 1000), '\n');
    }
  })
  .fail(function(err){
    console.log(err);
  });
