import React, { Component } from 'react'

import SusuContract from '../../build/contracts/Susu.json'
import getWeb3 from '../utils/getWeb3'
import {BigNumber} from 'bignumber.js';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import PartnerRow from "./PartnerRow";
import GroupInfo from "./GroupInfo";
import ActionButtons from "./ActionButtons";

class GroupPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      myAddress: '',
      contribAmt: 0,
      groupName: '---',
      payoutFrequency: 'monthly',
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
      contractAddress: props.match.params.contractAddress
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
      .catch((err) => {
        console.log('Error finding web3. err:',err);
      })
  }

  setPartnerObj(contractInstance, i) {
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
    // const contract = require('truffle-contract');

    let _this = this;
    this.state.web3.eth.getAccounts(function(error, accounts) {
      _this.setState({myAddress: accounts[0]});
    });

    const loadedContract = this.state.web3.eth.contract(SusuContract.abi).at(this.state.contractAddress);

    // init partner objects array
    for(let i=0; i<this.state.groupSize; i++) {
      let partnerObjects = this.state.partnerObjects;
      partnerObjects.push({});
      this.setState({ partnerObjects: partnerObjects });
    }

    loadedContract.groupName((err, groupName)=>{
      this.setState({groupName:groupName});
    })

    loadedContract.contribAmtWei((err, contribAmtWei)=>{
      let bigNumber = new BigNumber(contribAmtWei);
      const contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
      this.setState({contribAmt:contribAmt});
    })

    loadedContract.getNumberOfMembersNeeded((err, groupSizeBig)=>{
      let bigNumber = new BigNumber(groupSizeBig);
      const groupSize = bigNumber.toNumber();
      console.log('groupSize:',groupSize);
      this.setState({groupSize:groupSize});
    })

    //   .then((partnerAddress)=>{
    //   partnerObj.address = partnerAddress;
    //   contractInstance.getContributionForMember.call(partnerAddress).then((partnerContribWei)=>{
    //     let bigNumber = new BigNumber(partnerContribWei);
    //     partnerObj.contrib = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
    //     let partnerObjects = this.state.partnerObjects;
    //     partnerObjects[i] = partnerObj;
    //     return this.setState({ partnerObjects: partnerObjects });
    //   });
    //   return partnerAddress;
    // });

    // susuContract.deployed().then((contractInstance) => {
    //   for(let i=0; i<this.state.groupSize; i++) {
    //     this.setPartnerObj(contractInstance, i);
    //   }
    //   return contractInstance;
    // });
    //
    // susuContract.deployed().then((instance) => {
    //   return instance.groupSize.call();
    // }).then((result) => {
    //   let groupSize = (new BigNumber(result)).toNumber();
    //   return this.setState({ groupSize: groupSize });
    // }).catch(function(err) {
    //   console.error('groupSize error:', err.message);
    // });
    //
    // susuContract.deployed().then((instance) => {
    //   return instance.contribAmtWei.call();
    // }).then((result) => {
    //   let bigNumber = new BigNumber(result);
    //   let contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
    //   return this.setState({ contribAmt: contribAmt});
    // }).catch(function(err) {
    //   console.error('contribAmt error:', err.message);
    // });
    //
    // susuContract.deployed().then((instance) => {
    //   return instance.owner.call();
    // }).then((result) => {
    //   return this.setState({ owner: result});
    // }).catch(function(err) {
    //   console.error('owner error:', err.message);
    // });
  }

  render() {
    let isOwner = this.isOwner(this.state.myAddress);
    let isGroupFull = this.isGroupFull();
    let isGroupTerminated = false;
    let isMember = this.isMember();

    return (
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
            <GroupInfo groupName={this.state.groupName} payoutFrequency={this.state.payoutFrequency} contribAmt={this.state.contribAmt}/>
            <table className="memberTable">
              <tbody>
              {this.createPartnerRows()}
              </tbody>
            </table>
          </div>

          <ActionButtons isOwner={isOwner} isGroupFull={isGroupFull} isGroupTerminated={isGroupTerminated} isMember={isMember}/>

        </div>
      </main>
    );
  }// render()

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

  isGroupFull() {
    let isGroupFull = true;
    for(let partnerObj of this.state.partnerObjects) {
      if(typeof partnerObj.address ===  'undefined') {
        isGroupFull = false;
        break;
      }
    }
    return this.state.groupSize>0 && isGroupFull;
  }

  isMember() {
    for(let partnerObj of this.state.partnerObjects) {
      if(partnerObj.address ===  this.state.myAddress) {
        return true;
      }
    }
    return false;
  }
}

GroupPage.defaultProps = {
};

export default GroupPage
