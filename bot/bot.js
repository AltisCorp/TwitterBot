//
//  Bot
//  class for performing various twitter actions
//
var Twit = require('twit');

var Bot = module.exports = function(config) { 
  this.twit = new Twit(config);
};

//
//  post a tweet
//
Bot.prototype.tweet = function (status, callback) {
  if(typeof status !== 'string') {
    return callback(new Error('tweet must be of type String'));
  } else if(status.length > 140) {
    return callback(new Error('tweet is too long: ' + status.length));
  }
  this.twit.post('statuses/update', { status: status }, callback);
};

//
//Search twitter for all tweets that satisfy the given params
//
Bot.prototype.search = function (params, callback) { 
  this.twit.get('search/tweets', params, callback);
};

//
//Stream tweets given params
//
Bot.prototype.stream = function (params, callback) {
  var stream = this.twit.stream('statuses/filter', params);
  stream.on('tweet', callback);
};


function randIndex (arr) {
  var index = Math.floor(arr.length*Math.random());
  return arr[index];
};