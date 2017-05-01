var fs = require('fs')

var Dictionary = {}

var word

  , filename = process.argv[2];
fs.readFile('./useWords.txt', 'utf8', function(err, data) {
  if (err) throw err;
  word = data.match(/[^\r\n]+/g)

  let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  alphabet.forEach((letter) => {
    for (let i=0;i<word.length;i+=1) {


    if (word[i][0] == letter) {
      if (!Dictionary[letter]) {
        Dictionary[letter] = []
        Dictionary[letter].push(word[i])
      } else {
        if (Dictionary[letter] == word[i]){
        } else {
          Dictionary[letter].push(word[i])
        }
      }
    }

    }


  })

  Dictionary = JSON.stringify(Dictionary)

  fs.writeFile("./dictionary1.js", Dictionary, function(err) {
    console.log(Dictionary);

    if(err) {
      return console.log(err);
    }

    console.log("The file was saved!");
  });

});
