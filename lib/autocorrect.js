const Autocorrect = {
  keyboard: undefined,
  integerHolding: '',

  checkFirstCharForInteger: function (word) {
    let splitWord = word.split('')
    for (let i=0;i<splitWord.length;i+=1) {
      if (splitWord[i] >= 0) {
        Autocorrect.integerHolding += splitWord[i]
      } else {
        splitWord.splice(0,i)
        break;
      }
    }
    return splitWord.join('')
  },

  checkWord: function (word) {
    let autoCorrectedWord = undefined;
    let narrowingDictionary = [];
    Autocorrect.integerHolding = '';

    if (parseInt(word.charAt(0)) >= 0) {
      word = Autocorrect.checkFirstCharForInteger(word)
    }
      Dictionary[word.charAt(0)].forEach((dicWord) => {
        if (dicWord == word) {
          autoCorrectedWord = word
        }
    });


    if (!autoCorrectedWord) {
      Dictionary[word.charAt(0)].forEach((dicWord) => {
            let inCommon = 0
            // console.log(dicWord);
            let dicLetters = dicWord.split('');

            if (word.length + 3 >= dicLetters.length) {
                dicLetters.forEach((dicLetter, dicIdx) => {
                  let letters = word.split('');
                  letters.forEach((letter, letIdx) => {
                    if (dicLetter == letter) {
                      inCommon += 3
                      if (dicIdx == letIdx) {
                        inCommon += 2
                      } else {
                        inCommon -= 2
                      }
                    }
                  });

                });
            }

            if (dicWord.length == word.length) {
              inCommon += 8
            } else if ((dicWord.length == word.length + 1) || (dicWord.length == word.length - 1)) {
              inCommon += 6
            }

            narrowingDictionary.push([dicWord, inCommon])

      })

      let largestPair = [undefined, 0];
      narrowingDictionary.forEach((pair) => {
        if (pair[1] > largestPair[1]) {
          largestPair = pair
        }
      })
      autoCorrectedWord = largestPair[0]
    }

    if (autoCorrectedWord) {
      Autocorrect.keyboard.state.currentWord = Autocorrect.integerHolding + autoCorrectedWord
    }

  }

};


export default Autocorrect
