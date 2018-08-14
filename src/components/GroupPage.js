import React, { Component } from 'react'

import SusuOrigContract from '../../build/contracts/SusuOrig.json'
import SusuParentContract from '../../build/contracts/SusuParent.json'
import getWeb3 from '../utils/getWeb3'
import {BigNumber} from 'bignumber.js';

import '../css/oswald.css'
import '../css/open-sans.css'
import '../css/pure-min.css'
import '../App.css'
import PartnerRow from "./PartnerRow";
import GroupInfo from "./GroupInfo";
import ActionButtons from "./ActionButtons";
import PartnerRowEmpty from "./PartnerRowEmpty";

class GroupPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      susuContract: null,
      susuParentContract: null,
      myAddress: '',
      contribAmt: 0,
      groupName: '---',
      payoutFrequency: 'monthly',
      manyMembers: 0,
      groupSize: 0,
      ownerAddress: '',
      partnerObjects: [],
      contractAddress: props.match.params.contractAddress,
      myContrib:0.0,
      memberAddrToPayNext:0,
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
        this.instantiateSusuContract();
      })
      .catch((err) => {
        console.log('Error finding web3. err:',err);
      })
  }

  instantiateSusuContract() {
    const contract = require("truffle-contract");
    const susuParentContract = contract(SusuParentContract);
    const provider = new this.state.web3.providers.HttpProvider("http://127.0.0.1:7545");
    susuParentContract.setProvider(provider);
    this.setState({susuParentContract: susuParentContract});
  }

  instantiateContract() {
    const susuContract = this.state.web3.eth.contract(SusuOrigContract.abi).at(this.state.contractAddress);
    this.setState({susuContract:susuContract});

    let _this = this;
    this.state.web3.eth.getAccounts(function(error, accounts) {
      const myAddress = accounts[0];
      _this.setState({myAddress: myAddress});
      susuContract.getContributionForMember(myAddress, (err, contribAmtWei)=>{
        let bigNumber = new BigNumber(contribAmtWei);
        const contribAmt = _this.state.web3.fromWei(bigNumber, 'ether').toNumber();
        _this.setState({myContrib:contribAmt});
      });
    });

    // init partner objects array
    for(let i=0; i<this.state.groupSize; i++) {
      let partnerObjects = this.state.partnerObjects;
      partnerObjects.push({});
      this.setState({ partnerObjects: partnerObjects });
    }

    susuContract.groupName((err, groupName)=>{
      this.setState({groupName:groupName});
    });

    susuContract.memberIdxToPayNext((err, memberIdxToPayNextBig)=>{
      let bigNumber = new BigNumber(memberIdxToPayNextBig);
      const memberIdxToPayNext = bigNumber.toNumber();

      susuContract.getMemberAtIndex(memberIdxToPayNext, (err, memberAddrToPayNext)=>{
        this.setState({memberAddrToPayNext:memberAddrToPayNext});
      });
    });

    susuContract.contribAmtWei((err, contribAmtWei)=>{
      let bigNumber = new BigNumber(contribAmtWei);
      const contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
      this.setState({contribAmt:contribAmt});
    });

    susuContract.owner((err, ownerAddress)=>{
      this.setState({ownerAddress:ownerAddress});
      susuContract.getManyMembers((err, manyMembersBig)=>{
        let bigNumber = new BigNumber(manyMembersBig);
        const manyMembers = bigNumber.toNumber();
        this.setState({manyMembers:manyMembers});

        susuContract.groupSize((err, groupSizeBig)=>{
          let bigNumber = new BigNumber(groupSizeBig);
          const groupSize = bigNumber.toNumber();
          this.setState({groupSize:groupSize});

          for(var i=0; i<this.state.manyMembers; i++) {
            let newPartnerObj = {};
            let partnerObjects = this.state.partnerObjects;
            partnerObjects.push(newPartnerObj);
            this.setState({partnerObjects:partnerObjects});
            this.state.susuContract.getMemberAtIndex(i, this.setMemberAddressCallback(i));
          }
        });
      });
    });
  }

  render() {
    let isOwner = this.state.ownerAddress===this.state.myAddress;
    let isGroupFull = this.isGroupFull();
    let isGroupTerminated = false;
    let isMember = this.isMember();
    let isMemberToPayNext = this.state.memberAddrToPayNext===this.state.myAddress;

    return (
      <main className="container">
        <div className="pure-g">
          <button onClick={(e)=>{this.createSusu(e)}} className="btn-join" type="button">CREATE SUSU PARENT</button>
          <button onClick={(e)=>{this.getSusu(e)}} className="btn-join" type="button">GET SUSU</button>
          <button onClick={(e)=>{this.getSusuName(e)}} className="btn-join" type="button">GET SUSU NAME</button>
          <div className="pure-u-1-1" style={{paddingTop:'15px'}}>
            <GroupInfo groupName={this.state.groupName} contribAmt={this.state.contribAmt}/>
            <table className="memberTable">
              <tbody>
              {this.createPartnerRows()}
              {this.createEmptyPartnerRows()}
              </tbody>
            </table>
          </div>

          <ActionButtons
            isOwner={isOwner}
            isGroupFull={isGroupFull}
            isGroupTerminated={isGroupTerminated}
            isMember={isMember}
            susuContract={this.state.susuContract}
            myAddress={this.state.myAddress}
            web3={this.state.web3}
            contribAmt={this.state.contribAmt}
            myContrib={this.state.myContrib}
            isReadyToPayout={this.isReadyToPayout()}
            isMemberToPayNext={isMemberToPayNext}
          />

        </div>
      </main>
    );
  }// render()

  createSusu(e) {
    e.preventDefault();
    this.state.susuParentContract.deployed().then((instance)=>{
      return instance.createSusu.call('key', 2, 'name', 1);
    }).then((result)=>{console.log('result:',result);});
  }

  getSusu(e) {
    e.preventDefault();
    this.state.susuParentContract.deployed().then((instance)=>{
      return instance.getSusu.call('key');
    }).then((result)=>{console.log('result:',result);});
  }

  getSusuName(e) {
    e.preventDefault();
    this.state.susuParentContract.deployed().then((instance)=>{
      return instance.getGroupName.call('key');
    }).then((result)=>{console.log('result:',result);});
  }

  isReadyToPayout() {
    if(this.state.manyMembers===this.state.groupSize) {
      for(let partnerObj of this.state.partnerObjects) {
        if(partnerObj.contrib<this.state.contribAmt) {
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  setMemberAddressCallback(partnerIndex){
    return (err, partnerAddress)=>{
      let partnerObjects = this.state.partnerObjects;
      partnerObjects[partnerIndex].address = partnerAddress;
      this.setState({partnerObjects:partnerObjects});
      this.state.susuContract.getContributionForMember(partnerAddress, this.setMemberContribCallback(partnerIndex));
    }
  }

  setMemberContribCallback(partnerIndex){
    return (err, partnerContribWei)=>{
      let bigNumber = new BigNumber(partnerContribWei);
      const contribAmt = this.state.web3.fromWei(bigNumber, 'ether').toNumber();
      let partnerObjects = this.state.partnerObjects;
      partnerObjects[partnerIndex].contrib = contribAmt;
      this.setState({partnerObjects:partnerObjects});
    }
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
          isOwner={this.state.ownerAddress===partnerObj.address}
          partnerContrib={partnerObj.contrib}
          contractContrib={this.state.contribAmt}
          isMemberToPayNext={this.state.memberAddrToPayNext===partnerObj.address}
        />
      );
    }
    return rows;
  }
  createEmptyPartnerRows() {
    let rows = [];

    for(var i=0; i<(this.state.groupSize - this.state.manyMembers); i++) {
      rows.push(
        <PartnerRowEmpty
          key={i} // Required for ES6/React(?) array items
        />
      );
    }
    return rows;
  }

  isGroupFull() {
    return this.state.manyMembers >= this.state.groupSize;
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
