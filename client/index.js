import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Home from './routes/Home'
import Player from './routes/Player'
import Metadata from './routes/Metadata'

import 'normalize.css'

class App extends React.Component {
  render = () => {
    return <BrowserRouter>
      <Switch>
        <Route path="/player/:base64Path" component={Player} />
        <Route path="/metadata/:base64Path" component={Metadata} />
        <Route path="/" component={Home} />
      </Switch>
    </BrowserRouter>
  }
}

ReactDOM.render(<App />, document.getElementById('root'))

export default App
