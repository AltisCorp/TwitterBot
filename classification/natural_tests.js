var natural = require('natural'),  
classifier = new natural.BayesClassifier();  
  
classifier.addDocument( ['unit', 'test'], 'software');
classifier.train();   
classifier.addDocument( ['bug', 'program'], 'software');  
classifier.train(); 
classifier.addDocument(['drive', 'capacity'], 'hardware');  
classifier.train(); 
classifier.addDocument(['power', 'supply'], 'hardware');  
classifier.train();  
  
classifier.save('classifierTests2.json', function(err, classifier) {  
    // the classifier is saved to the classifier.json file!  
 }); 