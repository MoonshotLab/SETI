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

exports.abbreviateUser = abbreviateUser;
