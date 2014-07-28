/**

Singleton class for classification and recall preprocessing

**/

var fs = require('fs');

var PreProcessor = module.exports = (function () {
  var instance;

  function init() {
    //Load stopWords array
    var stopWords = fs.readFileSync('../assets/stopwords.csv').toString().split(",");
    //create an array of each word as a RegEx for identifying word in string
    var stopWordsRegEx = stopWords.map(toRegEx);

    function toRegEx(word) {
      return new RegExp('\\b' + word + '\\b','gi');
    }

    // This function removes stop words from the given string, line
    //@param line - the string to be checked
    //@return line with all words from file removed
    function removeStopWords(line) {
      var numWords = stopWordsRegEx.length;
      //for each stop word
      for(var i=0; i<numWords; i++) {
        var word = stopWordsRegEx[i];
        //remove instances of this word from the line
        line = line.replace(stopWordsRegEx[i],'');
      }
      return line;
    }


    return {
      //Given a line, removes extraneous information including:
      // capital letters, RT, user mentions
      //@param line - the string to be checked
      //@return - line with extraneous information altered or removed
      cleanTweet: function(line) {
        line = line.toLowerCase(); //all lower case
        line = removeStopWords(line);
        line = line.replace(/\brt\b/gi,''); //remove RT
        line = line.replace(/@\w+/gi, 'T_USER');  //replace @user with generic T_USER
        return line;
      }
    };
  };

  return {
    //Get the singleton instance if one exists or create one if not
    getInstance: function() {
      if(!instance) {
        instance = init();
      }
      return instance;
    }
  };
})();