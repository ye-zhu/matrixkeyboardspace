import React from 'react'
import ReactDOM from 'react-dom'
import Keyboard from './keyboard'
import IntroView from './introView'
import Store from './store'

class Entry extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      voice: ['Zosia'],
      players: [],
      loggedIn: false
    }
  }

  spinDiv () {
    let deg = 0
    setInterval(function () {
      if (deg < 360) {
        deg += 5
      } else if (deg >= 360){
        deg = 0
      }
      document.getElementById("cursorDiv").style.transform = "rotate("+deg+"deg)"
    }, 80)
  };

  cursorFunction(e) {
    var x = e.pageX;
    var y = e.pageY;
    let cursorDiv = document.getElementById("cursorDiv")
    cursorDiv.style.margin = (y-60)+"px" + " 0 0 " + (x-60)+"px"
  }

  playGame() {
    this.setState({loggedIn: true})
  }

  render () {
    let songAudio = document.getElementById("songWav")
    songAudio.volume = 0.1
    songAudio.playbackRate = 0.6

    let introView = <IntroView
      players = {this.state.players}
      entry = {this}
      />

    let keyboardView = <Keyboard
      players = {this.state.players} voice = {this.state.voice[0]}
      />

      let gameScreen
      if (this.state.loggedIn) {
        gameScreen = keyboardView
      } else {
        gameScreen = introView
      }

      let html = document.getElementsByTagName('html')[0]
        if (this.state.loggedIn) {
          this.spinDiv()
          html.style.cursor = 'none';
          html.addEventListener('mousemove', this.cursorFunction.bind(this))
        }


    return (
      <div id="view">
        <div id="cursorDiv"></div>
        {gameScreen}
      </div>
    )

  }


  //end
}

document.addEventListener("DOMContentLoaded", () => {
  let root = document.getElementById('root')
  ReactDOM.render(<Entry/>, root )
})
