import React, { Component } from 'react'

import SusuContract from '../build/contracts/Susu.json'
import getWeb3 from './utils/getWeb3'
import {BigNumber} from 'bignumber.js';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import PartnerRow from "./components/PartnerRow";

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      myAddress: '',
      contribAmt: 0,
      groupSize: 4,
      member0Address: '',
      member1Address: '',
      member2Address: '',
      member3Address: '',
      member0Contrib: 0.0,
      member1Contrib: 0.0,
      member2Contrib: 0.0,
      member3Contrib: 0.0,
      owner: '0x0',
      partnerObjects: [],
    }
  }

  componentWillMount() {
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

  setParterObj(contractInstance, i) {
    let partnerObj = {};
    contractInstance.getMemberAtIndex.call(i).then((partnerAddress)=>{
      partnerObj.address = partnerAddress;
      contractInstance.getContributionForMember.call(partnerAddress).then((partnerContribWei)=>{
        let bigNumber = new BigNumber(partnerContribWei);
        partnerObj.contrib = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
        let partnerObjects = this.state.partnerObjects;
        partnerObjects[i] = partnerObj;
        return this.setState({ partnerObjects: partnerObjects });
      });
      return partnerAddress;
    });
  }

  instantiateContract() {
    const contract = require('truffle-contract');

    let _this = this;
    this.state.web3.eth.getAccounts(function(error, accounts) {
      _this.setState({myAddress: accounts[0]});
    });

    const susuContract = contract(SusuContract);
    susuContract.setProvider(this.state.web3.currentProvider);

    // init partner objects array
    for(let i=0; i<this.state.groupSize; i++) {
      let partnerObjects = this.state.partnerObjects;
      partnerObjects.push({});
      this.setState({ partnerObjects: partnerObjects });
    }

    susuContract.deployed().then((contractInstance) => {
      for(let i=0; i<this.state.groupSize; i++) {
        this.setParterObj(contractInstance, i);
      }
      return contractInstance;
    });

    susuContract.deployed().then((instance) => {
      return instance.groupSize.call();
    }).then((result) => {
      let groupSize = (new BigNumber(result)).toNumber();
      return this.setState({ groupSize: groupSize });
    }).catch(function(err) {
      console.error('groupSize error:', err.message);
    });

    susuContract.deployed().then((instance) => {
      return instance.contribAmtWei.call();
    }).then((result) => {
      let bigNumber = new BigNumber(result);
      let contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
      return this.setState({ contribAmt: contribAmt});
    }).catch(function(err) {
      console.error('contribAmt error:', err.message);
    });

    susuContract.deployed().then((instance) => {
      return instance.owner.call();
    }).then((result) => {
      return this.setState({ owner: result});
    }).catch(function(err) {
      console.error('owner error:', err.message);
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <img src={'./ethereum_susu_sm.png'} style={{height:'25px'}} alt={'CryptoSusu logo'} />
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
                  {this.createPartnerRows()}
                </tbody>
              </table>
            </div>
            <div className="pure-u-1-1">
              <button onClick={(e)=>{this.clickContribute(e)}} className="btn-contribute" type="button" data-id="0">Contribute</button>
              <button onClick={(e)=>{this.clickLeave(e)}} className="btn-leave" type="button" data-id="0">Leave Group</button>
              <button onClick={(e)=>{this.clickPayOut(e)}} className={(this.isOwner(this.state.myAddress))?'btn-pay':'btn-disabled'} type="button" data-id="0" disabled={!this.isOwner(this.state.myAddress)}>Pay Out</button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  createPartnerRows() {
    let rows = [];
    let keyId = 1;
    for(let partnerObj of this.state.partnerObjects) {
      rows.push(
        <PartnerRow
          key={keyId++} // Required for ES6/React(?) array items
          myAddress={this.state.myAddress}
          partnerAddress={partnerObj.address}
          isOwner={this.isOwner(partnerObj.address)}
          partnerContrib={partnerObj.contrib}
          contractContrib={this.state.contribAmt}
        />
      );
    }
    return rows;
  }

  isOwner(memberAddress) {
    return memberAddress === this.state.owner;
  }

  clickContribute(e) {
    e.preventDefault();
    console.log('contribute clicked');
  }

  clickLeave(e) {
    e.preventDefault();
    console.log('leave clicked');
  }

  clickPayOut(e) {
    e.preventDefault();
    console.log('payout clicked');
  }

}

export default App
