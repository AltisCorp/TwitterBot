//
//  Classification tester
//  This class is used to test our Naive Bayes classification  
//  
//  This code is posted as reference and will not be used in final 
//  implementation. 
//

var natural = require('natural'),
	fs = require("fs"),          
	readline = require("readline");

var tokenizer = new natural.WordTokenizer(),
	classifier = new natural.BayesClassifier();


/**

Test the classifier on hand categorized testing data

**/

//load classifier
natural.BayesClassifier.load('classifier.json',null,function(err, classifier) {
	processTestingData("data/testdata.manual.2009.06.14.csv", classifier);
});


function processTestingData(dir, classifier) {
	//Track number of tweets tested


	parseCSV(dir, function(line) {
		var delimiter = ',',
			tokens = line.split(delimiter);

		//numerical rating always second character
		var rating = parseInt(line.substr(1,1));
		var tweet = tokens[5].replace(/"/g, ""); //remove double quotes
		tweet = removeExtraneous(tweet);
		classifiedRating = classifier.classify(tweet);

		switch(rating) {
			case 0: //this is a negative tweet
				if (classifiedRating === "negative") {
					negRight++;
				}
				negTotal++;
				break;
			case 2: //this is a neutral tweet
				if (classifiedRating === "neutral") {
					neutralRight++;
				}
				neutralTotal++;
				break;
			case 4: //this is a positive tweet
				if (classifiedRating === "positive") {
					posRight++;
				}
				posTotal++;
				break;
			default: //parsing error
				//console.log("Error: unknown rating ", rating, " on tweet ",
				//			tweet);
		}

		console.log(tweet);
	});

	console.log("Completed testing on", posTotal, "positive tweets"
				, neutralTotal, "neutral tweets, and", negTotal
				, "negative tweets");
	var total = posTotal + neutralTotal + negTotal;
	var correct = posRight + neutralRight + negRight;
	console.log("Achieved accuracy of ", (correct/total));
	console.log("Misclassified", (posTotal-posRight), "positive tweets"
				, (neutralTotal-neutralRight), "neutral tweets, and"
				, (negTotal-negRight), "negative tweets");
}


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