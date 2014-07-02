// Pass in a a command line argument for the username and this will
// build a database of abbreviated followers for the specified username.
// TAKES FOREEEEEVER since it deals with Twitter's rate handling.

var twitter = require('../lib/twitter');
var cache = require('../lib/cache');
var utils = require('../lib/utils');
var username = process.argv[2];

twitter.getInfluencers(username)
  .then(function(followers){

    cache.saveInfluencers({
      username: username,
      followers: followers
    });

    console.log('sucessfully fetched', followers.length,
      'followers for', username
    );

    process.exit();
  })
  .fail(function(err){
    console.log(err);
    process.exit();
  });
