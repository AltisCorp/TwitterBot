var Bot = require('./bot')
  , Util = require('./utils')
  , config1 = require('./config1')
  , express = require('express')
  , http = require('http')
  , app = express()
  , server = http.createServer(app)
  , io = require('socket.io').listen(server)
  , natural = require("natural")
  , classifier = new natural.BayesClassifier()
  , mongo = require('mongodb')
  , mongoClient = mongo.MongoClient;

server.listen(8080);

//Helper functions
var util = new Util();

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
      //Cleaned tweet for better classification
      var cleanTweet = text;//Util.cleanTweet(text);

      if(!tweet.retweeted) { //ignore retweets
        //filter only tweets that contain keywords
        if (util.wordsInString(text, keyWords)) {
          io.sockets.emit('stream', text);
          console.log(classifier.classify(cleanTweet), text);
        }
      }
    });
  }, 5000); //Every 5 seconds
});