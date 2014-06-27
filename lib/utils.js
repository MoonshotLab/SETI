// Creates an abbreviated user object for more efficient storage
// in the cache
var abbreviateUser = function(user){
  return {
    id: user.id,
    name: user.name,
    screen_name: user.screen_name,
    followers_count: user.followers_count,
    friends_count: user.friends_count,
    profile_image_url: user.profile_image_url
  };
};


// Do we consider this person an "influencer"
var influencerKey = process.env.INFLUENCER_KEY || 0;
var userIsInfluencer = function(user){
  if(user.followers_count > influencerKey && user.friends_count < user.followers_count/2)
    return true
  else
    return false
};

exports.abbreviateUser = abbreviateUser;
exports.userIsInfluencer = userIsInfluencer;
