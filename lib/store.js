const Store = {

  loggedIn: false,

  state : { players: [] },

  subscribers: [],

  subscribe: function(listener){
    Store.subscribers.push(listener)
    let idx = Store.subscribers.indexOf(listener)
    return function () {
      Store.subscribers.splice(idx, 1)
    }
  },

  invokeListeners: function () {
    Store.subscribers.forEach((listener) => listener())
  },

  getPlayers() {
    return Store.state.players
  },

  addPlayer(player) {
    Store.state.players.push(player)
    this.dispatch()
  },

  dispatch: function () {
    Store.invokeListeners()
  }
}

export default Store
