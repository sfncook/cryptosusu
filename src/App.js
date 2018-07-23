import React, { Component } from 'react'

import SusuContract from '../build/contracts/Susu.json'
import getWeb3 from './utils/getWeb3'
import {BigNumber} from 'bignumber.js';

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import PartnerRow from "./components/PartnerRow";

let contractInstance;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      myAddress: '',
      contribAmt: 0,
      groupSize: 0,
      member0Address: '',
      member1Address: '',
      member2Address: '',
      member3Address: '',
      member0Contrib: 0.0,
      member1Contrib: 0.0,
      member2Contrib: 0.0,
      member3Contrib: 0.0,
      owner: '0x0',
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

  instantiateContract() {
    const contract = require('truffle-contract');

    let _this = this;
    this.state.web3.eth.getAccounts(function(error, accounts) {
      _this.setState({myAddress: accounts[0]});
    });

    const susu = contract(SusuContract);
    susu.setProvider(this.state.web3.currentProvider);

    susu.deployed().then((instance) => {
      contractInstance = instance;
      contractInstance.getMemberAtIndex.call(0).then((memberAddress)=>{
        this.setState({member0Address:memberAddress});
        contractInstance.getContributionForMember.call(memberAddress).then((memberContrib)=>{
          let bigNumber = new BigNumber(memberContrib);
          let contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
          this.setState({member0Contrib:contribAmt});
          return memberContrib;
        });
        return memberAddress;
      });
      contractInstance.getMemberAtIndex.call(1).then((memberAddress)=>{
        this.setState({member1Address:memberAddress});
        contractInstance.getContributionForMember.call(memberAddress).then((memberContrib)=>{
          let bigNumber = new BigNumber(memberContrib);
          let contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
          this.setState({member1Contrib:contribAmt});
          return memberContrib;
        });
        return memberAddress;
      });
      contractInstance.getMemberAtIndex.call(2).then((memberAddress)=>{
        this.setState({member2Address:memberAddress});
        contractInstance.getContributionForMember.call(memberAddress).then((memberContrib)=>{
          let bigNumber = new BigNumber(memberContrib);
          let contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
          this.setState({member2Contrib:contribAmt});
          return memberContrib;
        });
        return memberAddress;
      });
      contractInstance.getMemberAtIndex.call(3).then((memberAddress)=>{
        this.setState({member3Address:memberAddress});
        contractInstance.getContributionForMember.call(memberAddress).then((memberContrib)=>{
          let bigNumber = new BigNumber(memberContrib);
          let contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
          this.setState({member3Contrib:contribAmt});
          return memberContrib;
        });
        return memberAddress;
      });
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
                  <tr>
                    <th>Role</th>
                    <th>Address</th>
                    <th>Contribution</th>
                  </tr>
                  <tr id="member0" className={(this.state.myAddress===this.state.member0Address?'tr-my-account':'')}>
                    <td>{this.isOwner(this.state.member0Address) ? 'Owner' : ''}</td>
                    <td>{this.state.member0Address}</td>
                    <td className={this.getTdContribColor(this.state.member0Contrib)}>
                      {this.state.member0Contrib} ether
                    </td>
                  </tr>
                  <tr id="member1" className={(this.state.myAddress===this.state.member1Address?'tr-my-account':'')}>
                    <td>{this.isOwner(this.state.member1Address) ? 'Owner' : ''}</td>
                    <td>{this.state.member1Address}</td>
                    <td className={this.getTdContribColor(this.state.member1Contrib)}>
                      {this.state.member1Contrib} ether
                    </td>
                  </tr>
                  <tr id="member2" className={(this.state.myAddress===this.state.member2Address?'tr-my-account':'')}>
                    <td>{this.isOwner(this.state.member2Address) ? 'Owner' : ''}</td>
                    <td>{this.state.member2Address}</td>
                    <td className={this.getTdContribColor(this.state.member2Contrib)}>
                      {this.state.member2Contrib} ether
                    </td>
                  </tr>
                  <tr id="member3" className={(this.state.myAddress===this.state.member3Address?'tr-my-account':'')}>
                    <td>{this.isOwner(this.state.member3Address) ? 'Owner' : ''}</td>
                    <td>{this.state.member3Address}</td>
                    <td className={this.getTdContribColor(this.state.member3Contrib)}>
                      {this.state.member3Contrib} ether
                    </td>
                  </tr>
                  <PartnerRow partnerAddress={'new partner address'} isOwner={true} partnerContrib={1.1}/>
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
