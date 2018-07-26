import React, { Component } from 'react'
import {
  BrowserRouter as Router,
  Route
} from 'react-router-dom'

import GroupPage from "./components/GroupPage";
import DeployPage from "./components/DeployPage";

class App extends Component {


  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <img src={'./ethereum_susu_sm.png'} style={{height:'25px'}} alt={'CryptoSusu logo'} />
            <a href="/" className="pure-menu-heading pure-menu-link">Crypto Susu</a>
        </nav>

        <Router>
          <div>
            <Route exact path="/" component={DeployPage}/>
            <Route path="/:contractAddress" component={GroupPage}/>
          </div>
        </Router>


      </div>
    );
  }

}

export default App
