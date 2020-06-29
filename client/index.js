import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './routes/home'
import Player from './routes/player'

class App extends React.Component {
  render = () => {
    return <BrowserRouter>
      <Switch>
        <Route path="/player/:path" component={Player} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App
