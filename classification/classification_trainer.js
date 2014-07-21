//
//  Classification trainer
//  This class is used to train our Naive Bayes classification using an open
//  corpus of data by Go et. al. 
//  
//  This code is posted as reference and will not be used in final 
//  implementation. The resulting output: classifier.json is all that is needed 
//  to recall this training.
//
var natural = require('natural'),
	fs = require("fs"),          
	readline = require("readline");

//////////
/**

Variables to track tweet corpus data

**/

var counter = 0;

var negMax = 50000; //number of positive tweets to be collected
var posMax = 50000; //number of negative tweets to be ollected

var negTotal, neuTotal, posTotal;
negTotal = neuTotal = posTotal = 0;

//this variable affects how many documents added until trained, this affects
//efficiency of training the bayesian classifier
var docThreshold = 10000;

//////////


var tokenizer = new natural.WordTokenizer(),
	classifier = new natural.BayesClassifier();

/**

Train the classifier

**/

function processTrainingData(dir) {
	//Track number of tweets trained
	trainCSV(dir, function(line) {
		var delimiter = ',',
			tokens = line.split(delimiter);

		//numerical rating always second character
		var rating = tokens[0].replace(/"/g, "");
		var tweet = tokens[1].replace(/"/g, ""); //remove double quotes
		tweet = removeExtraneous(tweet);
		//console.log(rating, tweet);
		switch(rating) {
			case "0": //this is a negative tweet
				if (negTotal < negMax) {
					classifier.addDocument(tweet, "negative");
					counter++;
				}
				break;
			case "2": //this is a neutral tweet
				classifier.addDocument(tweet, "neutral");
				break;
			case "4": //this is a positive tweet
				if (posTotal < posMax) {
					classifier.addDocument(tweet, "positive");
					counter++;
				}
				break;
			default: //parsing error
				console.log("Error: unknown rating ", rating, " on tweet ",
							tweet);
		}
		//Train every docThreshold documents added
		if (counter % docThreshold == 0) {
			classifier.train()
		}
	});
}

function trainCSV(filename, callback) {
	var file = filename;

	var rl = readline.createInterface({
		input: fs.createReadStream(file),
		output: null,
		terminal: false
	})

	rl.on("line", callback);

	classifier.events.on('trainedWithDocument', function (obj) {
	   var rating = obj.doc.label;
   		switch(rating) {
		case "negative": //this is a negative tweet
			negTotal++;
			break;
		case "neutral": //this is a neutral tweet
			neuTotal++;
			break;
		case "positive": //this is a positive tweet
			posTotal++;
			break;
		default: //this should not happen...
			console.log("Error: unknown classification ", rating);
		}
		console.log("Trained", posTotal, "positive tweets", neuTotal
					,"neutral tweets, and", negTotal, "negative tweets");
	});

	rl.on("close", function() {
		classifier.save('classifier.json', function(err, classifier) {
    		console.log("Training completed and saved!");
		});

		console.log("Trained", posTotal, "positive tweets", neuTotal
					,"neutral tweets, and", negTotal, "negative tweets");
	});
}

processTrainingData("data/trainingTrimmed.csv");

/**

Helper functions

**/

//TODO: additional improvements possible. Stop words, etc.
//Given a line, removes extraneous information including:
// RT 
// @user
function removeExtraneous(line) {
	line = line.replace(/\brt\b/gi,''); //remove RT
	line = line.replace(/@\w+/gi, '');  //remove user
	return line;
}