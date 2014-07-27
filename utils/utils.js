/**

Singleton class for helper functions required by classification and recall.

**/

function Util() {
//empty
}

//@param s - string to be compared
//@param words - array of words to be tested
//@return whether or not s contains any of the words in the words array
Util.prototype.wordsInString = function(s, words) {
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

//@return a properly formatted date string for current time in EST
Util.prototype.dateString = function() {
  var d = new Date(Date.now() - 5*60*60*1000);  //EST timezone
  return d.getUTCFullYear()   + '-'
  +  (d.getUTCMonth() + 1) + '-'
  +   d.getDate();
};

//Given a line, removes extraneous information including:
// capital letters
// RT 
// user mentions
//@param line - the string to be checked
//@return - line with extraneous information altered or removed
Util.prototype.cleanTweet = function(line) {
  line = line.toLowerCase(); //all lower case
  line = line.replace(/\brt\b/gi,''); //remove RT
  line = line.replace(/@\w+/gi, 'T_USER');  //replace @user with generic T_USER
  return line;
}

// This function removes stop words from a CSV file from the given string, line
//@param file - the filepath to stop word file
//@param line - the string to be checked
//@return line with all words from file removed
Util.prototype.removeStopWords = function(file, line) {
  //remove stop words form tweet
  var file = stopWords;

  var rl = readline.createInterface({
    input: fs.createReadStream(file),
    output: null,
    terminal: false
  });

  rl.on("line", function(line) {
    var delimiter = ',',
    tokens = line.split(delimiter),
    length = tokens.length;

    for (var i=0; i<legnth; i++) {
      stopWord = tokens[i];
    }

  
  });

  rl.on("close", function() {
    console.log("Training completed and saved!");
  });

}