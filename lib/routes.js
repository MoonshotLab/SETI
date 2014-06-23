var twitter = require('./twitter');


exports.home = function(req, res){
  res.render('index');
};


exports.getUser = function(req, res){
  twitter.getUser(req.params.username).then(function(user){
    res.send(user);
  });
};


exports.getFollowers = function(req, res){
  twitter.getFollowers(req.params.username).then(function(user){
    res.send(user);
  });
};
