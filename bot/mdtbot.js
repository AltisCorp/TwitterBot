var Bot = require('./bot')
  , config1 = require('./config1')
  , express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , natural = require("natural")
  , classifier = new natural.BayesClassifier();

var PreProcessor = require('../utils/preprocessor');
var preProcessor = PreProcessor.getInstance();

server.listen(8080);

//tweet pre processing
//var processor = preProcessor.getInstance();

//Routing
app.get('/', function (req, res) { 
  res.sendfile(__dirname + '/index.html');
});

//Initialize bot with API credentials
var bot = new Bot(config1);
io.sockets.on('connection', function(socket) {
  console.log('Connected to client.');
})

natural.BayesClassifier.load('classifier.json', null, function(err, classifier) {  
  console.log('Loaded classifier.');  
  setInterval(function() {
    //Bounding box of miami area: SW, NE
    var miami = ['-80.3','25.7','-80.1','25.9']; //TODO: may be innacurate
    var params = {locations: miami};
    // If a tweet has any of these words
    var keyWords = ["taxi", "cab", "taxis", "cabs"] 

    bot.stream(params, function(tweet) {
      var classification;
      var text = tweet.text;
      //run some pre processing on the tweet
      var cleanTweet = preProcessor.cleanTweet(text);

      if(!tweet.retweeted) { //ignore retweets
        //filter only tweets that contain keywords
        if (wordsInString(text, keyWords)) {
          io.sockets.emit('stream', text);
          console.log(classifier.classify(cleanTweet), text);
        }
      }
    });
  }, 5000); //Every 5 seconds
});

//@return a properly formatted date string for current time in EST
function dateString() {
  var d = new Date(Date.now() - 5*60*60*1000);  //EST timezone
  return d.getUTCFullYear()   + '-'
  +  (d.getUTCMonth() + 1) + '-'
  +   d.getDate();
};


//@param s - string to be compared
//@param words - array of words to be tested
//@return whether or not s contains any of the words in the words array
function wordsInString(s, words) {
  var word;
  s = s.toLowerCase();
  for (var i=0; i<words.length; i++) {
    word = words[i].toLowerCase();
    if (new RegExp('\\b' + word + '\\b', 'i').test(s)) {
      return true;
    }
  }
  return false;
};