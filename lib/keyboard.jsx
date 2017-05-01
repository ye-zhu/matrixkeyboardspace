import React from 'react'
import Autocorrect from './autocorrect'
import ReactDOM from 'react-dom'
import Store from './store'

const randomTime = function () {
  return 20 * Math.random() * 900
}

document.addEventListener('contextmenu', event => event.preventDefault())

class Keyboard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text:'',
      bottomText:[],
      currentWord: undefined,
      mouseOver: false,
      addPlayerBox: false,
      clickTimer: randomTime(),
      form: {},
      players: this.props.players
    }
    this.pushNamesToDictionary(this.props.players)
    this.setTimer()
    this.textToSpeech()
}

  setTimer () {
      setTimeout(function(){
        if (this.state.text.length > 0 && this.state.mouseOver) {
          this.state.clickTimer = 0
        } else {
          this.setTimer()
        }
      }.bind(this), randomTime())
  }

  pushNamesToDictionary (players) {
    // let integerHolding = ''
    // this.props.players.forEach((player) => {
    //
    //   let splitWord = player.split('')
    //   for (let i=0;i<splitWord.length;i+=1) {
    //     if (splitWord[i] >= 0) {
    //       integerHolding += splitWord[i]
    //     } else {
    //       splitWord.splice(0,i)
    //       break;
    //     }
    //   }
    //   this.props.players = splitWord.join('')
    // })

    players.forEach((player) => {
      if (player.split(" ").length > 1) {
        player.split(" ").forEach((segment) => {
          if (segment = " "){
          } else {
            Dictionary[segment.charAt(0).toLowerCase()].push(segment.toLowerCase())
          }
        })
      }
      Dictionary[player.charAt(0).toLowerCase()].push(player.toLowerCase())
    })
  }

  textToSpeech () {
    // var voices = window.speechSynthesis.getVoices().forEach((voice) => {console.log(voice.name)});
    var voices = window.speechSynthesis.getVoices().filter(function(voice) { return voice.name == 'Cellos'; })[0];
    var msg = new SpeechSynthesisUtterance(this.state.text)
    msg.voice = voices;
    msg.voiceURI = 'native';
    msg.volume = 1; // 0 to 1
    msg.rate = 1; // 0.1 to 10
    // msg.pitch = 1; //0 to 2
    window.speechSynthesis.speak(msg)
  }

  randomizeAutoClick (key) {
    if (this.state.clickTimer == 0) {
        // document.getElementsByClassName(`keyboardKey ${key}`)[0].style.background = "#425dff";
        document.getElementsByClassName(`keyboardKey ${key}`)[0].click()
        this.setTimer()
        this.state.clickTimer = randomTime()
      }
  }

  playAud () {
      var audio = document.getElementById("lightbeamAud");
      audio.volume = 0.4
      if (audio.paused) {
        audio.play();
      }else{
        audio.currentTime = 0
      }
    }

  keyTypes (key) {
    if (key == 'space') {
      if (this.state.text == 'YES' || this.state.text == 'NO') {
        this.state.text = ''
      } else {
        this.state.text += ' '
      }
    } else if (key == 'backspace') {
      if (this.state.text == 'YES' || this.state.text == 'NO') {
        this.state.text = ''
      } else {
        this.playAud()
        this.state.text = this.state.text.slice(0,-1)
      }
    } else if (key == 'clearscreen') {
      if (this.state.text  != 'YES' && this.state.text  != 'NO') {
        if (this.state.text.length > 1) {
          this.currentWord()
        }
        this.textToSpeech()
      }
      if (this.state.text != '') {
        this.state.bottomText.unshift(this.state.text)
      }
      this.state.text = ''
    } else if (key == 'YES' || key == 'NO') {
        this.state.text = ''
        this.state.text += key
        this.textToSpeech()
    } else if (key == '+'){
        this.state.addPlayerBox = true
    }else {
      if (this.state.text == 'YES' || this.state.text == 'NO'){
        this.state.text = ''
        this.textToSpeech()
      }
      this.state.text += key

      this.playAud()
    }
  }

  checkingTypingWords (key) {
    let typingWord = this.state.text.split(" ")
    this.state.currentWord = typingWord[typingWord.length - 1]
      if (this.state.text.length > 1) {
        let newSentence = typingWord.slice(0, -1).join(" ")
        this.autoCorrect(this.state.currentWord)
        this.state.text = newSentence + " " + this.state.currentWord + " "
      } else {
        this.autoCorrect(this.state.currentWord)
        this.keyTypes(key)
    }
  }

  currentWord (key) {
    // debugger
    this.state.players.forEach((player) => {
      if (key == " " + player + " " && this.state.text.length > 1) {
        this.checkingTypingWords(key)
      }
    })

    if (key && key != 'space') {
      this.keyTypes(key)
    } else if (key == 'space' && (this.state.text == 'YES' || this.state.text == 'NO')) {
      this.state.text = ''
    } else {
      this.checkingTypingWords(key)
    }
  }

  autoCorrect (word) {
    if (word.length > 1) {
      Autocorrect.keyboard = this
      Autocorrect.checkWord(word)
    }
  }

  keyboardLayout () {
      let keyboardKeys = [
				['1','2','3','4','5','6','7','8','9','0'],
        ['q','w','e','r','t','y','u','i','o','p', ],
				['a','s','d','f','g','h','j','k','l'],
				['z','x','c','v','b','n','m'],
				['space', 'backspace'],
				['YES', 'NO', 'clearscreen'],
        this.state.players.map((name) => {return " " + name + " "}),
        ['+']
			].map((row, rowidx) => {
        let keys = row.map((key, keyidx) => {
          let handleClick = (e) => {
              e.preventDefault();
              this.currentWord(key)
              this.forceUpdate()
            }
          this.clickListener = handleClick.bind(this)

          let handleMouseOver = () => {
            this.state.mouseOver = true
              this.randomizeAutoClick(key)
            }
          this.hoverListener = handleMouseOver.bind(this)

          let handleMouseOut = () => {
              this.state.mouseOver = false
            }
          this.mouseOutListener = handleMouseOut.bind(this)

          return (
            <div key={`${key + keyidx}`} className={`keyboardKey ${key}`} onClick={this.clickListener} onMouseOver={this.hoverListener} onMouseOut={this.mouseOutListener}>
              {key}
            </div>
          )
        })
        return (
            <div className = {`keyboardRow idx${rowidx}`} key={`${rowidx}`}>
              {keys}
            </div>
        )
      })
    return keyboardKeys
  }

  addPlayerFromBox (e) {
    e.preventDefault()
    this.state.players.push(this.state.form['firstName'])
    this.pushNamesToDictionary([this.state.form['firstName']])
    this.setState({ form: {['firstName']:''}})
    this.state.addPlayerBox = false
    this.forceUpdate()
  }

  render () {
    if (this.state.text.length > 3) {
      document.getElementById("textArea").scrollTop = 1000000000;
    }
    let addPlayerBox
    let showKeyboard = this.keyboardLayout()
    let bottomText = this.state.bottomText.map((sentence, senIdx) => {
      return (
        <div className="bottomText" key={sentence, senIdx} >
          {sentence}
        </div>)
    })

    if (this.state.addPlayerBox) {
      let enteringTxt = (field) => {
        let self = this
        return (e) => {
          self.setState({ form: {[field]:
            e.currentTarget.value}})
          }
        }
      addPlayerBox = <form onSubmit={this.addPlayerFromBox.bind(this)}>
                        <input id="addPlayerBox" type="text" value={this.state.form.firstName} onChange={enteringTxt('firstName')} pattern="^[a-zA-Z\s]+" placeholder="ENTER NAME" ></input>
                    </form>
  }

    return (
      <div className="keyboard">
        <div id="textArea" className = "textArea" >
          <div className = "bodyText">{this.state.text}</div>
        </div>
          {showKeyboard}
          {addPlayerBox}
        <div className = "bottomTextArea">
            {bottomText}
        </div>
      </div>
    )
  }




    //end
}




export default Keyboard
