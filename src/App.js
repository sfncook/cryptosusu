import React, { Component } from 'react'
// import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import SusuContract from '../build/contracts/Susu.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {BigNumber} from 'bignumber.js';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      contribAmt: 0,
      groupSize: 0,
      members: [],
      owner: '0x0',
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      });

      // Instantiate contract once web3 provided.
      this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.');
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract');

    const susu = contract(SusuContract);
    susu.setProvider(this.state.web3.currentProvider);

    susu.deployed().then((instance) => {
      return instance.getManyMembers.call();
    }).then((result) => {
      let getManyMembers = (new BigNumber(result)).toNumber();
      for(let i=0; i<getManyMembers; i++) {
        susu.deployed().then((instance) => {
          return instance.getMemberAtIndex.call(i);
        }).then((result) => {
          this.setState({
            members: [...this.state.members, result]
          })
          return [];
        }).catch(function(err) {
          console.error('getMembers error:', err.message);
        });
      }
    }).catch(function(err) {
      console.error('groupSize error:', err.message);
    });

    susu.deployed().then((instance) => {
      return instance.groupSize.call();
    }).then((result) => {
      let groupSize = (new BigNumber(result)).toNumber();
      return this.setState({ groupSize: groupSize });
    }).catch(function(err) {
      console.error('groupSize error:', err.message);
    });

    susu.deployed().then((instance) => {
      return instance.contribAmtWei.call();
    }).then((result) => {
      let bigNumber = new BigNumber(result);
      let contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
      return this.setState({ contribAmt: contribAmt});
    }).catch(function(err) {
      console.error('contribAmt error:', err.message);
    });

    susu.deployed().then((instance) => {
      return instance.owner.call();
    }).then((result) => {
      return this.setState({ owner: result});
    }).catch(function(err) {
      console.error('owner error:', err.message);
    });

    // const simpleStorage = contract(SimpleStorageContract);
    // simpleStorage.setProvider(this.state.web3.currentProvider);
    //
    // Declaring this for later so we can chain functions on SimpleStorage.
    // var simpleStorageInstance;
    //
    // Get accounts.
    // this.state.web3.eth.getAccounts((error, accounts) => {
    //   simpleStorage.deployed().then((instance) => {
    //     simpleStorageInstance = instance
    //
    //     // Stores a given value, 5 by default.
    //     return simpleStorageInstance.set(5, {from: accounts[0]})
    //   }).then((result) => {
    //     // Get the value from the contract to prove it worked.
    //     return simpleStorageInstance.get.call(accounts[0])
    //   }).then((result) => {
    //     // Update state with the result.
    //     return this.setState({ storageValue: result.c[0] })
    //   })
    // })
  }

  render() {
    let membersRows = this.state.members.map((member) =>
      <tr id="memberTemplate" key={member}>
        <td>{(this.state.owner===member) ? 'Owner' : ''}</td>
        <td>{member}</td>
        <td></td>
      </tr>
    );
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Crypto Susu</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
              <table className="groupTable">
                <tbody>
                <tr id="memberTemplate">
                  <th>Group Size:</th>
                  <td>{this.state.groupSize}</td>
                </tr>
                <tr id="memberTemplate">
                  <th>Contribution Amt:</th>
                  <td>{this.state.contribAmt}</td>
                </tr>
                </tbody>
              </table>

              <table className="memberTable">
                <tbody>
                  <tr>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Contribution</th>
                  </tr>
                  {membersRows}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
