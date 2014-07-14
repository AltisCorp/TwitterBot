//
//  Classification trainer
//  This class is used to train our Naive Bayes classification using an open
//  corpus of data by Sanders as well as Go et. al. 
//  
//  This code is posted as reference and will not be used in final 
//  implementation. The resulting output: classifier.json is all that is needed 
//  to recall this training.
//

var natural = require('natural'),
	fs = require("fs"),
	readline = require("readline");

var tokenizer = new natural.WordTokenizer(),
	classifier = new natural.BayesClassifier();

/**

Load the training sets

**/

//Sander's CSV trainer
function parseSandersCSV(dir) {
	parseCSV(dir, function(line) {
		var processedLine = removeExtraneous(line);
		//remove pos/neg tags from processed line
		processedLine = processedLine.substring(4);

		//In this data set, the first 3 chars are "Pos" or "Neg"
		switch(line.substr(0,3).toLowerCase()) {
			case "pos":
				classifier.addDocument(processedLine, 'positive');
				break;
			case "neg": 
				classifier.addDocument(processedLine, 'negative');
				break;
			default: 
				//an error has occured. Line misformatted
				console.log(line);
				console.log("ERROR: malformed line in " + dir);
				break;
		}
	});
}

parseGoEtAlCSV("data/twitter-sanders-apple2.csv");
//parseSandersCSV("data/twitter-sanders-apple3.csv");


function 


/**

Test against very large data set

**/







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


function parseCSV(filename, callback) {
	var file = filename;

	var rl = readline.createInterface({
		input: fs.createReadStream(file),
		output: null,
		terminal: false
	})

	rl.on("line", callback);

	rl.on("close", function() {
		console.log("All data processed.");
	});
};