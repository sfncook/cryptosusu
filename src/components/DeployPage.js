import React, { Component } from 'react'

import '../App.css'

class DeployPage extends Component {

  render() {
    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
            <table className="groupTable">
              <tbody>
              <tr id="memberTemplate">
                <th>Group Name:</th>
                <td><input/></td>
              </tr>
              <tr id="memberTemplate">
                <th>Many Partners:</th>
                <td><input/></td>
              </tr>
              <tr id="memberTemplate">
                <th>Payout Frequency:</th>
                <td><input/></td>
              </tr>
              <tr id="memberTemplate">
                <th>Contribution Amt (eth):</th>
                <td><input/></td>
              </tr>
              </tbody>
            </table>

            <div className="pure-u-1-1">
              <button onClick={(e)=>{this.clickCreate(e)}} className="btn-contribute" type="button" data-id="0">Create New Susu Group</button>
            </div>
          </div>
        </div>
      </main>
    );
  }// render()

  clickCreate(e) {
    e.preventDefault();
    console.log('create clicked');
  }
}

DeployPage.defaultProps = {
};

export default DeployPage
