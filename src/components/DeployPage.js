import React, { Component } from 'react'

import '../App.css'

class DeployPage extends Component {

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
            <h1>Deploy Page</h1>
          </div>
        </div>
      </main>
    );
  }// render()
}

DeployPage.defaultProps = {
};

export default DeployPage
