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
var counter = 0;

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
				classifier.addDocument(tweet, "negative");
				break;
			case "2": //this is a neutral tweet
				classifier.addDocument(tweet, "neutral");
				break;
			case "4": //this is a positive tweet
				classifier.addDocument(tweet, "positive");
				break;
			default: //parsing error
				console.log("Error: unknown rating ", rating, " on tweet ",
							tweet);
		}
		counter++;
		//Train every 1000 documents added
		if (counter % 1000 == 0) {
			classifier.train()
		}
	});
}

function trainCSV(filename, callback) {
	var file = filename;
	var negTotal, neuTotal, posTotal;
	negTotal = neuTotal = posTotal = 0;

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

//Given a line, removes extraneous information including:
// RT 
// @user
function removeExtraneous(line) {
	line = line.replace(/\brt\b/gi,''); //remove RT
	line = line.replace(/@\w+/gi, '');  //remove user
	return line;
}