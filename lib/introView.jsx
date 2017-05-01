import React from 'react'
import Store from './store'


class IntroView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: "",
      players:undefined,
      form: {}
    }
}

componentDidMount() {
  this.unsubscribe = Store.subscribe(() => {
    this.setState({players: Store.getPlayers()})
  })
}



updateForm(field) {
  let self = this
  return (e) => {
    self.setState({ form: {
        [field]: e.currentTarget.value
      }
    })
  }
}

onSubmit(e) {
  e.preventDefault()
  Store.addPlayer(this.state.form)
  this.props.entry.state.players.push(this.state.form['firstName'])
  this.setState({form: {['firstName']: ''}})
  this.forceUpdate()

}

onPlayGame(e) {
  e.preventDefault()
  this.props.entry.playGame()
}

render () {
  let players = Store.getPlayers()
  let showPlayers
  if (players) {
    showPlayers = players.map((player, idx) => {
      return <div key={idx}>{player.firstName}</div>
    })
  }

  // <button className="submitButton" onClick={this.onSubmit.bind(this)}>Enter</button>

  return (
    <div className="logInScreen">
      <div className="gameTitle" >MATRIX KEYBOARD</div>
      <form onSubmit={this.onSubmit.bind(this)}>
        <input type="text" value={this.state.form.firstName} pattern="^[a-zA-Z\s]+" placeholder="ENTER YOUR NAME" onChange={this.updateForm('firstName')}></input>
        <div className="playGame" onClick={this.onPlayGame.bind(this)}>start</div>

      </form>
      <marquee id="introMarquee" behavior="scroll" direction="left">welcome. we are the matrix. press start and ask anything. </marquee>
        <div className="playerNames">{showPlayers}</div>
    </div>
  )
}



}


export default IntroView
